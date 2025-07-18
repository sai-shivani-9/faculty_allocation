import { Subject } from '../types';

export const cseSubjects: Subject[] = [
  // 1st Year - 1st Semester
  { id: 'sub_001', name: 'Computer Programming', code: 'CSE-101', year: 1, semester: 1, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_002', name: 'Applied Chemistry-B', code: 'CHE-102', year: 1, semester: 1, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_003', name: 'Management Principles and Practices', code: 'MGT-103', year: 1, semester: 1, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_004', name: 'Basic Electrical Science', code: 'ELE-104', year: 1, semester: 1, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_005', name: 'Applied Mathematics-I', code: 'MAT-105', year: 1, semester: 1, credits: 4, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_006', name: 'Engineering Graphics and CADD', code: 'ENG-106', year: 1, semester: 1, credits: 2, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_007', name: 'Computer Programming Laboratory', code: 'CSE-107', year: 1, semester: 1, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },
  { id: 'sub_008', name: 'Applied Chemistry Laboratory', code: 'CHE-108', year: 1, semester: 1, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },

  // 1st Year - 2nd Semester
  { id: 'sub_009', name: 'Environmental Studies', code: 'ENV-201', year: 1, semester: 2, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_010', name: 'Basic Electronics', code: 'ELE-202', year: 1, semester: 2, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_011', name: 'English Communication and Report Writing', code: 'ENG-203', year: 1, semester: 2, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_012', name: 'Manufacturing Processes', code: 'MFG-204', year: 1, semester: 2, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_013', name: 'Applied Mathematics-II', code: 'MAT-205', year: 1, semester: 2, credits: 4, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_014', name: 'Applied Physics-B', code: 'PHY-206', year: 1, semester: 2, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_015', name: 'English Communication Laboratory', code: 'ENG-207', year: 1, semester: 2, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },
  { id: 'sub_016', name: 'Product Realization through Manufacturing Laboratory', code: 'MFG-208', year: 1, semester: 2, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },
  { id: 'sub_017', name: 'Applied Physics-B Laboratory', code: 'PHY-209', year: 1, semester: 2, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },
  { id: 'sub_018', name: 'National Sports Organization', code: 'NSO-210', year: 1, semester: 2, credits: 1, type: 'Core', eligibleFor: ['Professor'] },

  // 2nd Year - 3rd Semester
  { id: 'sub_019', name: 'Digital Circuits and Logic Design', code: 'CSE-301', year: 2, semester: 3, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_020', name: 'Object-Oriented Programming', code: 'CSE-302', year: 2, semester: 3, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_021', name: 'Data Structures and Algorithms', code: 'CSE-303', year: 2, semester: 3, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_022', name: 'Computer Networks', code: 'CSE-304', year: 2, semester: 3, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_023', name: 'Discrete Structures', code: 'CSE-305', year: 2, semester: 3, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_024', name: 'Numerical Methods', code: 'CSE-306', year: 2, semester: 3, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_025', name: 'Digital Circuits Laboratory', code: 'CSE-307', year: 2, semester: 3, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },
  { id: 'sub_026', name: 'Data Structures Laboratory', code: 'CSE-308', year: 2, semester: 3, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },

  // 2nd Year - 4th Semester
  { id: 'sub_027', name: 'Database Management Systems', code: 'CSE-401', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_028', name: 'Machine Learning', code: 'CSE-402', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_029', name: 'Design and Analysis of Algorithms', code: 'CSE-403', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_030', name: 'Computer Organization and Architecture', code: 'CSE-404', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_031', name: 'Microprocessors and Microcontrollers', code: 'CSE-405', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_032', name: 'Economics for Engineers', code: 'ECO-406', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'sub_033', name: 'Database Management Systems Laboratory', code: 'CSE-407', year: 2, semester: 4, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },
  { id: 'sub_034', name: 'Machine Learning Laboratory', code: 'CSE-408', year: 2, semester: 4, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },

  // 3rd Year - 5th Semester
  { id: 'sub_035', name: 'Theory of Computation', code: 'CSE-501', year: 3, semester: 5, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_036', name: 'Operating Systems', code: 'CSE-502', year: 3, semester: 5, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_037', name: 'Software Engineering', code: 'CSE-503', year: 3, semester: 5, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_038', name: 'Information Security Systems', code: 'CSE-504', year: 3, semester: 5, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_039', name: 'Probability Theory for Data Analytics', code: 'CSE-505', year: 3, semester: 5, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_040', name: 'Web Technologies', code: 'CSE-506', year: 3, semester: 5, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_041', name: 'Operating Systems Laboratory', code: 'CSE-507', year: 3, semester: 5, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_042', name: 'Web Technologies Laboratory', code: 'CSE-508', year: 3, semester: 5, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },

  // 3rd Year - 6th Semester
  { id: 'sub_043', name: 'Surveying', code: 'CSE-601', year: 3, semester: 6, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_044', name: 'Data Analytics', code: 'CSE-602', year: 3, semester: 6, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_045', name: 'Cloud Computing', code: 'CSE-603', year: 3, semester: 6, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_046', name: 'Network Security and Cyber Forensics', code: 'CSE-604', year: 3, semester: 6, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_047', name: 'Data Mining and Data Warehousing', code: 'CSE-605', year: 3, semester: 6, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_048', name: 'Advanced Database Management Systems', code: 'CSE-606', year: 3, semester: 6, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_049', name: 'Minor Project', code: 'CSE-607', year: 3, semester: 6, credits: 2, type: 'Project', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_050', name: 'Data Analytics Laboratory', code: 'CSE-608', year: 3, semester: 6, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },

  // 4th Year - 7th Semester
  { id: 'sub_051', name: 'Software Project Management', code: 'CSPC-401', year: 4, semester: 7, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_052', name: 'Computer Graphics and Image Processing', code: 'CSPC-403', year: 4, semester: 7, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_053', name: 'Artificial Intelligence', code: 'CSPC-405', year: 4, semester: 7, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_054', name: 'Computer Graphics and Image Processing Laboratory', code: 'CSPC-423', year: 4, semester: 7, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_055', name: 'Industrial Practical Training', code: 'CSCI-300', year: 4, semester: 7, credits: 1, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_056', name: 'Project Phase-I', code: 'CSCI-400', year: 4, semester: 7, credits: 3, type: 'Project', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_057', name: 'Big Data Analytics', code: 'CSPE-431', year: 4, semester: 7, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_058', name: 'Blockchain Architecture & Use Cases', code: 'CSPE-433', year: 4, semester: 7, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_059', name: 'Distributed System', code: 'CSPE-435', year: 4, semester: 7, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_060', name: 'Multimedia Systems', code: 'CSPE-438', year: 4, semester: 7, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_061', name: 'Mobile Computing', code: 'CSPE-440', year: 4, semester: 7, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },

  // 4th Year - 8th Semester
  { id: 'sub_062', name: 'System Programming and Compiler Design', code: 'CSPC-402', year: 4, semester: 8, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_063', name: 'System Programming and Compiler Design Laboratory', code: 'CSPC-422', year: 4, semester: 8, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_064', name: 'Project Phase-II', code: 'CSCI-400', year: 4, semester: 8, credits: 6, type: 'Project', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_065', name: 'Industrial Lecture', code: 'CSCI-424', year: 4, semester: 8, credits: 1, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_066', name: 'High Performance Computing', code: 'CSPE-442', year: 4, semester: 8, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_067', name: 'Soft Computing', code: 'CSPE-444', year: 4, semester: 8, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_068', name: 'Wireless Networks', code: 'CSPE-446', year: 4, semester: 8, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_069', name: 'Augmented and Virtual Reality', code: 'CSPE-458', year: 4, semester: 8, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'sub_070', name: 'Agile Software Development', code: 'CSPE-460', year: 4, semester: 8, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
];

export const eceSubjects: Subject[] = [
  // 1st Semester (Common Subjects)
  { id: 'ece_001', name: 'Computer Programming', code: 'CSCI-101', year: 1, semester: 1, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ece_002', name: 'Applied Chemistry-B', code: 'CYCI-102', year: 1, semester: 1, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ece_003', name: 'Engineering Graphics and CADD', code: 'MEC-102', year: 1, semester: 1, credits: 2, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ece_004', name: 'Basic Electrical Science', code: 'ICCI-101', year: 1, semester: 1, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ece_005', name: 'Management Principles and Practices', code: 'HMC-101', year: 1, semester: 1, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ece_006', name: 'Applied Mathematics-I', code: 'MACI-101', year: 1, semester: 1, credits: 4, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ece_007', name: 'Computer Programming Laboratory', code: 'CSCI-102', year: 1, semester: 1, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },
  { id: 'ece_008', name: 'Applied Chemistry Laboratory', code: 'CYCI-103', year: 1, semester: 1, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },

  // 2nd Semester (Common Subjects)
  { id: 'ece_009', name: 'Data Structures', code: 'CSCI-103', year: 1, semester: 2, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ece_010', name: 'Environmental Studies', code: 'CYC-104', year: 1, semester: 2, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ece_011', name: 'Manufacturing Processes', code: 'HMCI-102', year: 1, semester: 2, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ece_012', name: 'English Communication and Report Writing', code: 'IPC-101', year: 1, semester: 2, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ece_013', name: 'Applied Mathematics-II', code: 'MAC-102', year: 1, semester: 2, credits: 4, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ece_014', name: 'Applied Physics-B', code: 'PHCI-103', year: 1, semester: 2, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ece_015', name: 'English Communication Laboratory', code: 'HMCI-103', year: 1, semester: 2, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },
  { id: 'ece_016', name: 'Product Realization Through Manufacturing Lab', code: 'IPCI-102', year: 1, semester: 2, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },
  { id: 'ece_017', name: 'Applied Physics-B Laboratory', code: 'PHC-104', year: 1, semester: 2, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },
  { id: 'ece_018', name: 'National Service Scheme', code: 'NSS-102', year: 1, semester: 2, credits: 1, type: 'Core', eligibleFor: ['Professor'] },

  // 3rd Semester
  { id: 'ece_019', name: 'Electronic Devices and Circuits', code: 'ECPC-203', year: 2, semester: 3, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_020', name: 'Signals & Systems', code: 'ECPC-207', year: 2, semester: 3, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_021', name: 'Analysis and Synthesis of Networks', code: 'ECPC-205', year: 2, semester: 3, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_022', name: 'Digital Electronics', code: 'ECPC-209', year: 2, semester: 3, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_023', name: 'Numerical Methods', code: 'MACI-203', year: 2, semester: 3, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_024', name: 'Professional Ethics & Wholistic Well-being', code: 'HSPC-101', year: 2, semester: 3, credits: 1, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_025', name: 'Electronic Devices and Circuits Lab', code: 'ECPC-223', year: 2, semester: 3, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_026', name: 'Digital Electronics Laboratory', code: 'ECPC-225', year: 2, semester: 3, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },

  // 4th Semester
  { id: 'ece_027', name: 'Database Management Systems', code: 'CSPC-212', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_028', name: 'Operating Systems', code: 'CSPC-214', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_029', name: 'Analog Integrated Circuits', code: 'ECPC-204', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_030', name: 'Analog Communication Systems', code: 'ECPC-202', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_031', name: 'Electronic Measurements and Instrumentation', code: 'ECPC-206', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_032', name: 'Electromagnetic Field Theory and Transmission Lines', code: 'ECPC-208', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_033', name: 'Operating Systems Laboratory', code: 'CSPC-232', year: 2, semester: 4, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_034', name: 'Analog Communication Systems Laboratory', code: 'ECPC-222', year: 2, semester: 4, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_035', name: 'Analog Integrated Circuits Laboratory', code: 'ECPC-224', year: 2, semester: 4, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },

  // 5th Semester
  { id: 'ece_036', name: 'VLSI Circuit Design', code: 'ECPC-301', year: 3, semester: 5, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_037', name: 'Microprocessor and Its Applications', code: 'ECPC-303', year: 3, semester: 5, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_038', name: 'Information Theory and Coding', code: 'ECPC-305', year: 3, semester: 5, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_039', name: 'Antenna and Wave Propagation', code: 'ECPC-307', year: 3, semester: 5, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_040', name: 'Economics for Engineers', code: 'HMCI-201', year: 3, semester: 5, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_041', name: 'Control Engineering', code: 'ICPC-351', year: 3, semester: 5, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_042', name: 'Microprocessor and Its Applications Laboratory', code: 'ECPC-321', year: 3, semester: 5, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_043', name: 'Scientific Computing Laboratory', code: 'ECPC-351', year: 3, semester: 5, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },

  // 6th Semester
  { id: 'ece_044', name: 'Fundamentals of Machine Learning', code: 'CSOE-007', year: 3, semester: 6, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_045', name: 'Digital Communication Systems', code: 'ECPC-302', year: 3, semester: 6, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_046', name: 'Digital Signal Processing', code: 'ECPC-304', year: 3, semester: 6, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_047', name: 'Advanced Microprocessors and Microcontrollers', code: 'ECPC-306', year: 3, semester: 6, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_048', name: 'Optoelectronic Devices', code: 'ECPC-322', year: 3, semester: 6, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_049', name: 'Minor Project', code: 'ECPE-354', year: 3, semester: 6, credits: 2, type: 'Project', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_050', name: 'Digital Communication Systems Laboratory', code: 'ECPC-324', year: 3, semester: 6, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_051', name: 'Digital System Design Laboratory', code: 'ECPC-328', year: 3, semester: 6, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_052', name: 'Digital Signal Processing Laboratory', code: 'ECPC-326', year: 3, semester: 6, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_053', name: 'Advanced Microprocessors and Microcontrollers Lab', code: 'ECPC-327', year: 3, semester: 6, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },

  // 8th Semester
  { id: 'ece_054', name: 'Microelectronics', code: 'ECPC-404', year: 4, semester: 8, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_055', name: 'Project Phase–II', code: 'ECCI-400', year: 4, semester: 8, credits: 4, type: 'Project', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_056', name: 'Internship', code: 'ECPE-499', year: 4, semester: 8, credits: 12, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_057', name: 'Program Elective III', code: 'ECPE-4XX', year: 4, semester: 8, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_058', name: 'Program Elective IV', code: 'ECPE-4XY', year: 4, semester: 8, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_059', name: 'Program Elective V', code: 'ECPE-4XZ', year: 4, semester: 8, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'ece_060', name: 'Open Elective III', code: 'XXOE-4XX', year: 4, semester: 8, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
];

export const iceSubjects: Subject[] = [
  // 1st Semester (Common Subjects)
  { id: 'ice_001', name: 'Computer Programming', code: 'CSCI-101', year: 1, semester: 1, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ice_002', name: 'Applied Chemistry-B', code: 'CYCI-102', year: 1, semester: 1, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ice_003', name: 'Engineering Graphics and CADD', code: 'MEC-102', year: 1, semester: 1, credits: 2, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ice_004', name: 'Basic Electrical Science', code: 'ICCI-101', year: 1, semester: 1, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ice_005', name: 'Management Principles and Practices', code: 'HMC-101', year: 1, semester: 1, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ice_006', name: 'Applied Mathematics-I', code: 'MACI-101', year: 1, semester: 1, credits: 4, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ice_007', name: 'Computer Programming Laboratory', code: 'CSCI-102', year: 1, semester: 1, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },
  { id: 'ice_008', name: 'Applied Chemistry Laboratory', code: 'CYCI-103', year: 1, semester: 1, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },

  // 2nd Semester (Common Subjects)
  { id: 'ice_009', name: 'Data Structures', code: 'CSCI-103', year: 1, semester: 2, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ice_010', name: 'Environmental Studies', code: 'CYC-104', year: 1, semester: 2, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ice_011', name: 'Manufacturing Processes', code: 'HMCI-102', year: 1, semester: 2, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ice_012', name: 'English Communication and Report Writing', code: 'IPC-101', year: 1, semester: 2, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ice_013', name: 'Applied Mathematics-II', code: 'MAC-102', year: 1, semester: 2, credits: 4, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ice_014', name: 'Applied Physics-B', code: 'PHCI-103', year: 1, semester: 2, credits: 3, type: 'Core', eligibleFor: ['Professor'] },
  { id: 'ice_015', name: 'English Communication Laboratory', code: 'HMCI-103', year: 1, semester: 2, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },
  { id: 'ice_016', name: 'Product Realization Through Manufacturing Lab', code: 'IPCI-102', year: 1, semester: 2, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },
  { id: 'ice_017', name: 'Applied Physics-B Laboratory', code: 'PHC-104', year: 1, semester: 2, credits: 1, type: 'Lab', eligibleFor: ['Professor'] },
  { id: 'ice_018', name: 'National Service Scheme', code: 'NSS-102', year: 1, semester: 2, credits: 1, type: 'Core', eligibleFor: ['Professor'] },

  // 3rd Semester - ICE Specific
  { id: 'ice_019', name: 'Circuit Theory', code: 'ICPC-301', year: 2, semester: 3, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_020', name: 'Electrical Measurements and Measuring Instruments', code: 'ICPC-303', year: 2, semester: 3, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_021', name: 'Electronic Devices and Analog Integrated Circuits', code: 'ICPC-305', year: 2, semester: 3, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_022', name: 'Electromagnetic Field Theory', code: 'ICPC-307', year: 2, semester: 3, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_023', name: 'Numerical Methods', code: 'MACI-203', year: 2, semester: 3, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_024', name: 'Circuit Theory Laboratory', code: 'ICPC-321', year: 2, semester: 3, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_025', name: 'Electrical Measurements Laboratory', code: 'ICPC-323', year: 2, semester: 3, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },

  // 4th Semester - ICE Specific
  { id: 'ice_026', name: 'Electrical Machines', code: 'ICPC-302', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_027', name: 'Transducers and Signal Conditioning', code: 'ICPC-304', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_028', name: 'Electrical Power Systems', code: 'ICPC-306', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_029', name: 'Digital Electronics', code: 'ICPC-308', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_030', name: 'Economics for Engineers', code: 'HMCI-201', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_031', name: 'Data Structures and Algorithms', code: 'CSPC-212', year: 2, semester: 4, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_032', name: 'Electrical Machines Laboratory', code: 'ICPC-322', year: 2, semester: 4, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_033', name: 'Digital Electronics Laboratory', code: 'ICPC-324', year: 2, semester: 4, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },

  // 5th Semester - ICE Specific
  { id: 'ice_034', name: 'Microprocessors and Interfacing', code: 'ICPC-401', year: 3, semester: 5, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_035', name: 'Control System Engineering', code: 'ICPC-403', year: 3, semester: 5, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_036', name: 'Signal Processing', code: 'ICPC-405', year: 3, semester: 5, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_037', name: 'Industrial Measurement Systems', code: 'ICPC-407', year: 3, semester: 5, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_038', name: 'Data Acquisition and Telemetry', code: 'ICPC-409', year: 3, semester: 5, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_039', name: 'Program Elective I', code: 'ICPE-411', year: 3, semester: 5, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_040', name: 'Signal Processing Laboratory', code: 'ICPC-421', year: 3, semester: 5, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_041', name: 'Microprocessors Laboratory', code: 'ICPC-423', year: 3, semester: 5, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_042', name: 'Control Systems Laboratory', code: 'ICPC-425', year: 3, semester: 5, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_043', name: 'Minor Project', code: 'ICPE-427', year: 3, semester: 5, credits: 2, type: 'Project', eligibleFor: ['Assistant Professor'] },

  // 6th Semester - ICE Specific
  { id: 'ice_044', name: 'Process Dynamics and Control', code: 'ICPC-402', year: 3, semester: 6, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_045', name: 'Analytical Instrumentation', code: 'ICPC-404', year: 3, semester: 6, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_046', name: 'Modern Control System', code: 'ICPC-406', year: 3, semester: 6, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_047', name: 'Program Elective II', code: 'ICPE-408', year: 3, semester: 6, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_048', name: 'Program Elective III', code: 'ICPE-410', year: 3, semester: 6, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_049', name: 'Open Elective', code: 'XXOE-412', year: 3, semester: 6, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_050', name: 'Simulation Laboratory', code: 'ICPC-422', year: 3, semester: 6, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_051', name: 'Analytical Instrumentation Laboratory', code: 'ICPC-424', year: 3, semester: 6, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_052', name: 'Minor Project Continuation', code: 'ICPE-426', year: 3, semester: 6, credits: 2, type: 'Project', eligibleFor: ['Assistant Professor'] },

  // 7th Semester - ICE Specific
  { id: 'ice_053', name: 'PLC, DCS and SCADA', code: 'ICPC-501', year: 4, semester: 7, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_054', name: 'Biomedical Instrumentation', code: 'ICPC-503', year: 4, semester: 7, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_055', name: 'Program Elective IV', code: 'ICPE-505', year: 4, semester: 7, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_056', name: 'Program Elective V', code: 'ICPE-507', year: 4, semester: 7, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_057', name: 'Open Elective', code: 'XXOE-509', year: 4, semester: 7, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_058', name: 'PLC/SCADA Laboratory', code: 'ICPC-521', year: 4, semester: 7, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_059', name: 'Biomedical Instrumentation Laboratory', code: 'ICPC-523', year: 4, semester: 7, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_060', name: 'Major Project Phase I', code: 'ICCI-525', year: 4, semester: 7, credits: 3, type: 'Project', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_061', name: 'Summer Training', code: 'ICCI-527', year: 4, semester: 7, credits: 1, type: 'Core', eligibleFor: ['Assistant Professor'] },

  // 8th Semester - ICE Specific
  { id: 'ice_062', name: 'Advanced Process Control', code: 'ICPC-502', year: 4, semester: 8, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_063', name: 'Virtual Instrumentation', code: 'ICPC-504', year: 4, semester: 8, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_064', name: 'Industrial Automation and Robotics', code: 'ICPC-506', year: 4, semester: 8, credits: 3, type: 'Core', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_065', name: 'Program Elective VI', code: 'ICPE-508', year: 4, semester: 8, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_066', name: 'Open Elective', code: 'XXOE-510', year: 4, semester: 8, credits: 3, type: 'Elective', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_067', name: 'Industrial Automation Laboratory', code: 'ICPC-522', year: 4, semester: 8, credits: 1, type: 'Lab', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_068', name: 'Major Project Phase II', code: 'ICCI-524', year: 4, semester: 8, credits: 6, type: 'Project', eligibleFor: ['Assistant Professor'] },
  { id: 'ice_069', name: 'Industrial Lectures', code: 'ICCI-526', year: 4, semester: 8, credits: 1, type: 'Core', eligibleFor: ['Assistant Professor'] },
];

export const getSubjectsByDepartment = (department: string): Subject[] => {
  switch (department) {
    case 'Computer Science and Engineering':
      return cseSubjects;
    case 'Electronics and Communication Engineering':
      return eceSubjects;
    case 'Instrumentation and Control Engineering':
      return iceSubjects;
    default:
      return cseSubjects;
  }
};