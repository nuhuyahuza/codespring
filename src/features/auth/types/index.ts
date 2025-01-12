export type Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface CartItem {
  id: string;
  title: string;
  price: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: string;
  avatar?: string;
  hasCompletedOnboarding: boolean;
  phoneNumber?: string;
  dateOfBirth?: Date;
  occupation?: string;
  educationLevel?: string;
  preferredLanguage?: string;
  interests?: string[];
  createdAt: Date;
  updatedAt: Date;
} 