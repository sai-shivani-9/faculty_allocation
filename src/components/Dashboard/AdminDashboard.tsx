import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { AllocationService } from '../../services/allocation';
import { AuthService } from '../../services/auth';
import { FacultyManagement } from '../FacultyManagement';
import { SubjectManagement } from '../SubjectManagement';
import { PDFService } from '../../services/pdfService';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Play, 
  Download, 
  BarChart3,
  FileText,
  GraduationCap,
  UserCheck,
  Lock,
  Settings,
  User as UserIcon
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [allocationMessage, setAllocationMessage] = useState('');
  const [showAllocationResults, setShowAllocationResults] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'faculty' | 'subjects'>('dashboard');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileData, setProfileData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const dashboardStats = AllocationService.getDashboardStats();
    setStats(dashboardStats);
  };

  const handleProceedAllocation = async () => {
    setLoading(true);
    setAllocationMessage('');
    setShowAllocationResults(false);

    try {
      const result = await AllocationService.performAllocation();
      setAllocationMessage(result.message);
      setShowAllocationResults(true);
      loadStats(); // Refresh stats after allocation
    } catch (error) {
      setAllocationMessage('An error occurred during allocation');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    PDFService.generateDepartmentAllocationReport();
  };

  const handleChangePassword = () => {
    if (passwordData.currentPassword !== user.password) {
      alert('Current password is incorrect');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirmation do not match');
      return;
    }

    // Update password for admin
    const users = AuthService.getStoredUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].password = passwordData.newPassword;
      AuthService.storeUsers(users);
      AuthService.setCurrentUser(users[userIndex]);
    }
    
    alert('Password changed successfully');
    setShowChangePassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleUpdateProfile = () => {
    if (!profileData.firstName.trim() || !profileData.lastName.trim() || !profileData.email.trim()) {
      alert('All fields are required');
      return;
    }

    if (!profileData.email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    // Update profile for admin
    const users = AuthService.getStoredUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...profileData };
      AuthService.storeUsers(users);
      AuthService.setCurrentUser(users[userIndex]);
    }
    
    alert('Profile updated successfully');
    setShowUpdateProfile(false);
    window.location.reload();
  };

  if (currentView === 'faculty') {
    return <FacultyManagement onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'subjects') {
    return <SubjectManagement onBack={() => setCurrentView('dashboard')} />;
  }

  const StatCard = ({ title, value, icon: Icon, color, description }: any) => (
    <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-blue-100 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="nitj-dashboard-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="opacity-90">Welcome back, {user.firstName}! Manage faculty subject allocations efficiently.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowChangePassword(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-sm"
            >
              <Lock className="h-4 w-4" />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="nitj-login-card max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Admin Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="nitj-input mt-1"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="nitj-input mt-1"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="nitj-input mt-1"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleChangePassword}
                className="nitj-btn-primary flex-1"
              >
                Change Password
              </button>
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="nitj-btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Profile Modal */}
      {showUpdateProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="nitj-login-card max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Admin Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  className="nitj-input mt-1"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  className="nitj-input mt-1"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="nitj-input mt-1"
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleUpdateProfile}
                className="nitj-btn-primary flex-1"
              >
                Update Profile
              </button>
              <button
                onClick={() => {
                  setShowUpdateProfile(false);
                  setProfileData({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                  });
                }}
                className="nitj-btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="responsive-grid">
        <div className="nitj-stat-card animate-float">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Faculty</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalFaculty || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Registered faculty members</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="nitj-stat-card animate-float" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Subjects</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalSubjects || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available subjects</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="nitj-stat-card animate-float" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Allocated Subjects</p>
              <p className="text-3xl font-bold text-blue-600">{stats.allocatedSubjects || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Successfully allocated</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="nitj-stat-card animate-float" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Submitted Preferences</p>
              <p className="text-3xl font-bold text-blue-600">{stats.submittedPreferences || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Faculty preferences submitted</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Faculty Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="nitj-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Faculty Distribution</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Professors</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-blue-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(stats.professors / stats.totalFaculty) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-blue-600">
                  {stats.professors || 0}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Assistant Professors</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-emerald-100 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(stats.assistantProfessors / stats.totalFaculty) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-emerald-600">
                  {stats.assistantProfessors || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="nitj-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Allocation Progress</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completion Rate</span>
              <span className="text-2xl font-bold text-emerald-600">
                {stats.totalFaculty > 0 ? Math.round((stats.allocatedSubjects / stats.totalFaculty) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3">
              <div 
                className="bg-emerald-600 h-3 rounded-full transition-all duration-1000" 
                style={{ width: `${stats.totalFaculty > 0 ? (stats.allocatedSubjects / stats.totalFaculty) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Allocated: {stats.allocatedSubjects || 0}</span>
              <span>Total: {stats.totalFaculty || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Allocation Controls */}
      <div className="nitj-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Allocation Controls</h3>
        
        {allocationMessage && (
          <div className={`mb-4 p-4 rounded-lg ${
            allocationMessage.includes('successfully') || allocationMessage.includes('completed')
              ? 'nitj-alert-success'
              : 'nitj-alert-error'
          }`}>
            <p className="font-medium">{allocationMessage}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
          <button
            onClick={handleProceedAllocation}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Execute Allocation Process</span>
              </>
            )}
          </button>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
            onClick={handleDownloadReport}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium shadow-lg transition-all duration-200"
          >
            <Download className="h-5 w-5" />
            <span>Download Comprehensive Report</span>
          </button>
            
            <button
              onClick={() => setShowUpdateProfile(true)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-lg transition-all duration-200"
            >
              <Settings className="h-5 w-5" />
              <span>Update Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Faculty Management */}
      <div className="nitj-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Management Options</h3>
        <div className="responsive-grid-sm">
          <button
            onClick={() => setCurrentView('faculty')}
            className="nitj-btn-primary flex items-center justify-center space-x-3 p-6"
          >
            <Users className="h-6 w-6" />
            <span>Manage Faculty</span>
          </button>
          
          <button
            onClick={() => setCurrentView('subjects')}
            className="nitj-btn-primary flex items-center justify-center space-x-3 p-6"
          >
            <BookOpen className="h-6 w-6" />
            <span>Subject Management</span>
          </button>
        </div>
      </div>
    </div>
  );
};