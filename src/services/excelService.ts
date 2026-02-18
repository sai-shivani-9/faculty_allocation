import * as XLSX from 'xlsx';
import { Subject } from '../types';

interface ExcelSubjectRow {
  'Subject Name'?: string;
  'Subject Code'?: string;
  'Year/Semester'?: string | number;
  'Credits'?: string | number;
  'Subject Type'?: string;
}

interface ParseResult {
  success: boolean;
  subjects?: Subject[];
  errors?: string[];
}

export class ExcelService {
  static async parseExcelFile(file: File, semester: number): Promise<ParseResult> {
    const errors: string[] = [];
    const subjects: Subject[] = [];

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<ExcelSubjectRow>(worksheet);

      if (rows.length === 0) {
        return {
          success: false,
          errors: ['Excel file is empty. Please add at least one subject.']
        };
      }

      rows.forEach((row, index) => {
        const rowNumber = index + 2;
        const validationErrors = this.validateRow(row, rowNumber);

        if (validationErrors.length > 0) {
          errors.push(...validationErrors);
          return;
        }

        const subject: Subject = {
          id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: (row['Subject Name'] || '').trim(),
          code: (row['Subject Code'] || '').trim().toUpperCase(),
          year: this.extractYear(row['Year/Semester'] as string | number),
          semester: semester,
          credits: parseInt(String(row['Credits'] || '3'), 10),
          type: this.normalizeSubjectType(row['Subject Type'] as string),
          eligibleFor: ['Professor', 'Assistant Professor']
        };

        subjects.push(subject);
      });

      if (errors.length === 0 && subjects.length > 0) {
        return { success: true, subjects };
      } else if (subjects.length === 0) {
        return { success: false, errors };
      } else {
        return { success: false, subjects, errors };
      }
    } catch (error) {
      return {
        success: false,
        errors: [`Failed to process Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }

  private static validateRow(row: ExcelSubjectRow, rowNumber: number): string[] {
    const errors: string[] = [];

    if (!row['Subject Name'] || String(row['Subject Name']).trim() === '') {
      errors.push(`Row ${rowNumber}: Subject Name is mandatory.`);
    }

    if (!row['Subject Code'] || String(row['Subject Code']).trim() === '') {
      errors.push(`Row ${rowNumber}: Subject Code is mandatory.`);
    }

    if (!row['Year/Semester']) {
      errors.push(`Row ${rowNumber}: Year/Semester is mandatory.`);
    } else {
      const year = this.extractYear(row['Year/Semester'] as string | number);
      if (year < 1 || year > 4) {
        errors.push(`Row ${rowNumber}: Year/Semester must be 1-4 (${row['Year/Semester']} is invalid).`);
      }
    }

    if (!row['Credits']) {
      errors.push(`Row ${rowNumber}: Credits is mandatory.`);
    } else {
      const credits = parseInt(String(row['Credits']), 10);
      if (isNaN(credits) || credits < 1 || credits > 6) {
        errors.push(`Row ${rowNumber}: Credits must be a number between 1-6 (${row['Credits']} is invalid).`);
      }
    }

    if (!row['Subject Type'] || String(row['Subject Type']).trim() === '') {
      errors.push(`Row ${rowNumber}: Subject Type is mandatory.`);
    } else {
      const validTypes = ['Core', 'Elective', 'Lab', 'Project'];
      const normalizedType = this.normalizeSubjectType(row['Subject Type'] as string);
      if (!validTypes.includes(normalizedType)) {
        errors.push(
          `Row ${rowNumber}: Subject Type must be one of: Core, Elective, Lab, Project (${row['Subject Type']} is invalid).`
        );
      }
    }

    return errors;
  }

  private static extractYear(yearSemester: string | number): number {
    if (typeof yearSemester === 'number') {
      return Math.ceil(yearSemester / 2);
    }

    const str = String(yearSemester).trim().toLowerCase();

    if (str.includes('sem')) {
      const match = str.match(/sem[a-z]*\s*(\d+)/);
      if (match) {
        const semester = parseInt(match[1], 10);
        return Math.ceil(semester / 2);
      }
    }

    const match = str.match(/(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num <= 4) {
        return num;
      } else if (num <= 8) {
        return Math.ceil(num / 2);
      }
    }

    return 1;
  }

  private static normalizeSubjectType(type: string): 'Core' | 'Elective' | 'Lab' | 'Project' {
    const normalized = String(type).trim().toLowerCase();

    if (normalized === 'core') return 'Core';
    if (normalized === 'elective') return 'Elective';
    if (normalized === 'lab') return 'Lab';
    if (normalized === 'project') return 'Project';

    return 'Core';
  }
}
