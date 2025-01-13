import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { upload } from '../lib/upload'; // Assuming you have multer configured for file uploads
import { z } from 'zod';

const router = Router();

// Schema for assignment validation
const AssignmentSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  dueDate: z.string().datetime(),
  courseId: z.string(),
});

// Get all assignments for a student
router.get('/student/assignments', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.id;

    // Get all courses the student is enrolled in
    const enrolledCourses = await prisma.enrollment.findMany({
      where: { userId },
      select: { courseId: true },
    });

    const courseIds = enrolledCourses.map(ec => ec.courseId);

    // Get assignments for enrolled courses with submission status
    const assignments = await prisma.assignment.findMany({
      where: {
        courseId: { in: courseIds },
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
        submissions: {
          where: {
            userId,
          },
          select: {
            id: true,
            status: true,
            grade: true,
            feedback: true,
            fileUrl: true,
            createdAt: true,
          },
        },
      },
    });

    // Transform the data to match the frontend requirements
    const formattedAssignments = assignments.map(assignment => {
      const submission = assignment.submissions[0];
      return {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate.toISOString(),
        courseName: assignment.course.title,
        courseId: assignment.courseId,
        status: submission 
          ? submission.status === 'GRADED' 
            ? 'graded' 
            : 'submitted'
          : 'pending',
        grade: submission?.grade,
        feedback: submission?.feedback,
        submissionUrl: submission?.fileUrl,
      };
    });

    res.json(formattedAssignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Submit an assignment
router.post(
  '/student/assignments/:assignmentId/submit',
  authenticateUser,
  upload.single('file'),
  async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const userId = req.user!.id;
      const file = req.file;
      const notes = req.body.notes;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Check if assignment exists and student is enrolled in the course
      const assignment = await prisma.assignment.findFirst({
        where: {
          id: assignmentId,
          course: {
            enrollments: {
              some: {
                userId,
              },
            },
          },
        },
      });

      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found or not enrolled in course' });
      }

      // Check if already submitted
      const existingSubmission = await prisma.submission.findFirst({
        where: {
          assignmentId,
          userId,
        },
      });

      if (existingSubmission) {
        return res.status(400).json({ error: 'Assignment already submitted' });
      }

      // Create submission
      const submission = await prisma.submission.create({
        data: {
          assignmentId,
          userId,
          fileUrl: file.path, // Assuming you're storing the file path
          notes,
          status: 'SUBMITTED',
        },
      });

      res.json({ success: true, submission });
    } catch (error) {
      console.error('Error submitting assignment:', error);
      res.status(500).json({ error: 'Failed to submit assignment' });
    }
  }
);

// Get a specific assignment with submission details
router.get('/student/assignments/:assignmentId', authenticateUser, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.user!.id;

    const assignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        course: {
          enrollments: {
            some: {
              userId,
            },
          },
        },
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
        submissions: {
          where: {
            userId,
          },
        },
      },
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

// Get all assignments for an instructor's courses
router.get('/instructor/assignments', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.id;

    // Get all assignments from instructor's courses
    const assignments = await prisma.assignment.findMany({
      where: {
        course: {
          instructorId: userId,
        },
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
        submissions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.json(assignments);
  } catch (error) {
    console.error('Error fetching instructor assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Grade a submission
router.post('/instructor/submissions/:submissionId/grade', authenticateUser, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;
    const instructorId = req.user!.id;

    // Validate input
    if (grade < 0 || grade > 100) {
      return res.status(400).json({ error: 'Grade must be between 0 and 100' });
    }

    // Check if instructor has permission to grade this submission
    const submission = await prisma.submission.findFirst({
      where: {
        id: submissionId,
        assignment: {
          course: {
            instructorId,
          },
        },
      },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found or unauthorized' });
    }

    // Update submission with grade and feedback
    const updatedSubmission = await prisma.submission.update({
      where: {
        id: submissionId,
      },
      data: {
        grade,
        feedback,
        status: 'GRADED',
      },
    });

    res.json(updatedSubmission);
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({ error: 'Failed to grade submission' });
  }
});

export default router; 