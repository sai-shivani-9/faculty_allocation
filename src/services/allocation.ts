import { Subject, Allocation } from '../types';
import { supabase } from '../lib/supabase';

export class AllocationService {
  static async getAllocations(): Promise<Allocation[]> {
    try {
      const { data, error } = await supabase
        .from('allocations')
        .select('*');

      if (error) throw error;

      return (data || []).map(alloc => ({
        id: alloc.id,
        facultyId: alloc.user_id,
        subjectId: alloc.subject_id,
        academicYear: alloc.academic_year,
        semester: alloc.semester,
        allocationDate: alloc.allocated_at,
        status: alloc.status as 'Allocated' | 'Pending' | 'Swapped'
      }));
    } catch (error) {
      console.error('Error fetching allocations:', error);
      return [];
    }
  }

  static async performAllocation(): Promise<{ success: boolean; message: string; allocations?: Allocation[] }> {
    try {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, department, user_type, joining_date, is_active');

      if (usersError) throw usersError;

      const { data: existingPreferences, error: prefsError } = await supabase
        .from('preferences')
        .select('user_id, subject_id, priority')
        .order('priority', { ascending: true });

      if (prefsError) throw prefsError;

      const usersWithPrefs = users?.filter(u =>
        existingPreferences?.some(p => p.user_id === u.id) && u.is_active
      ) || [];

      if (usersWithPrefs.length === 0) {
        return { success: false, message: 'No users with submitted preferences found' };
      }

      const departments = [
        'Computer Science and Engineering',
        'Electronics and Communication Engineering',
        'Instrumentation and Control Engineering'
      ];

      const allAllocations: Allocation[] = [];
      let totalAllocated = 0;

      await supabase.from('allocations').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      for (const department of departments) {
        const departmentUsers = usersWithPrefs.filter(u => u.department === department);

        if (departmentUsers.length === 0) continue;

        const professors = departmentUsers.filter(u => u.user_type === 'Professor');
        const assistantProfessors = departmentUsers.filter(u => u.user_type === 'Assistant Professor');

        const sortByPriority = (a: any, b: any) => {
          const dateA = new Date(a.joining_date);
          const dateB = new Date(b.joining_date);
          return dateA.getTime() - dateB.getTime();
        };

        professors.sort(sortByPriority);
        assistantProfessors.sort(sortByPriority);

        const { data: subjects } = await supabase
          .from('subjects')
          .select('*')
          .eq('department', department);

        const allocatedSubjects = new Set<string>();

        const allocateForGroup = async (userGroup: any[]) => {
          for (const user of userGroup) {
            const userPrefs = existingPreferences
              ?.filter(p => p.user_id === user.id)
              .sort((a, b) => a.priority - b.priority) || [];

            for (const pref of userPrefs) {
              if (!allocatedSubjects.has(pref.subject_id)) {
                const subject = subjects?.find(s => s.id === pref.subject_id);
                if (subject) {
                  const allocation: Allocation = {
                    id: '',
                    facultyId: user.id,
                    subjectId: pref.subject_id,
                    academicYear: new Date().getFullYear().toString(),
                    semester: subject.semester,
                    allocationDate: new Date().toISOString(),
                    status: 'Allocated'
                  };

                  allAllocations.push(allocation);
                  allocatedSubjects.add(pref.subject_id);
                  totalAllocated++;
                  break;
                }
              }
            }
          }
        };

        await allocateForGroup(professors);
        await allocateForGroup(assistantProfessors);
      }

      if (allAllocations.length > 0) {
        const allocationsToInsert = allAllocations.map(a => ({
          user_id: a.facultyId,
          subject_id: a.subjectId,
          academic_year: a.academicYear,
          semester: a.semester,
          status: a.status
        }));

        const { error: insertError } = await supabase
          .from('allocations')
          .insert(allocationsToInsert);

        if (insertError) throw insertError;
      }

      return {
        success: true,
        message: `Allocation completed successfully across all departments. ${totalAllocated} subjects allocated based on hierarchy and joining date priority.`,
        allocations: allAllocations
      };
    } catch (error) {
      console.error('Error performing allocation:', error);
      return { success: false, message: 'Failed to perform allocation' };
    }
  }

  static async getAllocationByUser(userId: string): Promise<Allocation | undefined> {
    try {
      const { data, error } = await supabase
        .from('allocations')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) return undefined;

      return {
        id: data.id,
        facultyId: data.user_id,
        subjectId: data.subject_id,
        academicYear: data.academic_year,
        semester: data.semester,
        allocationDate: data.allocated_at,
        status: data.status as 'Allocated' | 'Pending' | 'Swapped'
      };
    } catch (error) {
      console.error('Error fetching allocation:', error);
      return undefined;
    }
  }

  static async getSubjectById(subjectId: string): Promise<Subject | undefined> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', subjectId)
        .maybeSingle();

      if (error || !data) return undefined;

      return {
        id: data.id,
        name: data.name,
        code: data.code,
        year: data.year,
        semester: data.semester,
        credits: data.credits,
        type: data.type as 'Core' | 'Elective' | 'Lab' | 'Project',
        eligibleFor: data.eligible_for as ('Professor' | 'Assistant Professor')[]
      };
    } catch (error) {
      console.error('Error fetching subject:', error);
      return undefined;
    }
  }

  static async getDashboardStats(): Promise<any> {
    try {
      const { count: totalFaculty } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      const { count: totalSubjects } = await supabase
        .from('subjects')
        .select('*', { count: 'exact', head: true });

      const { count: allocatedSubjects } = await supabase
        .from('allocations')
        .select('*', { count: 'exact', head: true });

      const { count: professors } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'Professor');

      const { count: assistantProfessors } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'Assistant Professor');

      const { data: prefsData } = await supabase
        .from('preferences')
        .select('user_id');

      const uniqueUsersWithPrefs = new Set(prefsData?.map(p => p.user_id)).size;

      const { data: usersWithPrefs } = await supabase
        .from('users')
        .select('id');

      const { data: allocatedUsers } = await supabase
        .from('allocations')
        .select('user_id');

      const allocatedUserIds = new Set(allocatedUsers?.map(a => a.user_id));
      const pendingAllocations = uniqueUsersWithPrefs - allocatedUserIds.size;

      return {
        totalFaculty: totalFaculty || 0,
        totalSubjects: totalSubjects || 0,
        allocatedSubjects: allocatedSubjects || 0,
        pendingAllocations: Math.max(0, pendingAllocations),
        professors: professors || 0,
        assistantProfessors: assistantProfessors || 0,
        submittedPreferences: uniqueUsersWithPrefs
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalFaculty: 0,
        totalSubjects: 0,
        allocatedSubjects: 0,
        pendingAllocations: 0,
        professors: 0,
        assistantProfessors: 0,
        submittedPreferences: 0
      };
    }
  }
}
