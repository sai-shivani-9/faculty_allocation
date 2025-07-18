import React, { useState, useEffect } from 'react';
import { User, Subject } from '../types';
import { getSubjectsByDepartment } from '../data/subjects';
import { AuthService } from '../services/auth';
import { PDFService } from '../services/pdfService';
import { ArrowLeft, GripVertical, CheckCircle, Download, FileText, AlertCircle, Filter } from 'lucide-react';

interface PreferenceSubmissionProps {
  user: User;
  onBack: () => void;
}

export const PreferenceSubmission: React.FC<PreferenceSubmissionProps> = ({ user, onBack }) => {
  const [eligibleSubjects, setEligibleSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [availableSemesters, setAvailableSemesters] = useState<number[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showSemesterFilter, setShowSemesterFilter] = useState(false);

  useEffect(() => {
    loadEligibleSubjects();
    if (user.preferences) {
      setPreferences([...user.preferences]);
      setSubmitted(user.preferencesSubmitted);
      if (user.preferencesSubmitted) {
        setShowSemesterFilter(true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (selectedSemester !== null && submitted) {
      const semesterSubjects = eligibleSubjects.filter(subject => subject.semester === selectedSemester);
      setFilteredSubjects(semesterSubjects);
    } else {
      setFilteredSubjects(eligibleSubjects);
    }
  }, [selectedSemester, eligibleSubjects, submitted]);

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
    setFilteredSubjects(subjects);
    
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
    setShowSemesterFilter(true);
    alert('Preferences submitted successfully! You can now filter subjects by semester.');
  };

  const handleDownloadPreferences = () => {
    PDFService.generatePreferencesPDF(user, preferences, eligibleSubjects);
  };

  const getSubjectById = (id: string) => {
    return eligibleSubjects.find(subject => subject.id === id);
  };

  const handleSemesterFilter = (semester: number | null) => {
    setSelectedSemester(semester);
  };

  const getSemesterRange = () => {
    return user.userType === 'Professor' ? 'Semesters 1-4' : 'Semesters 5-8';
  };

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
                <h1 className="text-3xl font-bold">Subject Preferences</h1>
                <p className="text-blue-100">
                  {user.department} - {getSemesterRange()}
                </p>
              </div>
            </div>
            <FileText className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        {/* Status Alert */}
        {submitted ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">Preferences Submitted</h3>
                <p className="text-green-700">Your subject preferences have been successfully submitted. Use the semester filter below to view subjects by semester.</p>
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
        ) : (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Submit Your Preferences</h3>
                <p className="text-blue-700">
                  As a {user.userType}, you must select all {eligibleSubjects.length} subjects from {getSemesterRange()}. 
                  You can arrange them in order of preference.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Semester Filter (Only shown after submission) */}
        {showSemesterFilter && submitted && (
          <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Filter className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filter by Semester</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleSemesterFilter(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedSemester === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Subjects
              </button>
              {availableSemesters.map(semester => (
                <button
                  key={semester}
                  onClick={() => handleSemesterFilter(semester)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedSemester === semester
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Semester {semester}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Available Subjects (Only shown before submission) */}
        {!submitted && (
          <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Available Subjects ({getSemesterRange()})
            </h3>
            <div className="responsive-grid">
              {eligibleSubjects.map((subject) => (
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
        )}

        {/* Filtered Subjects Display (Only shown after submission) */}
        {submitted && (
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
                    className="p-4 rounded-lg border-2 bg-blue-50 border-blue-300"
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
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                          Priority #{preferenceIndex + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Preference Order (Only shown before submission) */}
        {!submitted && preferences.length > 0 && (
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
                    draggable={!submitted}
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

        {/* Submit Button (Only shown before submission) */}
        {!submitted && preferences.length > 0 && (
          <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ready to Submit?</h3>
                <p className="text-sm text-gray-600">
                  Selected {preferences.length} out of {eligibleSubjects.length} subjects
                </p>
              </div>
              <button
                onClick={handleSubmitPreferences}
                disabled={preferences.length !== eligibleSubjects.length}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Submit Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};