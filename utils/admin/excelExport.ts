import ExcelJS from 'exceljs';
import { Booking } from "@/components/admin/bookings/types";
import { BOOKING_CSV_FIELDS } from './csvExport';


export async function downloadExcel(bookings: Booking[], filename: string): Promise<void> {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bookings');

    worksheet.properties.defaultRowHeight = 20;

    const headers = BOOKING_CSV_FIELDS.map(field => field.header);
    const headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '366092' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    bookings.forEach((booking) => {
      const rowData = BOOKING_CSV_FIELDS.map(field => {
        const value = field.getValue(booking);
        return value || '';
      });
      const dataRow = worksheet.addRow(rowData);
      
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'E0E0E0' } },
          left: { style: 'thin', color: { argb: 'E0E0E0' } },
          bottom: { style: 'thin', color: { argb: 'E0E0E0' } },
          right: { style: 'thin', color: { argb: 'E0E0E0' } }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });
    });

    worksheet.columns.forEach((column) => {
      if (column && column.eachCell) {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = Math.min(maxLength + 2, 50);
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 100);

  } catch (error) {
    console.error('Failed to generate Excel file:', error);
    throw new Error('Failed to generate Excel file');
  }
}


export function generateExcelFilename(prefix: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${prefix}_export_${timestamp}.xlsx`;
}