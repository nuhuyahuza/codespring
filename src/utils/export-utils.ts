
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { toast } from "sonner";

type ExportFormat = 'pdf' | 'excel' | 'print';

export const exportData = <T extends Record<string, any>>(
  data: T[],
  columns: { key: keyof T, label: string }[],
  filename: string,
  format: ExportFormat,
  title: string = "Exported Data"
) => {
  try {
    switch(format) {
      case 'pdf':
        exportToPdf(data, columns, filename, title);
        break;
      case 'excel':
        exportToExcel(data, columns, filename);
        break;
      case 'print':
        printData(data, columns, title);
        break;
      default:
        toast.error("Invalid export format");
    }
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Failed to export data");
  }
};

const exportToPdf = <T extends Record<string, any>>(
  data: T[],
  columns: { key: keyof T, label: string }[],
  filename: string,
  title: string
) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
  
  // Table headers
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  // Create table
  const tableColumn = columns.map(col => col.label);
  const tableRows = data.map(item => 
    columns.map(col => item[col.key]?.toString() || '')
  );
  
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [66, 66, 66] },
  });
  
  doc.save(`${filename}.pdf`);
  toast.success("PDF exported successfully");
};

const exportToExcel = <T extends Record<string, any>>(
  data: T[],
  columns: { key: keyof T, label: string }[],
  filename: string
) => {
  // Format data for Excel
  const formattedData = data.map(item => {
    const row: Record<string, any> = {};
    columns.forEach(col => {
      row[col.label] = item[col.key];
    });
    return row;
  });
  
  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(formattedData);
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  
  // Generate Excel file
  XLSX.writeFile(wb, `${filename}.xlsx`);
  toast.success("Excel file exported successfully");
};

const printData = <T extends Record<string, any>>(
  data: T[],
  columns: { key: keyof T, label: string }[],
  title: string
) => {
  // Create a printable HTML table
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast.error("Unable to open print window. Please check your popup settings.");
    return;
  }
  
  // Create HTML content
  let htmlContent = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { font-size: 18px; margin-bottom: 10px; }
          p { font-size: 12px; color: #666; margin-bottom: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
          }
          th { 
            background-color: #f2f2f2; 
            font-weight: bold; 
          }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              ${columns.map(col => `<th>${col.label}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
  `;
  
  // Add table rows
  data.forEach(item => {
    htmlContent += '<tr>';
    columns.forEach(col => {
      htmlContent += `<td>${item[col.key] || ''}</td>`;
    });
    htmlContent += '</tr>';
  });
  
  // Close HTML tags
  htmlContent += `
          </tbody>
        </table>
      </body>
    </html>
  `;
  
  // Write to print window and trigger print
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load before printing
  setTimeout(() => {
    printWindow.print();
    toast.success("Print dialog opened");
  }, 250);
};
