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
}
