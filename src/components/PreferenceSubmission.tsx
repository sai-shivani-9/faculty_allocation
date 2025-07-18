import React, { useState, useEffect } from 'react';
import { User, Subject } from '../types';
import { getSubjectsByDepartment } from '../data/subjects';
import { AuthService } from '../services/auth';
import { PDFService } from '../services/pdfService';
import { ArrowLeft, GripVertical, CheckCircle, Download, FileText, AlertCircle } from 'lucide-react';

interface PreferenceSubmissionProps {
  user: User;
  onBack: () => void;
}

export const PreferenceSubmission: React.FC<PreferenceSubmissionProps> = ({ user, onBack }) => {
  const [eligibleSubjects, setEligibleSubjects] = useState<Subject[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadEligibleSubjects();
    if (user.preferences) {
      setPreferences([...user.preferences]);
      setSubmitted(user.preferencesSubmitted);
    }
  }, [user]);

  const loadEligibleSubjects = () => {
    const semesterInfo = AuthService.isValidSemester();
    const allowedSemesterType = semesterInfo.allowedSemester;
    
    let subjects = getSubjectsByDepartment(user.department).filter(subject => {
      if (!subject.eligibleFor.includes(user.userType)) return false;
      
      const isOddSemester = subject.semester % 2 === 1;
      const isEvenSemester = subject.semester % 2 === 0;
      
      if (allowedSemesterType === 'odd' && !isOddSemester) return false;
      if (allowedSemesterType === 'even' && !isEvenSemester) return false;
      
      return true;
    });

    setEligibleSubjects(subjects);
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
      alert(`Please select preferences for all ${eligibleSubjects.length} available subjects. You have selected ${preferences.length} out of ${eligibleSubjects.length} subjects.`);
      return;
    }

    AuthService.updateUserPreferences(user.id, preferences);
    setSubmitted(true);
    alert('Preferences submitted successfully!');
  };

  const handleDownloadPreferences = () => {
    PDFService.generatePreferencesPDF(user, preferences, eligibleSubjects);
  };

  const getSubjectById = (id: string) => {
    return eligibleSubjects.find(subject => subject.id === id);
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
                <p className="text-blue-100">{user.department}</p>
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
                <p className="text-green-700">Your subject preferences have been successfully submitted and cannot be modified.</p>
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
                <p className="text-blue-700">Select and order your subject preferences. You must select all {eligibleSubjects.length} available subjects.</p>
              </div>
            </div>
          </div>
        )}

        {/* Available Subjects */}
        {!submitted && (
          <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Subjects</h3>
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

        {/* Preference Order */}
        {preferences.length > 0 && (
          <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Preference Order</h3>
            {!submitted && (
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop to reorder your preferences (higher position = higher priority)
              </p>
            )}
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
                    className={`flex items-center space-x-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg transition-all duration-200 ${
                      !submitted ? 'cursor-move hover:shadow-md' : ''
                    }`}
                  >
                    {!submitted && <GripVertical className="h-5 w-5 text-gray-400" />}
                    <span className="text-sm font-medium text-blue-600 min-w-[2rem]">#{index + 1}</span>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{subject?.name}</h5>
                      <p className="text-sm text-gray-600">{subject?.code}</p>
                    </div>
                    {!submitted && (
                      <button
                        onClick={() => handleSubjectToggle(subjectId)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit Button */}
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