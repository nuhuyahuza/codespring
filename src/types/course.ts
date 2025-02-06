export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor: {
    id: string;
    name: string;
  };
  _count: {
    enrolled: number;
    lessons: number;
  };
  lessonPreviews: string[];
  learningObjectives: string[];
  courseContent: string[];
  requirements: string[];
  rating: number;
  level: string;
  duration: number;
  imageUrl: string;
  lessons: []
}
