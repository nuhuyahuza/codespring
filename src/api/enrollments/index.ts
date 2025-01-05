import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const enrollmentSchema = z.object({
  courseId: z.string(),
});

export async function POST(req: Request) {
  try {
    // TODO: Get user ID from authentication token
    const userId = 'user-id'; // Placeholder

    const body = await req.json();
    const validatedData = enrollmentSchema.parse(body);

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: validatedData.courseId,
      },
    });

    if (existingEnrollment) {
      return new Response(
        JSON.stringify({ error: 'You are already enrolled in this course' }),
        { status: 400 }
      );
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId: validatedData.courseId,
        paymentStatus: 'pending', // You'll update this after payment processing
      },
      include: {
        course: {
          select: {
            title: true,
            price: true,
          },
        },
      },
    });

    // TODO: Integrate with payment processing service
    // For now, we'll simulate a successful payment
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { paymentStatus: 'completed' },
    });

    return new Response(
      JSON.stringify({
        message: 'Successfully enrolled in course',
        enrollment: {
          id: enrollment.id,
          courseId: enrollment.courseId,
          paymentStatus: 'completed',
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: error.errors[0].message }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Failed to enroll in course' }),
      { status: 500 }
    );
  }
} 