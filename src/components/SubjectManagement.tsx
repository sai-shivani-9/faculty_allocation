import React, { useState } from 'react';
import { Subject } from '../types';
import { getSubjectsByDepartment } from '../data/subjects';
import { ArrowLeft, BookOpen, Plus, Trash2, Building2, Calendar } from 'lucide-react';

interface SubjectManagementProps {
  onBack: () => void;
}

export const SubjectManagement: React.FC<SubjectManagementProps> = ({ onBack }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    year: 1,
    semester: 1,
    credits: 3,
    type: 'Core' as 'Core' | 'Elective' | 'Lab' | 'Project',
    eligibleFor: ['Professor'] as ('Professor' | 'Assistant Professor')[]
  });

  const departments = [
    'Computer Science and Engineering',
    'Electronics and Communication Engineering',
    'Instrumentation and Control Engineering'
  ];

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleDepartmentSelect = (department: string) => {
    setSelectedDepartment(department);
    setSelectedSemester(null);
    setSubjects([]);
  };

  const handleSemesterSelect = (semester: number) => {
    setSelectedSemester(semester);
    if (selectedDepartment) {
      const departmentSubjects = getSubjectsByDepartment(selectedDepartment);
      const semesterSubjects = departmentSubjects.filter(subject => subject.semester === semester);
      setSubjects(semesterSubjects);
    }
  };

  const handleAddSubject = () => {
    if (!selectedDepartment || selectedSemester === null) return;
    
    const subject: Subject = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...newSubject,
      semester: selectedSemester
    };

    setSubjects([...subjects, subject]);
    setNewSubject({
      name: '',
      code: '',
      year: 1,
      semester: selectedSemester,
      credits: 3,
      type: 'Core',
      eligibleFor: ['Professor']
    });
    setShowAddSubject(false);
  };

  const handleDeleteSubject = (subjectId: string, subjectName: string) => {
    if (window.confirm(`Are you sure you want to delete "${subjectName}"? This action cannot be undone.`)) {
      setSubjects(subjects.filter(subject => subject.id !== subjectId));
    }
  };

  const handleBack = () => {
    if (selectedSemester !== null) {
      setSelectedSemester(null);
      setSubjects([]);
    } else if (selectedDepartment) {
      setSelectedDepartment(null);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold">Subject Management</h1>
                <p className="text-blue-100">
                  {!selectedDepartment ? 'Select a department to manage subjects' :
                   selectedSemester === null ? `${selectedDepartment} - Select a semester` :
                   `${selectedDepartment} - Semester ${selectedSemester}`}
                </p>
              </div>
            </div>
            <BookOpen className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        {/* Department Selection */}
        {!selectedDepartment && (
          <div className="responsive-grid">
            {departments.map(department => (
              <div
                key={department}
                onClick={() => handleDepartmentSelect(department)}
                className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:border-blue-400 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{department}</h3>
                  <p className="text-gray-600">Manage subjects for this department</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Semester Selection */}
        {selectedDepartment && selectedSemester === null && (
          <div className="responsive-grid-sm">
            {semesters.map(semester => (
              <div
                key={semester}
                onClick={() => handleSemesterSelect(semester)}
                className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl hover:border-blue-400 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Semester {semester}</h3>
                  <p className="text-sm text-gray-600">{semester % 2 === 1 ? 'Odd' : 'Even'} Semester</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subject List */}
        {selectedDepartment && selectedSemester !== null && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Subjects - Semester {selectedSemester} ({subjects.length})
              </h2>
              <button
                onClick={() => setShowAddSubject(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Add Subject</span>
              </button>
            </div>

            {/* Add Subject Form */}
            {showAddSubject && (
              <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Subject</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Subject Name"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                    className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Subject Code"
                    value={newSubject.code}
                    onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                    className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  <select
                    value={newSubject.year}
                    onChange={(e) => setNewSubject({...newSubject, year: parseInt(e.target.value)})}
                    className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                  <select
                    value={newSubject.credits}
                    onChange={(e) => setNewSubject({...newSubject, credits: parseInt(e.target.value)})}
                    className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value={1}>1 Credit</option>
                    <option value={2}>2 Credits</option>
                    <option value={3}>3 Credits</option>
                    <option value={4}>4 Credits</option>
                  </select>
                  <select
                    value={newSubject.type}
                    onChange={(e) => setNewSubject({...newSubject, type: e.target.value as any})}
                    className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Core">Core</option>
                    <option value="Elective">Elective</option>
                    <option value="Lab">Lab</option>
                    <option value="Project">Project</option>
                  </select>
                </div>
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={handleAddSubject}
                    disabled={!newSubject.name || !newSubject.code}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Subject
                  </button>
                  <button
                    onClick={() => setShowAddSubject(false)}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Subjects Grid */}
            <div className="responsive-grid">
              {subjects.map(subject => (
                <div key={subject.id} className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{subject.name}</h4>
                      <p className="text-blue-600 font-medium">{subject.code}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>Year {subject.year}</span>
                        <span>•</span>
                        <span>{subject.credits} Credits</span>
                        <span>•</span>
                        <span>{subject.type}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Eligible: {subject.eligibleFor.join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteSubject(subject.id, subject.name)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {subjects.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Subjects Found</h3>
                <p className="text-gray-600">No subjects are currently available for this semester.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};