import React, { useState } from 'react';
import { AuthService } from '../services/auth';
import { User } from '../types';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Shield } from 'lucide-react';

interface AdminLoginFormProps {
  onLogin: (user: User) => void;
  onSwitchToRegularLogin: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLogin, onSwitchToRegularLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await AuthService.adminLogin(formData.email, formData.password);

      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during admin login');
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
          <span>| Admin Portal - Faculty Subject Allotment System |</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="nitj-login-card animate-scale-in">
          {/* Admin Login Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-red-600 bg-red-100 p-2 rounded-full animate-float" />
            </div>
            <h2 className="text-2xl font-bold text-black">
              Admin Portal
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Administrative Access Only
            </p>
            <div className="mt-4 nitj-alert-warning">
              <p className="text-sm font-medium text-center">
                🔐 Restricted Access - Admin Credentials Required
              </p>
            </div>
          </div>

          {/* Admin Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="nitj-alert-error animate-slide-up">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Email:
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
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="nitj-input pl-10"
                    placeholder="Enter admin email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Password:
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
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="nitj-input pl-10 pr-12"
                    placeholder="Enter admin password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
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
                {loading ? 'Authenticating...' : 'Admin Login'}
              </button>
            </div>

            {/* Back to Regular Login */}
            <div className="text-center">
              <button
                type="button"
                onClick={onSwitchToRegularLogin}
                className="flex items-center justify-center space-x-2 w-full text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Faculty Login</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="nitj-header mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            Copyright 2025 © NIT Jalandhar
          </p>
          <p className="text-xs mt-1 opacity-90">
            Developed by: Computer Centre, Dr. B.R. Ambedkar National Institute of Technology, Jalandhar
          </p>
        </div>
      </div>
    </div>
  );
};
