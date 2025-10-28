import { supabase } from '../lib/supabase';
import { cseSubjects, eceSubjects, iceSubjects } from '../data/subjects';
import { Subject } from '../types';

export class SubjectService {
  static async seedSubjects(): Promise<{ success: boolean; message: string }> {
    try {
      const { count } = await supabase
        .from('subjects')
        .select('*', { count: 'exact', head: true });

      if (count && count > 0) {
        return { success: true, message: 'Subjects already seeded' };
      }

      const allSubjects = [...cseSubjects, ...eceSubjects, ...iceSubjects];

      const subjectsToInsert = allSubjects.map(subject => ({
        id: subject.id,
        name: subject.name,
        code: subject.code,
        year: subject.year,
        semester: subject.semester,
        credits: subject.credits,
        type: subject.type,
        eligible_for: subject.eligibleFor,
        department: subject.id.startsWith('sub_')
          ? 'Computer Science and Engineering'
          : subject.id.startsWith('ece_')
          ? 'Electronics and Communication Engineering'
          : 'Instrumentation and Control Engineering'
      }));

      const { error } = await supabase
        .from('subjects')
        .insert(subjectsToInsert);

      if (error) throw error;

      return { success: true, message: `Successfully seeded ${allSubjects.length} subjects` };
    } catch (error) {
      console.error('Error seeding subjects:', error);
      return { success: false, message: 'Failed to seed subjects' };
    }
  }

  static async getSubjectsByDepartment(department: string): Promise<Subject[]> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('department', department)
        .order('semester', { ascending: true })
        .order('year', { ascending: true });

      if (error) throw error;

      return (data || []).map(subject => ({
        id: subject.id,
        name: subject.name,
        code: subject.code,
        year: subject.year,
        semester: subject.semester,
        credits: subject.credits,
        type: subject.type as 'Core' | 'Elective' | 'Lab' | 'Project',
        eligibleFor: subject.eligible_for as ('Professor' | 'Assistant Professor')[]
      }));
    } catch (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }
  }

  static async getAllSubjects(): Promise<Subject[]> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('department', { ascending: true })
        .order('semester', { ascending: true });

      if (error) throw error;

      return (data || []).map(subject => ({
        id: subject.id,
        name: subject.name,
        code: subject.code,
        year: subject.year,
        semester: subject.semester,
        credits: subject.credits,
        type: subject.type as 'Core' | 'Elective' | 'Lab' | 'Project',
        eligibleFor: subject.eligible_for as ('Professor' | 'Assistant Professor')[]
      }));
    } catch (error) {
      console.error('Error fetching all subjects:', error);
      return [];
    }
  }

  static async addSubject(subject: Omit<Subject, 'id'> & { department: string }): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('subjects')
        .insert({
          name: subject.name,
          code: subject.code,
          year: subject.year,
          semester: subject.semester,
          credits: subject.credits,
          type: subject.type,
          eligible_for: subject.eligibleFor,
          department: subject.department
        });

      if (error) throw error;

      return { success: true, message: 'Subject added successfully' };
    } catch (error) {
      console.error('Error adding subject:', error);
      return { success: false, message: 'Failed to add subject' };
    }
  }

  static async updateSubject(id: string, updates: Partial<Subject> & { department?: string }): Promise<{ success: boolean; message: string }> {
    try {
      const updateData: any = {};

      if (updates.name) updateData.name = updates.name;
      if (updates.code) updateData.code = updates.code;
      if (updates.year) updateData.year = updates.year;
      if (updates.semester) updateData.semester = updates.semester;
      if (updates.credits) updateData.credits = updates.credits;
      if (updates.type) updateData.type = updates.type;
      if (updates.eligibleFor) updateData.eligible_for = updates.eligibleFor;
      if (updates.department) updateData.department = updates.department;

      const { error } = await supabase
        .from('subjects')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      return { success: true, message: 'Subject updated successfully' };
    } catch (error) {
      console.error('Error updating subject:', error);
      return { success: false, message: 'Failed to update subject' };
    }
  }

  static async deleteSubject(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true, message: 'Subject deleted successfully' };
    } catch (error) {
      console.error('Error deleting subject:', error);
      return { success: false, message: 'Failed to delete subject' };
    }
  }
}
