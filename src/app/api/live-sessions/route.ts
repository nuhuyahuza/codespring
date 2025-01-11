import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

// POST /api/live-sessions - Create a live session (instructors only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const { courseId, title, description, startTime, duration, meetingUrl } = json;

    const liveSession = await prisma.liveSession.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        duration: parseInt(duration),
        meetingUrl,
        course: {
          connect: {
            id: courseId,
          },
        },
        instructor: {
          connect: {
            id: session.user.id,
          },
        },
      },
      include: {
        course: true,
        instructor: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(liveSession);
  } catch (error) {
    console.error("Error creating live session:", error);
    return NextResponse.json(
      { error: "Failed to create live session" },
      { status: 500 }
    );
  }
}

// GET /api/live-sessions - Get upcoming live sessions
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const liveSessions = await prisma.liveSession.findMany({
      where: {
        startTime: {
          gte: now,
        },
        course: {
          enrollments: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        course: true,
        instructor: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json(liveSessions);
  } catch (error) {
    console.error("Error fetching live sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch live sessions" },
      { status: 500 }
    );
  }
} 