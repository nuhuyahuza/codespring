import express from 'express';
import { PrismaClient, LessonType } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';
import crypto from 'crypto';
import { upload } from '../middleware/upload';

const router = express.Router();
const prisma = new PrismaClient();

interface Section {
  title: string;
  description?: string;
  order?: number;
  lessons?: Lesson[];
}

interface Lesson {
  title: string;
  type?: LessonType;
  content?: string;
  order?: number;
  duration?: number;
}

// Type definitions
// Get all courses with optional featured filter
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    
    const courses = await prisma.course.findMany({
      take: featured === 'true' ? 3 : undefined,
      orderBy: [
        {
          createdAt: 'desc'
        }
      ],
      include: {
        instructor: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });
    
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get a single course
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
          },
        },
        sections: {
          include: {
            lessons: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Create a course
router.post('/', authenticateUser, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      price,
      language,
      tags,
      isLiveEnabled,
      liveSessionDetails,
      learningObjectives,
      requirements,
    } = req.body;

    const course = await prisma.course.create({
      data: {
        id: crypto.randomUUID(),
        title,
        description,
        category,
        level,
        price: Number(price),
        language,
        tags,
        isLiveEnabled: Boolean(isLiveEnabled),
        liveSessionDetails,
        learningObjectives,
        requirements,
        status: 'DRAFT',
        lastSavedStep: 'basics',
        updatedAt: new Date(),
        instructor: {
          connect: {
            id: req.user!.id,
          },
        },
      },
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' + error });
  }
});

// Update a course
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;

    // Verify ownership
    const existingCourse = await prisma.course.findFirst({
      where: {
        id,
        instructorId: req.user!.id,
      },
    });

    if (!existingCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        price,
      },
    });

    res.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete a course
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const existingCourse = await prisma.course.findFirst({
      where: {
        id,
        instructorId: req.user!.id,
      },
    });

    if (!existingCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await prisma.course.delete({
      where: { id },
    });

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Get course content
router.get('/:id/content', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
          },
        },
        lessons: {
          orderBy: {
            order: 'asc',
          },
          include: {
            progress: userId ? {
              where: {
                userId,
              },
            } : false,
          },
        },
        enrollments: userId ? {
          where: {
            userId,
          },
        } : undefined,
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const isEnrolled = userId ? course.enrollments?.length > 0 : false;
    const isInstructor = userId ? course.instructor.id === userId : false;

    const formattedLessons = course.lessons.map((lesson, index) => ({
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,
      isPreview: index < 3,
      ...(isEnrolled || isInstructor ? {
        content: lesson.content,
        completed: lesson.progress?.[0]?.completed ?? false,
        timeSpent: lesson.progress?.[0]?.timeSpent ?? 0,
      } : {}),
    }));

    res.json({
      id: course.id,
      title: course.title,
      instructor: course.instructor.id,
      lessons: formattedLessons,
      isEnrolled,
    });
  } catch (error) {
    console.error('Error fetching course content:', error);
    res.status(500).json({ error: 'Failed to fetch course content' });
  }
});

// Get course progress
router.get('/:id/progress', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        lessons: {
          include: {
            progress: {
              where: {
                userId: req.user!.id,
              },
            },
          },
        },
        enrollments: {
          where: {
            userId: req.user!.id,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (!course.enrollments.length) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    const completedLessons = course.lessons
      .filter(lesson => lesson.progress.length > 0 && lesson.progress[0].completed)
      .map(lesson => lesson.id);

    const totalProgress = course.lessons.length > 0
      ? completedLessons.length / course.lessons.length
      : 0;

    const totalTimeSpent = course.lessons.reduce(
      (total, lesson) => total + (lesson.progress[0]?.timeSpent || 0),
      0
    );

    res.json({
      completedLessons,
      totalProgress,
      totalTimeSpent,
      currentLesson: course.lessons.find(lesson => !lesson.progress[0]?.completed)?.id || null,
    });
  } catch (error) {
    console.error('Error fetching course progress:', error);
    res.status(500).json({ error: 'Failed to fetch course progress' });
  }
});

// Enroll in a course
router.post('/:id/enroll', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        lessons: true,
        enrollments: {
          where: {
            userId,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already enrolled
    if (course.enrollments.length > 0) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        courseId: id,
        updatedAt: new Date()
      }
    });

    // Create initial progress records for all lessons
    await prisma.$transaction(
      course.lessons.map(lesson => 
        prisma.lessonProgress.create({
          data: {
            id: crypto.randomUUID(),
            lessonId: lesson.id,
            userId,
            completed: false,
            timeSpent: 0,
            updatedAt: new Date()
          }
        })
      )
    );

    res.status(200).json({ success: true, enrollment });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

// Get featured courses
router.get('/featured', async (req, res) => {
  try {
    const featuredCourses = await prisma.course.findMany({
      take: 3,
      where: {
        status: 'PUBLISHED',
      },
      orderBy: [
        {
          createdAt: 'desc'
        }
      ],
      include: {
        instructor: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    const formattedCourses = featuredCourses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      thumbnail: course.imageUrl || '/course-placeholder.jpg',
      instructor: course.instructor.name,
      enrolled: course._count.enrollments,
    }));

    res.json(formattedCourses);
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    res.status(500).json({ error: 'Failed to fetch featured courses' });
  }
});

// Get course content for learning
router.get('/:id/learn', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const course = await prisma.course.findUnique({
      where: { 
        id,
      },
      include: {
        instructor: {
          select: {
            name: true,
          },
        },
        lessons: {
          orderBy: {
            order: 'asc',
          },
          include: {
            progress: {
              where: {
                userId,
              },
              select: {
                completed: true,
                timeSpent: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user is enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: id,
        },
      },
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course content:', error);
    res.status(500).json({ error: 'Failed to fetch course content' });
  }
});

// Add this endpoint to handle lesson progress
router.post('/:courseId/lessons/:lessonId/progress', authenticateUser, async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { completed, timeSpent } = req.body;
    const userId = req.user!.id;

    console.log('Progress Update Request:', {
      courseId,
      lessonId,
      userId,
      completed,
      timeSpent
    });

    // First check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    console.log('Enrollment check:', enrollment);

    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Then check if lesson exists and belongs to the course
    const lesson = await prisma.lesson.findFirst({
      where: { 
        id: lessonId,
        courseId,
      },
    });

    console.log('Lesson check:', lesson);

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Update or create progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed,
        timeSpent: {
          increment: timeSpent,
        },
        updatedAt: new Date(),
      },
      create: {
        id: crypto.randomUUID(),
        userId,
        lessonId,
        completed,
        timeSpent,
        updatedAt: new Date(),
      },
    });

    console.log('Progress updated:', progress);
    res.json(progress);
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    res.status(500).json({ error: 'Failed to update lesson progress' });
  }
});

// Add thumbnail to course
router.post('/:id/thumbnail', 
  authenticateUser, 
  upload.single('thumbnail') as unknown as express.RequestHandler,
  async (req, res) => {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const course = await prisma.course.findFirst({
        where: {
          id,
          instructorId: req.user!.id,
        },
      });

      if (!course) {
        return res.status(404).json({ error: 'Course not found or unauthorized' });
      }

      // Generate the URL for the uploaded file
      const imageUrl = `/uploads/course-thumbnails/${file.filename}`;

      const updatedCourse = await prisma.course.update({
        where: { id },
        data: {
          imageUrl,
          updatedAt: new Date(),
        },
      });

      res.json(updatedCourse);
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      res.status(500).json({ error: 'Failed to upload thumbnail' });
    }
  }
);

// Add section to course
router.post('/:courseId/sections', authenticateUser, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;

    // Verify course ownership
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: req.user!.id,
      },
      include: {
        sections: true,
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const section = await prisma.section.create({
      data: {
        title,
        description,
        order: course.sections.length,
        courseId,
      },
    });

    res.status(201).json(section);
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(500).json({ error: 'Failed to create section' });
  }
});

// Add lesson to section
router.post('/:courseId/sections/:sectionId/lessons', authenticateUser, async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const {
      title,
      description,
      type,
      content,
      videoUrl,
      duration,
      isPreview,
      attachments,
      completionCriteria,
    } = req.body;

    // Verify course ownership
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: req.user!.id,
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get current section's lesson count for ordering
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: { lessons: true },
    });

    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        type,
        content,
        isPreview,
        attachments,
        completionCriteria,
        order: section.lessons.length,
        courseId,
        sectionId,
      },
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

// Update course status
router.patch('/:courseId/status', authenticateUser, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { status } = req.body;

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: req.user!.id,
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { status },
    });

    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course status:', error);
    res.status(500).json({ error: 'Failed to update course status' });
  }
});

router.post('/:id/:step', authenticateUser, async(req,res) => {
  try {
    const { id, step } = req.params;
    const { sections, completedSteps, ...rest } = req.body;

    console.log('Request body:', { sections, completedSteps, rest });

    // Handle curriculum step differently
    if (step === 'curriculum') {
      // First, delete existing sections (cascade will delete related lessons)
      await prisma.section.deleteMany({
        where: { courseId: id }
      });

      // Safely parse completedSteps
      let parsedCompletedSteps = [];
      try {
        if (completedSteps) {
          parsedCompletedSteps = typeof completedSteps === 'string'
            ? JSON.parse(completedSteps)
            : Array.isArray(completedSteps)
              ? completedSteps
              : [];
        }
      } catch (e) {
        console.warn('Error parsing completedSteps, initializing as empty array:', e);
      }

      // Update course
      const course = await prisma.course.update({
        where: { id },
        data: {
          ...rest,
          lastSavedStep: step,
          completedSteps: JSON.stringify(parsedCompletedSteps),
          updatedAt: new Date()
        },
      });

      // Create sections and lessons if they exist
      if (sections?.create && Array.isArray(sections.create)) {
        console.log('Creating sections:', sections.create);
        
        for (const sectionData of sections.create) {
          // Create section
          const section = await prisma.section.create({
            data: {
              id: crypto.randomUUID(),
              title: sectionData.title,
              description: sectionData.description || '',
              order: sectionData.order || 0,
              courseId: id
            },
          });

          // Create lessons for this section if they exist
          if (sectionData.lessons?.create && Array.isArray(sectionData.lessons.create)) {
            for (const lessonData of sectionData.lessons.create) {
              await prisma.lesson.create({
                data: {
                  id: crypto.randomUUID(),
                  title: lessonData.title,
                  type: lessonData.type || 'VIDEO',
                  content: lessonData.content || '',
                  order: lessonData.order || 0,
                  courseId: id,
                  sectionId: section.id
                }
              });
            }
          }
        }
      }

      // Fetch the updated course with sections and lessons
      const updatedCourse = await prisma.course.findUnique({
        where: { id },
        include: {
          sections: {
            include: {
              lessons: true
            }
          }
        }
      });

      return res.status(201).json(updatedCourse);
    } 
    else {
      // Original logic for other steps
      const sectionsArray = Array.isArray(sections) ? sections : 
        typeof sections === 'string' ? JSON.parse(sections) : 
        sections ? [sections] : [];

      console.log('Processed sections:', sectionsArray);

      // For pricing step, handle certification data
      if (step === 'pricing') {
        const {
          price,
          isLiveEnabled,
          liveSessionDetails,
          hasCertification,
          certificationPrice,
          certificationDetails,
          status,
          completedSteps
        } = rest;

        // Safely parse completedSteps
        let parsedCompletedSteps = [];
        try {
          if (completedSteps) {
            parsedCompletedSteps = typeof completedSteps === 'string'
              ? JSON.parse(completedSteps)
              : Array.isArray(completedSteps)
                ? completedSteps
                : [];
          }
        } catch (e) {
          console.warn('Error parsing completedSteps, initializing as empty array:', e);
        }

        const course = await prisma.course.update({
          where: { id },
          data: {
            price: Number(price) || 0,
            isLiveEnabled: Boolean(isLiveEnabled),
            liveSessionDetails: isLiveEnabled && liveSessionDetails ? 
              typeof liveSessionDetails === 'string' ? liveSessionDetails : JSON.stringify(liveSessionDetails) 
              : null,
            hasCertification: Boolean(hasCertification),
            certificationPrice: hasCertification ? Number(certificationPrice) : null,
            certificationDetails: hasCertification && certificationDetails ? 
              typeof certificationDetails === 'string' ? certificationDetails : JSON.stringify(certificationDetails)
              : null,
            lastSavedStep: step,
            completedSteps: JSON.stringify(parsedCompletedSteps),
            status: status || 'DRAFT',
            updatedAt: new Date()
          },
        });

        return res.status(201).json(course);
      }

      // Validate and format sections data
      const validSections = sectionsArray
        .filter((section: unknown): section is Section => 
          section !== null && 
          typeof section === 'object' && 
          'title' in section && 
          typeof (section as Section).title === 'string'
        )
        .map((section: Section, index: number) => ({
          title: section.title,
          description: section.description || '',
          order: index,
          courseId: id,
          lessons: section.lessons && Array.isArray(section.lessons) ? 
            section.lessons
              .filter((lesson): lesson is Lesson => lesson && typeof lesson.title === 'string')
              .map((lesson, lessonIndex) => ({
                title: lesson.title,
                type: (lesson.type as LessonType) || 'VIDEO',
                content: lesson.content || '',
                order: lessonIndex,
                courseId: id
              }))
            : []
        }));

      // Update course
      const course = await prisma.course.update({
        where: { id },
        data: {
          ...rest,
          lastSavedStep: step,
          completedSteps: Array.isArray(completedSteps) ? completedSteps : 
            typeof completedSteps === 'string' ? JSON.parse(completedSteps) : undefined,
          updatedAt: new Date()
        },
      });

      // Create sections and lessons if in curriculum step
      if (step === 'curriculum' && validSections.length > 0) {
        console.log('Valid sections:', validSections);
        for (const sectionData of validSections) {
          const { lessons, ...sectionFields } = sectionData;
          
          // Create section
          const section = await prisma.section.create({
            data: {
              ...sectionFields,
              id: crypto.randomUUID()
            },
          });

          // Create lessons for this section
          if (lessons && lessons.length > 0) {
            await prisma.lesson.createMany({
              data: lessons.map((lesson: Lesson) => ({
                id: crypto.randomUUID(),
                ...lesson,
                sectionId: section.id
              }))
            });
          }
        }
      }

      return res.status(201).json(course);
    }
  } catch (error) {
    console.error('Error updating course:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ error: 'Failed to update course: ' + error });
  }
});
export default router; 