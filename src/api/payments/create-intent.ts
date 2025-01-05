import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import Stripe from 'stripe';
import { verifyAuth } from '@/lib/auth';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const createIntentSchema = z.object({
  amount: z.number().positive(),
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
    const validatedData = createIntentSchema.parse(body);

    // Verify course exists and get details
    const course = await prisma.course.findUnique({
      where: { id: validatedData.courseId },
    });

    if (!course) {
      return new Response(
        JSON.stringify({ error: 'Course not found' }),
        { status: 404 }
      );
    }

    // Verify amount matches course price
    if (validatedData.amount !== course.price) {
      return new Response(
        JSON.stringify({ error: 'Invalid payment amount' }),
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(validatedData.amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        courseId: validatedData.courseId,
        userId: user.id,
      },
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
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

    console.error('Payment intent creation failed:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create payment intent' }),
      { status: 500 }
    );
  }
} 