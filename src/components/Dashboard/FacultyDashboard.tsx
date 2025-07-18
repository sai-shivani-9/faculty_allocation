import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { AllocationService } from '../../services/allocation';
import { AuthService } from '../../services/auth';
import { PDFService } from '../../services/pdfService';
import { PreferenceSubmission } from '../PreferenceSubmission';
import { getSubjectsByDepartment } from '../../data/subjects';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Download, 
  AlertCircle,
  Calendar,
  Award,
  FileText,
  Key,
  User as UserIcon,
  Building2,
  Settings,
  Lock
} from 'lucide-react';

interface FacultyDashboardProps {
  user: User;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ user }) => {
  const [allocation, setAllocation] = useState<any>(null);
  const [showUpdateDetails, setShowUpdateDetails] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'preferences'>('dashboard');
  const [updateData, setUpdateData] = useState({
    title: user.title,
    firstName: user.firstName,
    lastName: user.lastName
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadAllocation();
  }, [user]);

  if (currentView === 'preferences') {
    return <PreferenceSubmission user={user} onBack={() => setCurrentView('dashboard')} />;
  }

  const loadAllocation = () => {
    const userAllocation = AllocationService.getAllocationByUser(user.id);
    if (userAllocation) {
      const subject = AllocationService.getSubjectById(userAllocation.subjectId);
      setAllocation({ ...userAllocation, subject });
    }
  };

  const handleDownloadAllocation = () => {
    if (!allocation) return;

    PDFService.generateFacultyAllocationPDF(user, allocation, allocation.subject);
  };

  const handleUpdateDetails = () => {
    if (!updateData.firstName.trim() || !updateData.lastName.trim()) {
      alert('All fields are required');
      return;
    }

    // Update user details
    const users = AuthService.getStoredUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updateData };
      AuthService.storeUsers(users);
      AuthService.setCurrentUser(users[userIndex]);
      alert('Details updated successfully');
      setShowUpdateDetails(false);
      window.location.reload(); // Refresh to show updated details
    }
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

    // Update password
    const users = AuthService.getStoredUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].password = passwordData.newPassword;
      AuthService.storeUsers(users);
      AuthService.setCurrentUser(users[userIndex]);
      alert('Password changed successfully');
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="nitj-dashboard-header">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Welcome, {user.title} {user.firstName} {user.lastName}</h1>
            <p className="opacity-90 mb-4 font-medium">{user.userType} - {user.department}</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Joined: {new Date(user.joiningDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>Eligible for: {user.userType === 'Professor' ? '1st & 2nd Year' : '3rd & 4th Year'} subjects</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowChangePassword(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200"
          >
            <Lock className="h-4 w-4" />
            <span>Change Password</span>
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="nitj-login-card max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
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
            <div className="flex space-x-3 mt-6">
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

      {/* Update Details Modal */}
      {showUpdateDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="nitj-login-card max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Personal Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <select
                  value={updateData.title}
                  onChange={(e) => setUpdateData({...updateData, title: e.target.value as 'Mr.' | 'Mrs.' | 'Ms.'})}
                  className="nitj-input mt-1"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={updateData.firstName}
                  onChange={(e) => setUpdateData({...updateData, firstName: e.target.value})}
                  className="nitj-input mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={updateData.lastName}
                  onChange={(e) => setUpdateData({...updateData, lastName: e.target.value})}
                  className="nitj-input mt-1"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleUpdateDetails}
                className="nitj-btn-primary flex-1"
              >
                Update Details
              </button>
              <button
                onClick={() => {
                  setShowUpdateDetails(false);
                  setUpdateData({
                    title: user.title,
                    firstName: user.firstName,
                    lastName: user.lastName
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

      {/* Personal Details */}
      <div className="nitj-card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <UserIcon className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium text-gray-900">{user.title} {user.firstName} {user.lastName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Email Address</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium text-gray-900">{user.department}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Designation</p>
                <p className="font-medium text-gray-900">{user.userType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Allocation Status */}
      {allocation ? (
        <div className="nitj-alert-success">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Subject Allocated</h3>
                <p className="text-green-700 font-medium">
                  {allocation.subject?.name} ({allocation.subject?.code})
                </p>
                <p className="text-sm text-green-600">
                  Year {allocation.subject?.year} - Semester {allocation.subject?.semester} - {allocation.subject?.credits} Credits
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadAllocation}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              <span>Download Allocation PDF</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="nitj-alert-warning">
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900">Allocation Pending</h3>
              <p className="text-yellow-700 font-medium">
                {user.preferencesSubmitted 
                  ? 'Your preferences have been submitted. Waiting for admin allocation.'
                  : 'Please submit your subject preferences to participate in allocation.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="nitj-card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Subject Preferences</h3>
        <div className="responsive-grid-sm">
          <button
            onClick={() => setCurrentView('preferences')}
            className="nitj-btn-primary flex items-center justify-center space-x-3 p-6"
          >
            <FileText className="h-6 w-6" />
            <span>Submit Preferences</span>
          </button>
          <button
            onClick={() => setShowUpdateDetails(true)}
            className="nitj-btn-primary flex items-center justify-center space-x-3 p-6"
          >
            <Settings className="h-6 w-6" />
            <span>Update Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};