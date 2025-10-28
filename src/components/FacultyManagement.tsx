import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { AuthService } from '../services/auth';
import { ArrowLeft, Trash2, Users, GraduationCap, UserCheck, Search } from 'lucide-react';

interface FacultyManagementProps {
  onBack: () => void;
}

export const FacultyManagement: React.FC<FacultyManagementProps> = ({ onBack }) => {
  const [faculty, setFaculty] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    const users = await AuthService.getStoredUsers();
    setFaculty(users);
  };

  const handleDeleteFaculty = async (facultyId: string, facultyName: string) => {
    if (window.confirm(`Are you sure you want to delete ${facultyName}? This action cannot be undone.`)) {
      try {
        await AuthService.deleteUser(facultyId);
        await loadFaculty();
        alert('Faculty member deleted successfully');
      } catch (error) {
        alert('Failed to delete faculty member');
        console.error('Error deleting faculty:', error);
      }
    }
  };

  const filteredFaculty = faculty.filter(member => {
    const matchesSearch = `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const professors = filteredFaculty.filter(member => member.userType === 'Professor');
  const assistantProfessors = filteredFaculty.filter(member => member.userType === 'Assistant Professor');

  const departments = ['All', 'Computer Science and Engineering', 'Electronics and Communication Engineering', 'Instrumentation and Control Engineering'];

  const FacultyCard = ({ member }: { member: User }) => (
    <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-lg">
              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              {member.title} {member.firstName} {member.lastName}
            </h4>
            <p className="text-sm text-gray-600">{member.email}</p>
            <p className="text-sm text-blue-600">{member.department}</p>
            <p className="text-xs text-gray-500">Joined: {new Date(member.joiningDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            member.preferencesSubmitted
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {member.preferencesSubmitted ? 'Preferences Submitted' : 'Pending Preferences'}
          </span>
          <button
            onClick={() => handleDeleteFaculty(member.id, `${member.firstName} ${member.lastName}`)}
            className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold">Faculty Management</h1>
                <p className="text-blue-100">Manage faculty members across all departments</p>
              </div>
            </div>
            <Users className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search faculty by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="responsive-grid mb-8">
          <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Faculty</p>
                <p className="text-3xl font-bold text-blue-600">{filteredFaculty.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Professors</p>
                <p className="text-3xl font-bold text-blue-600">{professors.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assistant Professors</p>
                <p className="text-3xl font-bold text-blue-600">{assistantProfessors.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Professors Section */}
        {professors.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Professors ({professors.length})</h2>
            </div>
            <div className="responsive-grid">
              {professors.map(professor => (
                <FacultyCard key={professor.id} member={professor} />
              ))}
            </div>
          </div>
        )}

        {/* Assistant Professors Section */}
        {assistantProfessors.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <UserCheck className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Assistant Professors ({assistantProfessors.length})</h2>
            </div>
            <div className="responsive-grid">
              {assistantProfessors.map(assistantProfessor => (
                <FacultyCard key={assistantProfessor.id} member={assistantProfessor} />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredFaculty.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Faculty Found</h3>
            <p className="text-gray-600">No faculty members match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};