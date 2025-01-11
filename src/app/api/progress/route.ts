import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

// POST /api/progress - Update lesson progress
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const { lessonId, completed, timeSpent, lastPosition } = json;

    // Check if progress record exists
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
    });

    // Update or create progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        completed: completed ?? existingProgress?.completed,
        timeSpent: timeSpent
          ? (existingProgress?.timeSpent || 0) + timeSpent
          : existingProgress?.timeSpent,
        lastPosition: lastPosition ?? existingProgress?.lastPosition,
      },
      create: {
        user: {
          connect: {
            id: session.user.id,
          },
        },
        lesson: {
          connect: {
            id: lessonId,
          },
        },
        completed: completed || false,
        timeSpent: timeSpent || 0,
        lastPosition: lastPosition || 0,
      },
    });

    // Check if all lessons are completed to issue certificate
    if (completed) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          course: {
            include: {
              lessons: true,
            },
          },
        },
      });

      if (lesson) {
        const allLessonsProgress = await prisma.lessonProgress.findMany({
          where: {
            userId: session.user.id,
            lesson: {
              courseId: lesson.courseId,
            },
          },
        });

        const allCompleted =
          allLessonsProgress.length === lesson.course.lessons.length &&
          allLessonsProgress.every((p) => p.completed);

        if (allCompleted) {
          // Issue certificate
          await prisma.certificate.create({
            data: {
              user: {
                connect: {
                  id: session.user.id,
                },
              },
              course: {
                connect: {
                  id: lesson.courseId,
                },
              },
              credentialId: `${lesson.courseId.slice(0, 6)}-${session.user.id.slice(
                0,
                6
              )}-${Date.now().toString(36)}`,
            },
          });
        }
      }
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

// GET /api/progress?courseId=xxx - Get progress for a course
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const progress = await prisma.lessonProgress.findMany({
      where: {
        userId: session.user.id,
        lesson: {
          courseId,
        },
      },
      include: {
        lesson: true,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
} 