/*
  # Faculty Subject Allocation System - Initial Schema

  ## Overview
  This migration creates the core database schema for a faculty subject allocation system 
  with user authentication, subject management, preferences, and allocations.

  ## Tables Created

  ### 1. users
  Faculty user accounts with authentication and profile information.
  - `id` (uuid, primary key) - Unique identifier
  - `email` (text, unique) - User email address
  - `password` (text) - Hashed password
  - `title` (text) - Professional title (Mr., Mrs., Ms.)
  - `first_name` (text) - First name
  - `last_name` (text) - Last name
  - `department` (text) - Department name
  - `user_type` (text) - Role type (Admin, Professor, Assistant Professor)
  - `joining_date` (date) - Employment start date
  - `is_active` (boolean) - Account status
  - `two_factor_enabled` (boolean) - 2FA status
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### 2. subjects
  Course/subject catalog with eligibility rules.
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Subject name
  - `code` (text, unique) - Subject code
  - `year` (integer) - Academic year (1-4)
  - `semester` (integer) - Semester number (1-8)
  - `credits` (integer) - Credit hours
  - `type` (text) - Subject type (Core, Elective, Lab, Project)
  - `eligible_for` (text[]) - Eligible user types
  - `department` (text) - Department offering the subject
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### 3. preferences
  Faculty subject preference submissions with priority ranking.
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - Reference to users table
  - `subject_id` (uuid, foreign key) - Reference to subjects table
  - `priority` (integer) - Preference ranking (lower = higher priority)
  - `academic_year` (text) - Academic year for preference
  - `submitted_at` (timestamptz) - Submission timestamp
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. allocations
  Final subject allocations to faculty members.
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - Reference to users table
  - `subject_id` (uuid, foreign key) - Reference to subjects table
  - `academic_year` (text) - Academic year for allocation
  - `semester` (integer) - Semester number
  - `status` (text) - Allocation status (Allocated, Pending, Swapped)
  - `allocated_at` (timestamptz) - Allocation timestamp
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ## Security
  - RLS enabled on all tables
  - Authenticated users can read their own data
  - Only admins can perform write operations
  - Preferences and allocations restricted to respective users

  ## Indexes
  - Created on foreign keys for performance
  - Created on frequently queried columns (email, department, user_type)
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  title text NOT NULL CHECK (title IN ('Mr.', 'Mrs.', 'Ms.')),
  first_name text NOT NULL,
  last_name text NOT NULL,
  department text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('Admin', 'Professor', 'Assistant Professor')),
  joining_date date NOT NULL,
  is_active boolean DEFAULT true,
  two_factor_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  year integer NOT NULL CHECK (year BETWEEN 1 AND 4),
  semester integer NOT NULL CHECK (semester BETWEEN 1 AND 8),
  credits integer NOT NULL CHECK (credits > 0),
  type text NOT NULL CHECK (type IN ('Core', 'Elective', 'Lab', 'Project')),
  eligible_for text[] NOT NULL,
  department text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create preferences table
CREATE TABLE IF NOT EXISTS preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  priority integer NOT NULL CHECK (priority > 0),
  academic_year text NOT NULL,
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, subject_id, academic_year)
);

-- Create allocations table
CREATE TABLE IF NOT EXISTS allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  academic_year text NOT NULL,
  semester integer NOT NULL CHECK (semester BETWEEN 1 AND 8),
  status text NOT NULL DEFAULT 'Allocated' CHECK (status IN ('Allocated', 'Pending', 'Swapped')),
  allocated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, academic_year, semester)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_subjects_department ON subjects(department);
CREATE INDEX IF NOT EXISTS idx_subjects_semester ON subjects(semester);
CREATE INDEX IF NOT EXISTS idx_preferences_user_id ON preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_preferences_subject_id ON preferences(subject_id);
CREATE INDEX IF NOT EXISTS idx_allocations_user_id ON allocations(user_id);
CREATE INDEX IF NOT EXISTS idx_allocations_subject_id ON allocations(subject_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid)
  WITH CHECK (id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid);

CREATE POLICY "Admin can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'admin'
  );

CREATE POLICY "Admin can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'admin'
  );

-- RLS Policies for subjects table
CREATE POLICY "Everyone can view subjects"
  ON subjects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert subjects"
  ON subjects FOR INSERT
  TO authenticated
  WITH CHECK (
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'admin'
  );

CREATE POLICY "Admin can update subjects"
  ON subjects FOR UPDATE
  TO authenticated
  USING (
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'admin'
  )
  WITH CHECK (
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'admin'
  );

CREATE POLICY "Admin can delete subjects"
  ON subjects FOR DELETE
  TO authenticated
  USING (
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'admin'
  );

-- RLS Policies for preferences table
CREATE POLICY "Users can view their own preferences"
  ON preferences FOR SELECT
  TO authenticated
  USING (user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid);

CREATE POLICY "Admin can view all preferences"
  ON preferences FOR SELECT
  TO authenticated
  USING (
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'admin'
  );

CREATE POLICY "Users can insert their own preferences"
  ON preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid);

CREATE POLICY "Users can update their own preferences"
  ON preferences FOR UPDATE
  TO authenticated
  USING (user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid)
  WITH CHECK (user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid);

CREATE POLICY "Users can delete their own preferences"
  ON preferences FOR DELETE
  TO authenticated
  USING (user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid);

-- RLS Policies for allocations table
CREATE POLICY "Users can view their own allocations"
  ON allocations FOR SELECT
  TO authenticated
  USING (user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid);

CREATE POLICY "Admin can view all allocations"
  ON allocations FOR SELECT
  TO authenticated
  USING (
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'admin'
  );

CREATE POLICY "Admin can insert allocations"
  ON allocations FOR INSERT
  TO authenticated
  WITH CHECK (
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'admin'
  );

CREATE POLICY "Admin can update allocations"
  ON allocations FOR UPDATE
  TO authenticated
  USING (
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'admin'
  )
  WITH CHECK (
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'admin'
  );

CREATE POLICY "Admin can delete allocations"
  ON allocations FOR DELETE
  TO authenticated
  USING (
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'admin'
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at
  BEFORE UPDATE ON subjects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_allocations_updated_at
  BEFORE UPDATE ON allocations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();