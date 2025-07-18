import jsPDF from 'jspdf';
import { User, Subject, Allocation } from '../types';
import { AllocationService } from './allocation';
import { AuthService } from './auth';
import { getSubjectsByDepartment } from '../data/subjects';

export class PDFService {
  static generatePreferencesPDF(user: User, preferences: string[], eligibleSubjects: Subject[]): void {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Dr. B. R. Ambedkar National Institute of Technology', 20, 25);
    doc.setFontSize(18);
    doc.text('Jalandhar, Punjab (India)', 20, 35);
    
    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('SUBJECT PREFERENCES SUBMISSION', 20, 50);
    doc.setFont(undefined, 'normal');
    
    // Date
    doc.setFontSize(10);
    doc.text(`Submission Date: ${new Date().toLocaleDateString('en-IN')}`, 20, 60);
    
    // Faculty Details
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('FACULTY INFORMATION', 20, 75);
    doc.setFont(undefined, 'normal');
    
    doc.setFontSize(12);
    const facultyInfo = [
      ['Faculty Name:', `${user.title} ${user.firstName} ${user.lastName}`],
      ['Email Address:', user.email],
      ['Department:', user.department],
      ['Designation:', user.userType]
    ];
    
    let yPos = 85;
    facultyInfo.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, 25, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(value, 90, yPos);
      yPos += 10;
    });
    
    // Preferences
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('SUBJECT PREFERENCES (IN ORDER OF PRIORITY)', 20, 125);
    doc.setFont(undefined, 'normal');
    
    yPos = 140;
    preferences.forEach((subjectId, index) => {
      const subject = eligibleSubjects.find(s => s.id === subjectId);
      if (subject) {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}.`, 25, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(`${subject.name} (${subject.code})`, 35, yPos);
        doc.text(`Year ${subject.year} - Semester ${subject.semester} - ${subject.credits} Credits`, 35, yPos + 8);
        
        yPos += 16;
      }
    });
    
    // Footer
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text('This is a computer-generated document.', 20, doc.internal.pageSize.height - 20);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, 20, doc.internal.pageSize.height - 10);
    
    // Save the PDF
    doc.save(`NITJ_Subject_Preferences_${user.firstName}_${user.lastName}_${new Date().getFullYear()}.pdf`);
  }

  static generateFacultyAllocationPDF(user: User, allocation: Allocation, subject: Subject): void {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Dr. B. R. Ambedkar National Institute of Technology', 20, 25);
    doc.setFontSize(18);
    doc.text('Jalandhar, Punjab (India)', 20, 35);
    
    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('SUBJECT ALLOCATION CERTIFICATE', 20, 50);
    doc.setFont(undefined, 'normal');
    
    // Certificate ID and Date
    doc.setFontSize(10);
    doc.text(`Certificate ID: NITJ/${user.department.split(' ')[0]}/${allocation.id}`, 20, 60);
    doc.text(`Issue Date: ${new Date().toLocaleDateString('en-IN')}`, 140, 60);
    
    // Faculty Details
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('FACULTY INFORMATION', 20, 75);
    doc.setFont(undefined, 'normal');
    
    doc.setFontSize(12);
    const facultyInfo = [
      ['Faculty Name:', `${user.title} ${user.firstName} ${user.lastName}`],
      ['Email Address:', user.email],
      ['Department:', user.department],
      ['Designation:', user.userType],
      ['Date of Joining:', new Date(user.joiningDate).toLocaleDateString('en-IN')]
    ];
    
    let yPos = 85;
    facultyInfo.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, 25, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(value, 90, yPos);
      yPos += 10;
    });
    
    // Subject Details
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('SUBJECT ALLOCATION DETAILS', 20, 135);
    doc.setFont(undefined, 'normal');
    
    doc.setFontSize(12);
    const subjectInfo = [
      ['Subject Name:', subject.name],
      ['Subject Code:', subject.code],
      ['Academic Year:', `${subject.year}${subject.year === 1 ? 'st' : subject.year === 2 ? 'nd' : subject.year === 3 ? 'rd' : 'th'} Year`],
      ['Semester:', `${subject.semester}${subject.semester % 2 === 1 ? ' (Odd)' : ' (Even)'}`]
    ];
    
    yPos = 145;
    subjectInfo.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, 25, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(value, 90, yPos);
      yPos += 10;
    });
    
    // Allocation Details
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('ALLOCATION INFORMATION', 20, 185);
    doc.setFont(undefined, 'normal');
    
    doc.setFontSize(12);
    const allocationInfo = [
      ['Academic Session:', `${allocation.academicYear}-${parseInt(allocation.academicYear) + 1}`],
      ['Allocation Date:', new Date(allocation.allocationDate).toLocaleDateString('en-IN')],
      ['Allocation Status:', allocation.status],
      ['Valid Until:', `${parseInt(allocation.academicYear) + 1}-06-30`]
    ];
    
    yPos = 195;
    allocationInfo.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, 25, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(value, 90, yPos);
      yPos += 10;
    });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('This certificate is digitally generated and verified by the Faculty Allotment System.', 20, 235);
    
    // Footer
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text('This is a computer-generated document and does not require a physical signature.', 20, 250);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, 20, 260);
    doc.text('For verification, contact: registrar@nitj.ac.in | +91-181-2690301', 20, 270);
    
    // Save the PDF
    doc.save(`NITJ_Subject_Allocation_${user.firstName}_${user.lastName}_${allocation.academicYear}.pdf`);
  }

  static generateDepartmentAllocationReport(): void {
    const doc = new jsPDF();
    const allocations = AllocationService.getAllocations();
    const users = AuthService.getStoredUsers();
    
    // Header
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Dr. B. R. Ambedkar National Institute of Technology', 20, 25);
    doc.setFontSize(18);
    doc.text('Jalandhar, Punjab (India)', 20, 35);
    
    // Title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('COMPREHENSIVE FACULTY SUBJECT ALLOCATION REPORT', 20, 50);
    doc.setFont(undefined, 'normal');
    
    // Report metadata
    doc.setFontSize(10);
    doc.text(`Report Generated: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, 20, 60);
    doc.text(`Academic Year: ${new Date().getFullYear()}-${new Date().getFullYear() + 1}`, 20, 70);
    
    // Get all allocated faculty
    const allocatedFaculty = users.filter(user => user.allocatedSubject);
    const professors = allocatedFaculty.filter(user => user.userType === 'Professor');
    const assistantProfessors = allocatedFaculty.filter(user => user.userType === 'Assistant Professor');
    
    let yPos = 80;
    
    // Professors Section (First Page)
    if (professors.length > 0) {
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('PROFESSORS - SUBJECT ALLOCATIONS', 20, yPos);
      doc.setFont(undefined, 'normal');
      yPos += 15;
      
      // Table headers
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('S.No.', 20, yPos);
      doc.text('Faculty Name', 40, yPos);
      doc.text('Department', 85, yPos);
      doc.text('Subject Details', 130, yPos);
      doc.setFont(undefined, 'normal');
      yPos += 10;
      
      // Sort professors by joining date
      professors.sort((a, b) => new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime());
      
      professors.forEach((user, index) => {
        const allocation = allocations.find(a => a.facultyId === user.id);
        const subject = allocation ? AllocationService.getSubjectById(allocation.subjectId) : null;
        
        if (subject) {
          if (yPos > 260) {
            doc.addPage();
            yPos = 30;
          }
          
          doc.setFontSize(10);
          doc.text(`${index + 1}.`, 20, yPos);
          
          // Faculty name with wrapping
          const facultyName = `${user.title} ${user.firstName} ${user.lastName}`;
          const facultyLines = doc.splitTextToSize(facultyName, 45);
          doc.text(facultyLines, 40, yPos);
          
          // Department with wrapping
          const deptLines = doc.splitTextToSize(user.department, 40);
          doc.text(deptLines, 85, yPos);
          
          // Subject details with code, year, semester
          const subjectDetails = `${subject.name}\nCode: ${subject.code}\nYear: ${subject.year}, Sem: ${subject.semester}`;
          const subjectLines = doc.splitTextToSize(subjectDetails, 65);
          doc.text(subjectLines, 130, yPos);
          
          // Calculate the maximum height needed for this row
          const maxLines = Math.max(facultyLines.length, deptLines.length, subjectLines.length);
          yPos += maxLines * 4 + 8; // 4 units per line + 8 for spacing
        }
      });
    }
    
    // Assistant Professors Section (New Page)
    if (assistantProfessors.length > 0) {
      doc.addPage();
      yPos = 30;
      
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('ASSISTANT PROFESSORS - SUBJECT ALLOCATIONS', 20, yPos);
      doc.setFont(undefined, 'normal');
      yPos += 15;
      
      // Table headers
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('S.No.', 20, yPos);
      doc.text('Faculty Name', 40, yPos);
      doc.text('Department', 85, yPos);
      doc.text('Subject Details', 130, yPos);
      doc.setFont(undefined, 'normal');
      yPos += 10;
      
      // Sort assistant professors by joining date
      assistantProfessors.sort((a, b) => new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime());
      
      assistantProfessors.forEach((user, index) => {
        const allocation = allocations.find(a => a.facultyId === user.id);
        const subject = allocation ? AllocationService.getSubjectById(allocation.subjectId) : null;
        
        if (subject) {
          if (yPos > 260) {
            doc.addPage();
            yPos = 30;
          }
          
          doc.setFontSize(10);
          doc.text(`${index + 1}.`, 20, yPos);
          
          // Faculty name with wrapping
          const facultyName = `${user.title} ${user.firstName} ${user.lastName}`;
          const facultyLines = doc.splitTextToSize(facultyName, 45);
          doc.text(facultyLines, 40, yPos);
          
          // Department with wrapping
          const deptLines = doc.splitTextToSize(user.department, 40);
          doc.text(deptLines, 85, yPos);
          
          // Subject details with code, year, semester
          const subjectDetails = `${subject.name}\nCode: ${subject.code}\nYear: ${subject.year}, Sem: ${subject.semester}`;
          const subjectLines = doc.splitTextToSize(subjectDetails, 65);
          doc.text(subjectLines, 130, yPos);
          
          // Calculate the maximum height needed for this row
          const maxLines = Math.max(facultyLines.length, deptLines.length, subjectLines.length);
          yPos += maxLines * 4 + 8; // 4 units per line + 8 for spacing
        }
      });
    }
    
    // Summary Section
    doc.addPage();
    yPos = 30;
    
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('ALLOCATION SUMMARY', 20, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 20;
    
    const stats = AllocationService.getDashboardStats();
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Overall Statistics:', 20, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 15;
    
    const summaryData = [
      ['Total Faculty Members:', `${stats.totalFaculty}`],
      ['Total Professors:', `${stats.professors}`],
      ['Total Assistant Professors:', `${stats.assistantProfessors}`],
      ['Total Subjects Available:', `${stats.totalSubjects}`],
      ['Successfully Allocated Subjects:', `${stats.allocatedSubjects}`],
      ['Preferences Submitted:', `${stats.submittedPreferences}`],
      ['Allocation Completion Rate:', `${stats.totalFaculty > 0 ? Math.round((stats.allocatedSubjects / stats.totalFaculty) * 100) : 0}%`]
    ];
    
    summaryData.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, 25, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(value, 120, yPos);
      yPos += 10;
    });
    
    // Footer
    doc.setFontSize(8);
    doc.text('This report is generated by the Faculty Subject Allotment System', 20, doc.internal.pageSize.height - 20);
    doc.text('For queries, contact: registrar@nitj.ac.in | +91-181-2690301', 20, doc.internal.pageSize.height - 10);
    
    doc.save(`NITJ_Comprehensive_Allocation_Report_${new Date().getFullYear()}.pdf`);
  }
}