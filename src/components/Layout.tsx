import React from 'react';
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
        
        {/* Header */}
        <div className="nitj-header bg-[#003366] py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
            <img
              src="https://www.nitj.ac.in/public/assets/images/logo_250.png"
              alt="NITJ Logo"
              className="h-16 w-16 object-contain mb-2"
            />
            <div className="text-white">
              <h1 className="text-lg sm:text-xl font-bold">
                डॉ बी आर अम्बेडकर राष्ट्रीय प्रौद्योगिकी संस्थान जालंधर
              </h1>
              <h2 className="text-sm sm:text-base">
                Dr. B.R. Ambedkar National Institute of Technology, Jalandhar
              </h2>
            </div>
          </div>

          {/* User Info & Logout (top-right corner) */}
          {user && (
            <div className="absolute top-4 right-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white">
                <UserIcon className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {user.title} {user.firstName} {user.lastName}
                </span>
                <span className="text-xs px-2 py-1 bg-white bg-opacity-20 rounded-full">
                  {user.userType}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-1 text-sm font-semibold text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Sub Header with Centered College Name */}
        <div className="bg-gray-200 py-2">
          <div className="text-center text-sm font-semibold text-gray-800">
            | Faculty Subject Allotment System |
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[#003366] text-white py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm">
              Copyright 2025 © NIT Jalandhar
            </p>
            <p className="text-xs mt-1 opacity-90">
              Developed by: Computer Centre, Dr. B.R. Ambedkar National Institute of Technology, Jalandhar
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
