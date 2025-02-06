export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  groupId: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  courseId: string;
  members: User[];
  messages: Message[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string | null;
  progress: number;
  tags: string[];
  description?: string;
  price?: number;
  duration?: number;
  difficulty?: string; 
  status: 'in-progress' | 'completed';
  lastAccessedAt?: string;
}

export interface LiveClass {
  id: string;
  courseId: string;
  courseName: string;
  instructorName: string;
  startTime: string;
  duration: number;
  meetingLink: string;
  description?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
  submissionUrl?: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  isJoined: boolean;
  recentActivity?: {
    type: 'post' | 'question' | 'discussion';
    title: string;
    timestamp: string;
  }[];
} 