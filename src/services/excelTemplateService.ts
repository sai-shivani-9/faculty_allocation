import * as XLSX from 'xlsx';

export class ExcelTemplateService {
  static generateTemplate(): void {
    const templateData = [
      {
        'Subject Name': 'Data Structures',
        'Subject Code': 'CS201',
        'Year/Semester': '2',
        'Credits': 3,
        'Subject Type': 'Core'
      },
      {
        'Subject Name': 'Web Development',
        'Subject Code': 'CS301',
        'Year/Semester': '3',
        'Credits': 4,
        'Subject Type': 'Elective'
      },
      {
        'Subject Name': 'Digital Electronics Lab',
        'Subject Code': 'EC251',
        'Year/Semester': '2',
        'Credits': 2,
        'Subject Type': 'Lab'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);

    worksheet['!cols'] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Subjects');

    XLSX.writeFile(workbook, 'subject_upload_template.xlsx');
  }
}
