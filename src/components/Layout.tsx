import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { AuthService } from '../services/auth';
import { LogOut, User as UserIcon } from 'lucide-react';

interface LayoutProps {
  user: User | null;
  children: React.ReactNode;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ user, children, onLogout }) => {
  const handleLogout = () => {
    AuthService.logout();
    onLogout();
  };

  return (
    <div className="min-h-screen">
      <div className="min-h-screen transition-colors duration-300 bg-gray-100">
        <div className="nitj-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="nitj-header-content">
              <div className="nitj-logo-section">
                <img
                  src="https://www.nitj.ac.in/public/assets/images/logo_250.png"
                  alt="NITJ Logo" 
                  className="h-16 w-16 object-contain"
                />
                <div className="nitj-title-section">
                  <h1 className="nitj-title-hindi">
                   डॉ बी आर अम्बेडकर राष्ट्रीय प्रौद्योगिकी संस्थान जालंधर
                  </h1>
                  <h2 className="nitj-title-english">
                    Dr. B.R. Ambedkar National Institute of Technology, Jalandhar
                  </h2>
                </div>
              </div>

              {/* User Actions */}
              {user && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5 text-white" />
                    <span className="text-sm font-medium text-white">
                      {user.title} {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs px-2 py-1 bg-white bg-opacity-20 text-white rounded-full">
                      {user.userType}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

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
    </div>
  );
};