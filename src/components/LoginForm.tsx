import React, { useState } from 'react';
import { AuthService } from '../services/auth';
import { User } from '../types';
import { Eye, EyeOff, Lock, Mail, Building2, UserIcon } from 'lucide-react';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
  onSwitchToAdminLogin: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onSwitchToRegister,
  onSwitchToAdminLogin
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    department: 'Computer Science and Engineering'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await AuthService.login(
        formData.email,
        formData.password,
        formData.department
      );
      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 animate-fade-in">
      {/* NITJ Header */}
      <div className="nitj-header">
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
                डॉ बी आर अम्बेडकर राष्ट्रीय प्रौद्योगिकी संस्थान जालंधर
              </h1>
                <h2 className="nitj-title-english">
                Dr. B R Ambedkar National Institute of Technology Jalandhar
              </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Header */}
      <div className="nitj-subheader">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span>| Faculty Subject Allotment System |</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="nitj-login-card animate-scale-in">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <UserIcon className="h-12 w-12 text-blue-600 bg-blue-100 p-2 rounded-full" />
              <Lock className="h-6 w-6 text-blue-600 -ml-2 bg-white rounded-full p-1" />
            </div>
            <h2 className="text-2xl font-bold text-black">Faculty Login</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to access your account
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="nitj-alert-error animate-slide-up">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  Email Address:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="nitj-input pl-10 border border-gray-400"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                  Password:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="nitj-input pl-10 pr-12 border border-gray-400"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Department Field */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-black mb-2">
                  Select Your Department:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="nitj-input pl-10 appearance-none border border-gray-400"
                  >
                    <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                    <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                    <option value="Instrumentation and Control Engineering">Instrumentation and Control Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Chemical Engineering">Chemical Engineering</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Industrial and Production Engineering">Industrial and Production Engineering</option>
                    <option value="Textile Technology">Textile Technology</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="nitj-btn-primary animate-glow"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </div>

            {/* Links */}
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Register here
                </button>
              </p>
              <div className="border-t border-gray-200 pt-3">
                <button
                  type="button"
                  onClick={onSwitchToAdminLogin}
                  className="text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
                >
                  🔐 Admin Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="nitj-header mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">Copyright 2025 © NIT Jalandhar</p>
          <p className="text-xs mt-1 opacity-90">
            Developed by: Computer Centre, Dr. B.R. Ambedkar National Institute of Technology, Jalandhar
          </p>
        </div>
      </div>
    </div>
  );
};
