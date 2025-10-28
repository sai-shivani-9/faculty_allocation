# Faculty Subject Allocation System - Backend Documentation

## Overview

This application uses Supabase as the backend database for managing faculty, subjects, preferences, and allocations.

## Database Schema

### Tables

#### 1. users
Stores faculty member information and authentication data.

**Columns:**
- `id` (uuid, primary key)
- `email` (text, unique) - User email address
- `password` (text) - Password (in production, use Supabase Auth instead)
- `title` (text) - Mr., Mrs., or Ms.
- `first_name` (text)
- `last_name` (text)
- `department` (text) - Department name
- `user_type` (text) - Admin, Professor, or Assistant Professor
- `joining_date` (date) - Employment start date
- `is_active` (boolean) - Account status
- `two_factor_enabled` (boolean) - 2FA status
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

#### 2. subjects
Course catalog with eligibility rules.

**Columns:**
- `id` (uuid, primary key)
- `name` (text) - Subject name
- `code` (text, unique) - Subject code
- `year` (integer) - Academic year (1-4)
- `semester` (integer) - Semester number (1-8)
- `credits` (integer) - Credit hours
- `type` (text) - Core, Elective, Lab, or Project
- `eligible_for` (text[]) - Array of eligible user types
- `department` (text) - Department offering subject
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

#### 3. preferences
Faculty subject preference submissions.

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → users.id)
- `subject_id` (uuid, foreign key → subjects.id)
- `priority` (integer) - Lower number = higher priority
- `academic_year` (text)
- `submitted_at` (timestamptz)
- `created_at` (timestamptz)

**Constraints:**
- Unique constraint on (user_id, subject_id, academic_year)

#### 4. allocations
Final subject assignments to faculty.

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → users.id)
- `subject_id` (uuid, foreign key → subjects.id)
- `academic_year` (text)
- `semester` (integer)
- `status` (text) - Allocated, Pending, or Swapped
- `allocated_at` (timestamptz)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Constraints:**
- Unique constraint on (user_id, academic_year, semester)

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### users table
- SELECT: All authenticated users can view all users
- UPDATE: Users can update their own profile
- INSERT/DELETE: Admin only

### subjects table
- SELECT: All authenticated users can view subjects
- INSERT/UPDATE/DELETE: Admin only

### preferences table
- SELECT: Users can view their own preferences; Admin can view all
- INSERT/UPDATE/DELETE: Users can manage their own preferences

### allocations table
- SELECT: Users can view their own allocations; Admin can view all
- INSERT/UPDATE/DELETE: Admin only

## Services

### AuthService (`src/services/auth.ts`)
Handles user authentication and management.

**Methods:**
- `getStoredUsers()` - Fetch all users
- `register(userData)` - Register new faculty member
- `login(email, password, department)` - Faculty login
- `adminLogin(email, password)` - Admin login
- `updateUserPreferences(userId, preferences)` - Save user preferences
- `updateUserStatus(userId, isActive)` - Activate/deactivate user
- `deleteUser(userId)` - Delete user account
- `getCurrentUser()` - Get current logged-in user from localStorage
- `setCurrentUser(user)` - Store current user in localStorage
- `logout()` - Clear current user session

### AllocationService (`src/services/allocation.ts`)
Manages subject allocation logic.

**Methods:**
- `getAllocations()` - Fetch all allocations
- `performAllocation()` - Execute allocation algorithm
- `getAllocationByUser(userId)` - Get allocation for specific user
- `getSubjectById(subjectId)` - Fetch subject details
- `getDashboardStats()` - Get dashboard statistics

**Allocation Algorithm:**
1. Fetch all active users with submitted preferences
2. Group by department
3. Separate Professors and Assistant Professors
4. Sort by joining date (earlier = higher priority)
5. Allocate Professors first (semesters 1-4 subjects)
6. Then allocate Assistant Professors (semesters 5-8 subjects)
7. Each user gets their highest priority available subject
8. No subject can be allocated to multiple users

### SubjectService (`src/services/subjectService.ts`)
Manages subject catalog.

**Methods:**
- `seedSubjects()` - Initialize database with subjects from data files
- `getSubjectsByDepartment(department)` - Fetch subjects by department
- `getAllSubjects()` - Fetch all subjects
- `addSubject(subject)` - Add new subject
- `updateSubject(id, updates)` - Update subject details
- `deleteSubject(id)` - Delete subject

### InitService (`src/services/initService.ts`)
Initializes the database on first load.

**Methods:**
- `initialize()` - Seed subjects if database is empty

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Data Flow

### Faculty Registration Flow
1. User submits registration form
2. `AuthService.register()` checks for duplicate email
3. Insert new user into `users` table
4. Return success/error message

### Preference Submission Flow
1. Faculty selects and orders subjects
2. `AuthService.updateUserPreferences()` is called
3. Delete existing preferences for user
4. Insert new preferences with priority ordering
5. Update localStorage with submission status

### Allocation Flow
1. Admin initiates allocation
2. `AllocationService.performAllocation()` executes
3. Fetch users with preferences
4. Sort by priority (joining date)
5. Allocate subjects based on preference order
6. Insert allocations into database
7. Return allocation results

### Login Flow
1. User enters credentials
2. `AuthService.login()` queries database
3. Fetch user preferences and allocations
4. Store user in localStorage
5. Return user object with complete data

## Migration

The initial migration creates all tables, indexes, RLS policies, and triggers. It's located in the Supabase migrations and was applied during backend setup.

## Future Enhancements

- Implement proper Supabase Auth instead of plain text passwords
- Add email notifications for allocations
- Implement allocation swapping between faculty
- Add audit logging for all changes
- Implement real-time updates using Supabase subscriptions
- Add data export functionality (CSV, Excel)
- Implement bulk user import
- Add semester archive functionality
