import { Router } from 'express';
import { prisma } from '@/server/db';
import { authenticateUser } from '@/server/middleware/auth';
import multer from 'multer';
import { Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/submissions',
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Submission validation schema
const submissionSchema = z.object({
  courseId: z.string(),
  lessonId: z.string(),
  content: z.string(),
});

// Grading validation schema
const gradingSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string(),
});

// Submit assignment
router.post(
  '/api/submissions',
  authenticateUser,
  upload.array('attachments'),
  async (req: Request, res: Response) => {
    try {
      const { courseId, lessonId, content } = submissionSchema.parse(req.body);
      const files = req.files as Express.Multer.File[];

      // Check if student is enrolled in the course
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          courseId,
          userId: req.user.id,
          status: 'ACTIVE',
        },
      });

      if (!enrollment) {
        return res.status(403).json({ error: 'Not enrolled in this course' });
      }

      // Create submission
      const submission = await prisma.submission.create({
        data: {
          courseId,
          lessonId,
          userId: req.user.id,
          content,
          status: 'PENDING',
          attachments: files.map((file) => ({
            name: file.originalname,
            url: `/uploads/submissions/${file.filename}`,
          })),
        },
      });

      res.json(submission);
    } catch (error) {
      console.error('Error creating submission:', error);
      res.status(500).json({ error: 'Failed to create submission' });
    }
  }
);

// Get submissions for a lesson (instructor only)
router.get(
  '/api/lessons/:lessonId/submissions',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { lessonId } = req.params;

      // Check if user is the instructor of the course
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          section: {
            include: {
              course: true,
            },
          },
        },
      });

      if (!lesson || lesson.section.course.instructorId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const submissions = await prisma.submission.findMany({
        where: { lessonId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { submittedAt: 'desc' },
      });

      res.json(submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      res.status(500).json({ error: 'Failed to fetch submissions' });
    }
  }
);

// Get a specific submission
router.get(
  '/api/submissions/:submissionId',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { submissionId } = req.params;

      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          lesson: {
            include: {
              section: {
                include: {
                  course: true,
                },
              },
            },
          },
        },
      });

      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      // Check if user is authorized to view the submission
      const isInstructor = submission.lesson.section.course.instructorId === req.user.id;
      const isStudent = submission.userId === req.user.id;

      if (!isInstructor && !isStudent) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      res.json(submission);
    } catch (error) {
      console.error('Error fetching submission:', error);
      res.status(500).json({ error: 'Failed to fetch submission' });
    }
  }
);

// Grade a submission (instructor only)
router.post(
  '/api/submissions/:submissionId/grade',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { submissionId } = req.params;
      const { score, feedback } = gradingSchema.parse(req.body);

      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: {
          lesson: {
            include: {
              section: {
                include: {
                  course: true,
                },
              },
            },
          },
        },
      });

      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      // Check if user is the instructor of the course
      if (submission.lesson.section.course.instructorId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      // Update submission with grade
      const updatedSubmission = await prisma.submission.update({
        where: { id: submissionId },
        data: {
          score,
          feedback,
          status: 'GRADED',
          gradedAt: new Date(),
          gradedById: req.user.id,
        },
      });

      res.json(updatedSubmission);
    } catch (error) {
      console.error('Error grading submission:', error);
      res.status(500).json({ error: 'Failed to grade submission' });
    }
  }
);

export default router; 