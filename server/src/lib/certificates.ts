import PDFDocument from 'pdfkit';

interface CertificateData {
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: Date;
  grade: number;
  certificateId: string;
}

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
      });

      const chunks: Buffer[] = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Add certificate content
      doc
        .font('Helvetica-Bold')
        .fontSize(30)
        .text('Certificate of Completion', { align: 'center' })
        .moveDown(0.5);

      doc
        .font('Helvetica')
        .fontSize(16)
        .text('This is to certify that', { align: 'center' })
        .moveDown(0.5);

      doc
        .font('Helvetica-Bold')
        .fontSize(24)
        .text(data.studentName, { align: 'center' })
        .moveDown(0.5);

      doc
        .font('Helvetica')
        .fontSize(16)
        .text('has successfully completed the course', { align: 'center' })
        .moveDown(0.5);

      doc
        .font('Helvetica-Bold')
        .fontSize(24)
        .text(data.courseName, { align: 'center' })
        .moveDown(0.5);

      doc
        .font('Helvetica')
        .fontSize(16)
        .text(`with a grade of ${data.grade}%`, { align: 'center' })
        .moveDown(1);

      doc
        .fontSize(14)
        .text(`Instructor: ${data.instructorName}`, { align: 'center' })
        .moveDown(0.5)
        .text(`Date: ${data.completionDate.toLocaleDateString()}`, { align: 'center' })
        .moveDown(0.5)
        .text(`Certificate ID: ${data.certificateId}`, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
} 