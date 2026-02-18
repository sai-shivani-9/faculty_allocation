export interface User {
  id: string;
  email: string;
  password: string;
  title: 'Mr.' | 'Mrs.' | 'Ms.';
  firstName: string;
  lastName: string;
  department: string;
  userType: 'Admin' | 'Professor' | 'Assistant Professor';
  joiningDate: string;
  isActive: boolean;
  preferences?: string[];
  preferencesSubmitted: boolean;
  preferencesSubmittedAt?: number;
  allocatedSubject?: string;
  twoFactorEnabled: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  year: number;
  semester: number;
  credits: number;
  type: 'Core' | 'Elective' | 'Lab' | 'Project';
  eligibleFor: ('Professor' | 'Assistant Professor')[];
}

export interface Department {
  id: string;
  name: string;
  code: string;
  subjects: Subject[];
}

export interface Allocation {
  id: string;
  facultyId: string;
  subjectId: string;
  academicYear: string;
  semester: number;
  allocationDate: string;
  status: 'Allocated' | 'Pending' | 'Swapped';
}

export interface AllocationRequest {
  department: string;
  academicYear: string;
  semester: number;
}

export interface DashboardStats {
  totalFaculty: number;
  totalSubjects: number;
  allocatedSubjects: number;
  pendingAllocations: number;
  professors: number;
  assistantProfessors: number;
}