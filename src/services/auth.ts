import { User } from '../types';

const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: 'admin'
};

export class AuthService {
  static getStoredUsers(): User[] {
    const users = localStorage.getItem('faculty_users');
    return users ? JSON.parse(users) : [];
  }

  static storeUsers(users: User[]): void {
    localStorage.setItem('faculty_users', JSON.stringify(users));
  }

  static getCurrentUser(): User | null {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  static logout(): void {
    localStorage.removeItem('current_user');
  }

  static async register(userData: Omit<User, 'id' | 'isActive' | 'preferencesSubmitted' | 'twoFactorEnabled'>): Promise<{ success: boolean; message: string }> {
    const users = this.getStoredUsers();
    
    // Check if email already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      return { success: false, message: 'Email ID already exists' };
    }

    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isActive: true,
      preferencesSubmitted: false,
      twoFactorEnabled: false
    };

    users.push(newUser);
    this.storeUsers(users);

    return { success: true, message: 'Registration successful' };
  }

  static async adminLogin(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    // Check admin credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser: User = {
        id: 'admin_001',
        email: ADMIN_CREDENTIALS.email,
        password: ADMIN_CREDENTIALS.password,
        title: 'Mr.',
        firstName: 'System',
        lastName: 'Administrator',
        department: 'Computer Science and Engineering',
        userType: 'Admin',
        joiningDate: '2020-01-01',
        isActive: true,
        preferencesSubmitted: false,
        twoFactorEnabled: false
      };

      this.setCurrentUser(adminUser);
      return { success: true, message: 'Admin login successful', user: adminUser };
    }

    return { success: false, message: 'Invalid admin credentials' };
  }
  static async login(email: string, password: string, department: string): Promise<{ success: boolean; message: string; user?: User }> {

    const users = this.getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password && u.department === department);

    if (!user) {
      return { success: false, message: 'Invalid credentials or department mismatch' };
    }

    if (!user.isActive) {
      return { success: false, message: 'Account is deactivated' };
    }

    this.setCurrentUser(user);
    return { success: true, message: 'Login successful', user };
  }

  static updateUserPreferences(userId: string, preferences: string[]): void {
    const users = this.getStoredUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].preferences = preferences;
      users[userIndex].preferencesSubmitted = true;
      this.storeUsers(users);
      
      // Update current user if it's the same user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        users[userIndex] && this.setCurrentUser(users[userIndex]);
      }
    }
  }

  static isValidSemester(): { isValid: boolean; allowedSemester: 'odd' | 'even' } {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    
    // July to December (7-12): Odd semester
    // January to June (1-6): Even semester
    if (currentMonth >= 7 && currentMonth <= 12) {
      return { isValid: true, allowedSemester: 'odd' };
    } else {
      return { isValid: true, allowedSemester: 'even' };
    }
  }
}