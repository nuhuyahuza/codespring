import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import Stripe from 'stripe';
import { verifyAuth } from '@/lib/auth';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const processPaymentSchema = z.object({
  paymentMethodId: z.string(),
  courseId: z.string(),
});

export async function POST(req: Request) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = processPaymentSchema.parse(body);

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: validatedData.courseId },
    });

    if (!course) {
      return new Response(
        JSON.stringify({ error: 'Course not found' }),
        { status: 404 }
      );
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: validatedData.courseId,
      },
    });

    if (existingEnrollment) {
      return new Response(
        JSON.stringify({ error: 'Already enrolled in this course' }),
        { status: 400 }
      );
    }

    // Create payment with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(course.price * 100),
      currency: 'usd',
      payment_method: validatedData.paymentMethodId,
      confirm: true,
      metadata: {
        courseId: validatedData.courseId,
        userId: user.id,
      },
    });

    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment failed');
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: validatedData.courseId,
        paymentStatus: 'completed',
      },
    });

    return new Response(
      JSON.stringify({
        message: 'Payment successful',
        enrollment: {
          id: enrollment.id,
          courseId: enrollment.courseId,
          paymentStatus: enrollment.paymentStatus,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: error.errors[0].message }),
        { status: 400 }
      );
    }

    console.error('Payment processing failed:', error);
    return new Response(
      JSON.stringify({ error: 'Payment processing failed' }),
      { status: 500 }
    );
  }
} 