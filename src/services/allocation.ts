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
    return this.allocateWithStrategy('top-top');
  }

  static async performReverseAllocation(): Promise<{ success: boolean; message: string; allocations?: Allocation[] }> {
    return this.allocateWithStrategy('top-bottom');
  }

  static async performRandomAllocation(): Promise<{ success: boolean; message: string; allocations?: Allocation[] }> {
    return this.allocateWithStrategy('top-random');
  }

  private static sortUsersByPriority(users: User[]): User[] {
    return [...users].sort((a, b) => {
      const dateA = new Date(a.joiningDate);
      const dateB = new Date(b.joiningDate);

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }

      const submitTimeA = a.preferencesSubmittedAt || 0;
      const submitTimeB = b.preferencesSubmittedAt || 0;
      return submitTimeA - submitTimeB;
    });
  }

  private static allocateSubjectsToUser(
    user: User,
    preferences: string[],
    allocatedSubjects: Set<string>,
    eligibleSubjects: Subject[],
    strategy: 'top-top' | 'top-bottom' | 'top-random',
    allAllocations: Allocation[]
  ): number {
    if (!preferences || preferences.length === 0) return 0;

    let allocated = 0;
    const availablePrefs = preferences.filter(id => !allocatedSubjects.has(id));

    if (strategy === 'top-top') {
      for (let i = 0; i < Math.min(2, availablePrefs.length); i++) {
        const subjectId = availablePrefs[i];
        if (eligibleSubjects.find(s => s.id === subjectId)) {
          allocated += this.addAllocation(user.id, subjectId, allocatedSubjects, eligibleSubjects, allAllocations);
        }
      }
    } else if (strategy === 'top-bottom') {
      const topSubject = availablePrefs[0];
      const bottomSubject = availablePrefs[availablePrefs.length - 1];

      if (topSubject && eligibleSubjects.find(s => s.id === topSubject)) {
        allocated += this.addAllocation(user.id, topSubject, allocatedSubjects, eligibleSubjects, allAllocations);
      }

      if (bottomSubject && topSubject !== bottomSubject && !allocatedSubjects.has(bottomSubject) && eligibleSubjects.find(s => s.id === bottomSubject)) {
        allocated += this.addAllocation(user.id, bottomSubject, allocatedSubjects, eligibleSubjects, allAllocations);
      }
    } else if (strategy === 'top-random') {
      const topSubject = availablePrefs[0];
      if (topSubject && eligibleSubjects.find(s => s.id === topSubject)) {
        allocated += this.addAllocation(user.id, topSubject, allocatedSubjects, eligibleSubjects, allAllocations);
      }

      const remainingAvailable = availablePrefs.filter(id => !allocatedSubjects.has(id));
      if (remainingAvailable.length > 0) {
        const randomSubject = remainingAvailable[Math.floor(Math.random() * remainingAvailable.length)];
        if (eligibleSubjects.find(s => s.id === randomSubject)) {
          allocated += this.addAllocation(user.id, randomSubject, allocatedSubjects, eligibleSubjects, allAllocations);
        }
      }
    }

    return allocated;
  }

  private static addAllocation(
    facultyId: string,
    subjectId: string,
    allocatedSubjects: Set<string>,
    eligibleSubjects: Subject[],
    allAllocations: Allocation[]
  ): number {
    if (allocatedSubjects.has(subjectId)) return 0;

    const subject = eligibleSubjects.find(s => s.id === subjectId);
    if (!subject) return 0;

    const allocation: Allocation = {
      id: `alloc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      facultyId: facultyId,
      subjectId: subjectId,
      academicYear: new Date().getFullYear().toString(),
      semester: subject.semester,
      allocationDate: new Date().toISOString(),
      status: 'Allocated'
    };

    allAllocations.push(allocation);
    allocatedSubjects.add(subjectId);
    return 1;
  }

  private static async allocateWithStrategy(
    strategy: 'top-top' | 'top-bottom' | 'top-random'
  ): Promise<{ success: boolean; message: string; allocations?: Allocation[] }> {
    const users = AuthService.getStoredUsers();
    const allAllocations: Allocation[] = [];

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

      const professors = departmentUsers.filter(user => user.userType === 'Professor');
      const assistantProfessors = departmentUsers.filter(user => user.userType === 'Assistant Professor');

      const sortedProfessors = this.sortUsersByPriority(professors);
      const sortedAssistants = this.sortUsersByPriority(assistantProfessors);

      const subjects = getSubjectsByDepartment(department);
      const allocatedSubjects = new Set<string>();

      const professorSubjects = subjects.filter(s => s.eligibleFor.includes('Professor'));
      for (const professor of sortedProfessors) {
        if (professor.preferences) {
          totalAllocated += this.allocateSubjectsToUser(
            professor,
            professor.preferences,
            allocatedSubjects,
            professorSubjects,
            strategy,
            allAllocations
          );
        }
      }

      const assistantSubjects = subjects.filter(s => s.eligibleFor.includes('Assistant Professor'));
      for (const assistant of sortedAssistants) {
        if (assistant.preferences) {
          totalAllocated += this.allocateSubjectsToUser(
            assistant,
            assistant.preferences,
            allocatedSubjects,
            assistantSubjects,
            strategy,
            allAllocations
          );
        }
      }
    }

    AuthService.storeUsers(users);
    this.storeAllocations(allAllocations);

    const strategyText = {
      'top-top': 'Top-Top (Both subjects from top preferences)',
      'top-bottom': 'Top-Bottom (One from top, one from bottom)',
      'top-random': 'Top-Random (One from top, one random)'
    }[strategy];

    return {
      success: true,
      message: `Allocation completed using ${strategyText}. ${totalAllocated} subjects allocated across all departments. Each subject uniquely assigned.`,
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