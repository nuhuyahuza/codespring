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
  description: string;
  price: number;
  instructor: User;
  enrolledStudents: User[];
  groups: Group[];
  createdAt: string;
  updatedAt: string;
} 