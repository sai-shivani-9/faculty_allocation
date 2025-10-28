import { User } from '../types';
import { supabase } from '../lib/supabase';

const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: 'admin'
};

export class AuthService {
  static async getStoredUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) throw error;

      return (data || []).map(user => ({
        id: user.id,
        email: user.email,
        password: user.password,
        title: user.title as 'Mr.' | 'Mrs.' | 'Ms.',
        firstName: user.first_name,
        lastName: user.last_name,
        department: user.department,
        userType: user.user_type as 'Admin' | 'Professor' | 'Assistant Professor',
        joiningDate: user.joining_date,
        isActive: user.is_active,
        twoFactorEnabled: user.two_factor_enabled,
        preferencesSubmitted: false,
        preferences: []
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
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
    try {
      if (userData.email.toLowerCase() === 'admin@gmail.com') {
        return { success: false, message: 'This email address is reserved and cannot be used for registration' };
      }

      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .maybeSingle();

      if (existingUser) {
        return { success: false, message: 'Email ID already exists' };
      }

      const { error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          password: userData.password,
          title: userData.title,
          first_name: userData.firstName,
          last_name: userData.lastName,
          department: userData.department,
          user_type: userData.userType,
          joining_date: userData.joiningDate,
          is_active: true,
          two_factor_enabled: false
        });

      if (error) throw error;

      return { success: true, message: 'Registration successful' };
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, message: 'Failed to register user' };
    }
  }

  static async adminLogin(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
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
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .eq('department', department)
        .maybeSingle();

      if (error || !user) {
        return { success: false, message: 'Invalid credentials or department mismatch' };
      }

      if (!user.is_active) {
        return { success: false, message: 'Account is deactivated' };
      }

      const { data: preferences } = await supabase
        .from('preferences')
        .select('subject_id, priority')
        .eq('user_id', user.id)
        .order('priority', { ascending: true });

      const mappedUser: User = {
        id: user.id,
        email: user.email,
        password: user.password,
        title: user.title as 'Mr.' | 'Mrs.' | 'Ms.',
        firstName: user.first_name,
        lastName: user.last_name,
        department: user.department,
        userType: user.user_type as 'Admin' | 'Professor' | 'Assistant Professor',
        joiningDate: user.joining_date,
        isActive: user.is_active,
        twoFactorEnabled: user.two_factor_enabled,
        preferencesSubmitted: preferences && preferences.length > 0,
        preferences: preferences?.map(p => p.subject_id) || []
      };

      const { data: allocation } = await supabase
        .from('allocations')
        .select('subject_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (allocation) {
        mappedUser.allocatedSubject = allocation.subject_id;
      }

      this.setCurrentUser(mappedUser);
      return { success: true, message: 'Login successful', user: mappedUser };
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, message: 'Failed to login' };
    }
  }

  static async updateUserPreferences(userId: string, preferences: string[]): Promise<void> {
    try {
      await supabase
        .from('preferences')
        .delete()
        .eq('user_id', userId);

      const academicYear = new Date().getFullYear().toString();
      const preferencesData = preferences.map((subjectId, index) => ({
        user_id: userId,
        subject_id: subjectId,
        priority: index + 1,
        academic_year: academicYear
      }));

      const { error } = await supabase
        .from('preferences')
        .insert(preferencesData);

      if (error) throw error;

      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.preferences = preferences;
        currentUser.preferencesSubmitted = true;
        this.setCurrentUser(currentUser);
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  static isValidSemester(): { isValid: boolean; allowedSemester: 'odd' | 'even' } {
    const currentMonth = new Date().getMonth() + 1;

    if (currentMonth >= 7 && currentMonth <= 12) {
      return { isValid: true, allowedSemester: 'odd' };
    } else {
      return { isValid: true, allowedSemester: 'even' };
    }
  }

  static async updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: isActive })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}
