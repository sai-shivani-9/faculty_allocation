import React, { useState, useEffect } from 'react';
import { User, Subject } from '../types';
import { getSubjectsByDepartment } from '../data/subjects';
import { AuthService } from '../services/auth';
import { PDFService } from '../services/pdfService';
import { ArrowLeft, GripVertical, CheckCircle, Download, FileText, AlertCircle, Filter, Calendar, BookOpen } from 'lucide-react';

interface PreferenceSubmissionProps {
  user: User;
  onBack: () => void;
}

export const PreferenceSubmission: React.FC<PreferenceSubmissionProps> = ({ user, onBack }) => {
  const [eligibleSubjects, setEligibleSubjects] = useState<Subject[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [availableSemesters, setAvailableSemesters] = useState<number[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [currentView, setCurrentView] = useState<'semester-selection' | 'subject-selection' | 'submitted-view'>('semester-selection');

  useEffect(() => {
    loadEligibleSubjects();
    if (user.preferences) {
      setPreferences([...user.preferences]);
      setSubmitted(user.preferencesSubmitted);
      if (user.preferencesSubmitted) {
        setCurrentView('submitted-view');
        // Set default to first available semester for submitted view
        if (availableSemesters.length > 0) {
          setSelectedSemester(availableSemesters[0]);
        }
      }
    }
  }, [user]);

  const loadEligibleSubjects = () => {
    let subjects = getSubjectsByDepartment(user.department).filter(subject => {
      if (user.userType === 'Professor') {
        // Professors: semesters 1-4
        return subject.semester >= 1 && subject.semester <= 4 && subject.eligibleFor.includes(user.userType);
      } else {
        // Assistant Professors: semesters 5-8
        return subject.semester >= 5 && subject.semester <= 8 && subject.eligibleFor.includes(user.userType);
      }
    });

    setEligibleSubjects(subjects);
    
    // Get unique semesters for the user type
    const semesters = [...new Set(subjects.map(s => s.semester))].sort();
    setAvailableSemesters(semesters);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || submitted) return;

    const newPreferences = [...preferences];
    const draggedItem = newPreferences[draggedIndex];
    newPreferences.splice(draggedIndex, 1);
    newPreferences.splice(dropIndex, 0, draggedItem);

    setPreferences(newPreferences);
    setDraggedIndex(null);
  };

  const handleSubjectToggle = (subjectId: string) => {
    if (submitted) return;

    if (preferences.includes(subjectId)) {
      setPreferences(preferences.filter(id => id !== subjectId));
    } else {
      setPreferences([...preferences, subjectId]);
    }
  };

  const handleSubmitPreferences = () => {
    if (preferences.length !== eligibleSubjects.length) {
      alert(`Please select all ${eligibleSubjects.length} subjects. You have selected ${preferences.length} out of ${eligibleSubjects.length} subjects.`);
      return;
    }

    AuthService.updateUserPreferences(user.id, preferences);
    setSubmitted(true);
    setCurrentView('submitted-view');
    if (availableSemesters.length > 0) {
      setSelectedSemester(availableSemesters[0]);
    }
    alert('Preferences submitted successfully! Use the semester filter to view your subjects.');
  };

  const handleDownloadPreferences = () => {
    PDFService.generatePreferencesPDF(user, preferences, eligibleSubjects);
  };

  const getSubjectById = (id: string) => {
    return eligibleSubjects.find(subject => subject.id === id);
  };

  const getSemesterRange = () => {
    return user.userType === 'Professor' ? 'Semesters 1-4' : 'Semesters 5-8';
  };

  const handleSemesterSelection = (semester: number) => {
    setSelectedSemester(semester);
    setCurrentView('subject-selection');
    // Clear any existing preferences when changing semester
    setPreferences([]);
  };

  const handleBackToSemesterSelection = () => {
    setSelectedSemester(null);
    setCurrentView('semester-selection');
    setPreferences([]);
  };

  const getCurrentSemesterSubjects = () => {
    return selectedSemester ? eligibleSubjects.filter(s => s.semester === selectedSemester) : [];
  };

  // Submitted view - show semester filter and subjects
  if (currentView === 'submitted-view' && submitted) {
    const filteredSubjects = selectedSemester 
      ? eligibleSubjects.filter(s => s.semester === selectedSemester)
      : eligibleSubjects;

    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <h1 className="text-3xl font-bold">Your Subject Preferences</h1>
                  <p className="text-blue-100">
                    {user.department} - {getSemesterRange()}
                  </p>
                </div>
              </div>
              <FileText className="h-12 w-12 text-blue-200" />
            </div>
          </div>

          {/* Status Alert */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">Preferences Submitted Successfully</h3>
                <p className="text-green-700">Your subject preferences have been recorded. Use the semester filter below to view subjects by semester.</p>
              </div>
            </div>
            <button
              onClick={handleDownloadPreferences}
              className="mt-4 flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              <span>Download Preferences PDF</span>
            </button>
          </div>

          {/* Semester Filter */}
          <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Filter className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filter by Semester</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedSemester(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedSemester === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Subjects ({eligibleSubjects.length})
              </button>
              {availableSemesters.map(semester => {
                const semesterSubjects = eligibleSubjects.filter(s => s.semester === semester);
                return (
                  <button
                    key={semester}
                    onClick={() => setSelectedSemester(semester)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedSemester === semester
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Semester {semester} ({semesterSubjects.length})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered Subjects Display */}
          <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedSemester ? `Semester ${selectedSemester} Subjects` : 'All Your Subjects'} 
              ({filteredSubjects.length})
            </h3>
            <div className="responsive-grid">
              {filteredSubjects.map((subject) => {
                const preferenceIndex = preferences.indexOf(subject.id);
                return (
                  <div
                    key={subject.id}
                    className="p-4 rounded-lg border-2 bg-blue-50 border-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{subject.name}</h5>
                        <p className="text-sm text-gray-600">
                          {subject.code} - Year {subject.year}, Semester {subject.semester}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {subject.type} • {subject.credits} Credits
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                          {subject.credits} Credits
                        </span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                          Priority #{preferenceIndex + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredSubjects.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No subjects found for the selected filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Semester selection view
  if (currentView === 'semester-selection') {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <h1 className="text-3xl font-bold">Select Semester</h1>
                  <p className="text-blue-100">
                    Choose a semester to view and select subjects - {getSemesterRange()}
                  </p>
                </div>
              </div>
              <FileText className="h-12 w-12 text-blue-200" />
            </div>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Subject Preference Selection</h3>
                <p className="text-blue-700">
                  As a {user.userType}, you can select subjects from {getSemesterRange()}. 
                  Choose a semester below to view and select subjects for that semester.
                </p>
              </div>
            </div>
          </div>

          {/* Semester Selection Grid */}
          <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Available Semesters</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableSemesters.map(semester => {
                const semesterSubjects = eligibleSubjects.filter(s => s.semester === semester);
                return (
                  <div
                    key={semester}
                    onClick={() => handleSemesterSelection(semester)}
                    className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl hover:border-blue-400 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="text-center">
                      <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                      <h4 className="text-lg font-semibold text-gray-900">Semester {semester}</h4>
                      <p className="text-sm text-gray-600">{semester % 2 === 1 ? 'Odd' : 'Even'} Semester</p>
                      <p className="text-xs text-blue-600 mt-2 font-medium">
                        {semesterSubjects.length} subjects available
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Subject selection view for a specific semester
  if (currentView === 'subject-selection' && selectedSemester !== null) {
    const currentSemesterSubjects = getCurrentSemesterSubjects();
    
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToSemesterSelection}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold">Semester {selectedSemester} Subjects</h1>
                <p className="text-blue-100">
                  Select subjects for Semester {selectedSemester} - {currentSemesterSubjects.length} subjects available
                </p>
              </div>
            </div>
            <FileText className="h-12 w-12 text-blue-200" />
          </div>
        </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Select Subjects for Semester {selectedSemester}</h3>
                <p className="text-blue-700">
                  Choose the subjects you want to teach in Semester {selectedSemester}. 
                  You can select multiple subjects and arrange them in order of preference.
                </p>
              </div>
            </div>
          </div>

        {/* Available Subjects for Selected Semester */}
          <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Available Subjects - Semester {selectedSemester} ({currentSemesterSubjects.length})
            </h3>
            <div className="responsive-grid">
              {currentSemesterSubjects.map((subject) => (
                <div
                  key={subject.id}
                  onClick={() => handleSubjectToggle(subject.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    preferences.includes(subject.id)
                      ? 'bg-blue-50 border-blue-300 shadow-md'
                      : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{subject.name}</h5>
                      <p className="text-sm text-gray-600">
                        {subject.code} - Year {subject.year}, Semester {subject.semester}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                        {subject.credits} Credits
                      </span>
                      {preferences.includes(subject.id) && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        {/* Preference Order */}
        {preferences.length > 0 && (
          <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Preference Order</h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop to reorder your preferences (higher position = higher priority)
            </p>
            <div className="space-y-3">
              {preferences.map((subjectId, index) => {
                const subject = getSubjectById(subjectId);
                return (
                  <div
                    key={subjectId}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className="flex items-center space-x-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg cursor-move hover:shadow-md transition-all duration-200"
                  >
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-blue-600 min-w-[2rem]">#{index + 1}</span>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{subject?.name}</h5>
                      <p className="text-sm text-gray-600">{subject?.code} - Semester {subject?.semester}</p>
                    </div>
                    <button
                      onClick={() => handleSubjectToggle(subjectId)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {preferences.length > 0 && (
          <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Continue or Submit?</h3>
                <p className="text-sm text-gray-600">
                  Selected {preferences.length} subjects for Semester {selectedSemester}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleBackToSemesterSelection}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-200"
                >
                  Select Another Semester
                </button>
                <button
                  onClick={handleSubmitPreferences}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200"
                >
                  Submit All Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  }

  // Default return (should not reach here)
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );
};