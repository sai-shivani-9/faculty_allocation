import { User, Subject, Allocation } from '../types';
import { AuthService } from './auth';
import { getSubjectsByDepartment } from '../data/subjects';

export class AllocationService {
  static getAllocations(): Allocation[] {
    const allocations = localStorage.getItem('allocations');
    return allocations ? JSON.parse(allocations) : [];
  }

  static storeAllocations(allocations: Allocation[]): void {
    localStorage.setItem('allocations', JSON.stringify(allocations));
  }

  static async performAllocation(): Promise<{ success: boolean; message: string; allocations?: Allocation[] }> {
    return this.performAllocationWithOrder('top-to-bottom');
  }

  static async performReverseAllocation(): Promise<{ success: boolean; message: string; allocations?: Allocation[] }> {
    return this.performAllocationWithOrder('bottom-to-top');
  }

  private static async performAllocationWithOrder(order: 'top-to-bottom' | 'bottom-to-top'): Promise<{ success: boolean; message: string; allocations?: Allocation[] }> {
    const users = AuthService.getStoredUsers();
    const allAllocations: Allocation[] = [];

    // Get all departments
    const departments = [
      'Computer Science and Engineering',
      'Electronics and Communication Engineering',
      'Instrumentation and Control Engineering'
    ];

    let totalAllocated = 0;

    for (const department of departments) {
      const departmentUsers = users.filter(user =>
        user.department === department && user.preferencesSubmitted
      );

      if (departmentUsers.length === 0) continue;

      // Separate by designation
      const professors = departmentUsers.filter(user => user.userType === 'Professor');
      const assistantProfessors = departmentUsers.filter(user => user.userType === 'Assistant Professor');

      // Sort by joining date - direction depends on order parameter
      const sortByPriority = (a: User, b: User) => {
        const dateA = new Date(a.joiningDate);
        const dateB = new Date(b.joiningDate);

        if (dateA.getTime() !== dateB.getTime()) {
          // Top-to-bottom: earlier first (ascending)
          // Bottom-to-top: later first (descending)
          return order === 'top-to-bottom'
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }

        // If joining dates are same, use registration timestamp (user ID contains timestamp)
        const timestampA = parseInt(a.id.split('_')[1] || '0');
        const timestampB = parseInt(b.id.split('_')[1] || '0');
        return order === 'top-to-bottom'
          ? timestampA - timestampB
          : timestampB - timestampA;
      };

      professors.sort(sortByPriority);
      assistantProfessors.sort(sortByPriority);

      // Get subjects for department
      const subjects = getSubjectsByDepartment(department);
      const allocatedSubjects = new Set<string>();

      // Helper function to allocate subjects for a user group
      const allocateForGroup = (userGroup: User[], eligibleSubjects: Subject[]) => {
        userGroup.forEach(user => {
          if (!user.preferences) return;

          for (const subjectId of user.preferences) {
            if (!allocatedSubjects.has(subjectId)) {
              const subject = eligibleSubjects.find(s => s.id === subjectId);
              if (subject) {
                const allocation: Allocation = {
                  id: `alloc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                  facultyId: user.id,
                  subjectId: subjectId,
                  academicYear: new Date().getFullYear().toString(),
                  semester: subject.semester,
                  allocationDate: new Date().toISOString(),
                  status: 'Allocated'
                };

                allAllocations.push(allocation);
                allocatedSubjects.add(subjectId);
                totalAllocated++;

                // Update user's allocated subject
                user.allocatedSubject = subjectId;
                break;
              }
            }
          }
        });
      };

      // Allocate for professors first (1st and 2nd year subjects)
      const professorSubjects = subjects.filter(s => s.eligibleFor.includes('Professor'));
      allocateForGroup(professors, professorSubjects);

      // Then allocate for assistant professors (3rd and 4th year subjects)
      const assistantProfessorSubjects = subjects.filter(s => s.eligibleFor.includes('Assistant Professor'));
      allocateForGroup(assistantProfessors, assistantProfessorSubjects);
    }

    // Update users with allocated subjects
    AuthService.storeUsers(users);

    // Store allocations
    this.storeAllocations(allAllocations);

    const orderText = order === 'top-to-bottom' ? 'Top to Bottom (Senior to Junior)' : 'Bottom to Top (Junior to Senior)';
    return {
      success: true,
      message: `Allocation completed successfully across all departments using ${orderText} approach. ${totalAllocated} subjects allocated. Each subject uniquely assigned to prevent duplicate allocations.`,
      allocations: allAllocations
    };
  }

  static getAllocationByUser(userId: string): Allocation | undefined {
    const allocations = this.getAllocations();
    return allocations.find(alloc => alloc.facultyId === userId);
  }

  static getSubjectById(subjectId: string): Subject | undefined {
    // Search across all departments
    const allSubjects = [
      ...getSubjectsByDepartment('Computer Science and Engineering'),
      ...getSubjectsByDepartment('Electronics and Communication Engineering'),
      ...getSubjectsByDepartment('Instrumentation and Control Engineering')
    ];
    return allSubjects.find(subject => subject.id === subjectId);
  }

  static getDashboardStats(): any {
    const users = AuthService.getStoredUsers();
    const allocations = this.getAllocations();
    
    return {
      totalFaculty: users.length,
      totalSubjects: getSubjectsByDepartment('Computer Science and Engineering').length +
                    getSubjectsByDepartment('Electronics and Communication Engineering').length +
                    getSubjectsByDepartment('Instrumentation and Control Engineering').length,
      allocatedSubjects: allocations.length,
      pendingAllocations: users.filter(u => u.preferencesSubmitted && !u.allocatedSubject).length,
      professors: users.filter(u => u.userType === 'Professor').length,
      assistantProfessors: users.filter(u => u.userType === 'Assistant Professor').length,
      submittedPreferences: users.filter(u => u.preferencesSubmitted).length
    };
  }
}