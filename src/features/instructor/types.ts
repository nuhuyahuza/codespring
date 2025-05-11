export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  level: string;
  duration: number;
  imageUrl: string | null;
  _count: {
    enrollments: number;
    lessons: number;
  };
  updatedAt: string;
} 