import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AuthService } from '../services/auth';
import { User } from '../types';

interface RegisterFormProps {
  onRegister: (user: User) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onSwitchToLogin
}) => {
  const [formData, setFormData] = useState({
    title: 'Mr.' as 'Mr.' | 'Mrs.' | 'Ms.',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Computer Science and Engineering',
    userType: 'Professor' as 'Professor' | 'Assistant Professor',
    joiningDate: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const result = await AuthService.register({
        title: formData.title,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        userType: formData.userType,
        joiningDate: formData.joiningDate
      });

      if (result.success) {
        alert('Registration successful! Please login with your credentials.');
        onSwitchToLogin();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header */}
      <header className="nitj-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="nitj-header-content">
            <div className="nitj-logo-section">
              <img
            src="https://www.nitj.ac.in/public/assets/images/logo_250.png"
            alt="NITJ Logo"
            className="nitj-logo"
          />
              <div className="nitj-title-section">
                <h1 className="nitj-title-hindi">
              डॉ बी आर अंबेडकर राष्ट्रीय प्रौद्योगिकी संस्थान जालंधर
            </h1>
                <h2 className="nitj-title-english">
              Dr. B R Ambedkar National Institute of Technology Jalandhar
                </h2>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="nitj-subheader">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          | Faculty Subject Allotment System |
        </div>
      </div>

      {/* Form Container */}
      <main className="flex-grow flex items-center justify-center bg-[#F3F4F6] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white border border-gray-300 rounded-xl shadow-md p-8">
          <div className="text-center">
            <img
              src="https://www.nitj.ac.in/public/assets/images/logo_250.png"
              alt="NITJ Logo"
              className="h-16 w-16 mx-auto object-contain"
            />
            <h2 className="mt-4 text-2xl font-semibold text-gray-800">Faculty Registration</h2>
            <p className="text-sm text-gray-600 mt-1">Create your NITJ account</p>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-300 text-red-700 rounded-md px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <p className="text-sm font-medium text-gray-700 mb-1">Title</p>
                <select
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value as 'Mr.' | 'Mrs.' | 'Ms.' })
                  }
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:border-blue-500 focus:outline-none"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                </select>
              </div>

              <div className="col-span-1">
                <p className="text-sm font-medium text-gray-700 mb-1">First Name</p>
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="col-span-1">
                <p className="text-sm font-medium text-gray-700 mb-1">Last Name</p>
                <input
                  type="text"
                  placeholder="Last Name"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Email Address</p>
              <input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="relative">
                <p className="text-sm font-medium text-gray-700 mb-1">Password</p>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm pr-10 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-8 text-gray-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative">
                <p className="text-sm font-medium text-gray-700 mb-1">Confirm Password</p>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm pr-10 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-8 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Department</p>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                <option value="Instrumentation and Control Engineering">Instrumentation and Control Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">User Type</p>
                <select
                  value={formData.userType}
                  onChange={(e) =>
                    setFormData({ ...formData, userType: e.target.value as 'Professor' | 'Assistant Professor' })
                  }
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:border-blue-500 focus:outline-none"
                >
                  <option value="Professor">Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                </select>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Joining Date</p>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded transition duration-200"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-gray-600 mt-2">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:underline"
              >
                Sign in here
              </button>
            </p>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="nitj-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">Copyright 2025 © NIT Jalandhar</p>
          <p className="text-xs mt-1 opacity-90">
            Developed by: Computer Centre, Dr. B.R. Ambedkar National Institute of Technology, Jalandhar
          </p>
        </div>
      </footer>
    </div>
  );
};