import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { AuthService } from '../services/auth';
import { X, Calendar, Mail, Building2, Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface FacultyListModalProps {
  facultyType: 'Professor' | 'Assistant Professor';
  onClose: () => void;
}

export const FacultyListModal: React.FC<FacultyListModalProps> = ({ facultyType, onClose }) => {
  const [faculty, setFaculty] = useState<User[]>([]);

  useEffect(() => {
    const loadFaculty = async () => {
      const users = await AuthService.getStoredUsers();
      const filteredFaculty = users
        .filter(user => user.userType === facultyType)
        .sort((a, b) => new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime());
      setFaculty(filteredFaculty);
    };

    loadFaculty();
  }, [facultyType]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('NIT Jalandhar - Faculty List', 20, 20);
    doc.setFontSize(16);
    doc.text(`${facultyType}s - Computer Science and Engineering`, 20, 35);
    
    // Date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    
    let yPosition = 60;
    
    faculty.forEach((member, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${member.title} ${member.firstName} ${member.lastName}`, 20, yPosition);
      doc.setFontSize(10);
      doc.text(`Email: ${member.email}`, 30, yPosition + 8);
      doc.text(`Joining Date: ${new Date(member.joiningDate).toLocaleDateString()}`, 30, yPosition + 16);
      doc.text(`Department: ${member.department}`, 30, yPosition + 24);
      
      yPosition += 35;
    });
    
    doc.save(`${facultyType.replace(' ', '_')}_List.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div>
            <h2 className="text-2xl font-bold">{facultyType}s</h2>
            <p className="text-blue-100">Computer Science and Engineering Department</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {faculty.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No {facultyType}s Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                There are currently no registered {facultyType.toLowerCase()}s in the system.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total: {faculty.length} {facultyType}{faculty.length !== 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sorted by joining date (oldest first)
                </p>
              </div>

              <div className="grid gap-4">
                {faculty.map((member, index) => (
                  <div
                    key={member.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {member.title} {member.firstName} {member.lastName}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                              <Mail className="h-4 w-4" />
                              <span>{member.email}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="h-4 w-4" />
                              <span>Joined: {new Date(member.joiningDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          #{index + 1}
                        </span>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.preferencesSubmitted
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {member.preferencesSubmitted ? 'Preferences Submitted' : 'Pending Preferences'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};