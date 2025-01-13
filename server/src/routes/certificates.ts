import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { generateCertificatePDF } from '../lib/certificates';

const router = Router();

// Get all certificates for a student
router.get('/student/certificates', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.id;

    const certificates = await prisma.certificate.findMany({
      where: {
        userId,
      },
      include: {
        course: {
          select: {
            title: true,
            instructor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        issuedDate: 'desc',
      },
    });

    const formattedCertificates = certificates.map(cert => ({
      id: cert.id,
      courseTitle: cert.course.title,
      issuedDate: cert.issuedDate,
      grade: cert.grade,
      instructorName: cert.course.instructor.name,
      certificateUrl: cert.certificateUrl,
      status: cert.isIssued ? 'issued' : 'pending',
      completionDate: cert.completionDate,
    }));

    res.json(formattedCertificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// Download certificate
router.get('/student/certificates/:certificateId/download', authenticateUser, async (req, res) => {
  try {
    const { certificateId } = req.params;
    const userId = req.user!.id;

    const certificate = await prisma.certificate.findFirst({
      where: {
        id: certificateId,
        userId,
        isIssued: true,
      },
      include: {
        user: true,
        course: {
          include: {
            instructor: true,
          },
        },
      },
    });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    const pdfBuffer = await generateCertificatePDF({
      studentName: certificate.user.name,
      courseName: certificate.course.title,
      instructorName: certificate.course.instructor.name,
      completionDate: certificate.completionDate,
      grade: certificate.grade,
      certificateId: certificate.id,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${certificateId}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error downloading certificate:', error);
    res.status(500).json({ error: 'Failed to download certificate' });
  }
});

export default router; 