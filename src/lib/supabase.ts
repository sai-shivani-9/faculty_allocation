import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password: string;
          title: 'Mr.' | 'Mrs.' | 'Ms.';
          first_name: string;
          last_name: string;
          department: string;
          user_type: 'Admin' | 'Professor' | 'Assistant Professor';
          joining_date: string;
          is_active: boolean;
          two_factor_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          code: string;
          year: number;
          semester: number;
          credits: number;
          type: 'Core' | 'Elective' | 'Lab' | 'Project';
          eligible_for: string[];
          department: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['subjects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['subjects']['Insert']>;
      };
      preferences: {
        Row: {
          id: string;
          user_id: string;
          subject_id: string;
          priority: number;
          academic_year: string;
          submitted_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['preferences']['Row'], 'id' | 'created_at' | 'submitted_at'>;
        Update: Partial<Database['public']['Tables']['preferences']['Insert']>;
      };
      allocations: {
        Row: {
          id: string;
          user_id: string;
          subject_id: string;
          academic_year: string;
          semester: number;
          status: 'Allocated' | 'Pending' | 'Swapped';
          allocated_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['allocations']['Row'], 'id' | 'created_at' | 'updated_at' | 'allocated_at'>;
        Update: Partial<Database['public']['Tables']['allocations']['Insert']>;
      };
    };
  };
}
