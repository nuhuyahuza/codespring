import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateUser } from '../middleware/auth';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role = 'STUDENT' } = req.body;

    // Validate role
    if (!['STUDENT', 'INSTRUCTOR'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name,
        email,
        password: hashedPassword,
        role,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({ 
      token, 
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        hasCompletedOnboarding: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role,
        hasCompletedOnboarding: user.hasCompletedOnboarding 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to login' });
    }
  }
});

// Add onboarding endpoint
router.post('/onboarding', authenticateUser, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { phoneNumber, dateOfBirth, occupation, educationLevel, interests, preferredLanguage } = req.body;

    // Update user with onboarding information
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        phoneNumber: phoneNumber as string,
        dateOfBirth: new Date(dateOfBirth),
        occupation: occupation as string,
        educationLevel: educationLevel as string,
        preferredLanguage: preferredLanguage as string,
        interests: JSON.stringify(interests),
        hasCompletedOnboarding: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        hasCompletedOnboarding: true,
        phoneNumber: true,
        dateOfBirth: true,
        occupation: true,
        educationLevel: true,
        preferredLanguage: true,
        interests: true
      }
    });

    res.json({
      message: 'Onboarding completed successfully',
      user: {
        ...updatedUser,
        interests: updatedUser.interests ? JSON.parse(updatedUser.interests) : []
      }
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ message: 'Failed to complete onboarding' });
  }
});

// Add /me endpoint to get current user data
router.get('/me', authenticateUser, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        hasCompletedOnboarding: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

export default router; 