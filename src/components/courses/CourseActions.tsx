import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { PencilIcon, BookOpen } from 'lucide-react';
import { useAuth } from '@/features/auth';

interface CourseActionsProps {
  courseId: string;
  instructorId: string;
  price: number;
  isEnrolled?: boolean;
  onEnroll: () => void;
}

export function CourseActions({ courseId, instructorId, price, isEnrolled, onEnroll }: CourseActionsProps) {
  const { user } = useAuth();

  // If user is not logged in, show sign in to enroll
  if (!user) {
    return (
      <Link to="/login" className="w-full">
        <Button className="w-full bg-green-600 hover:bg-green-700">
          Sign in to enroll
        </Button>
      </Link>
    );
  }

  // If user is an instructor
  if (user.role === 'INSTRUCTOR') {
    // If the instructor owns this course
    if (user.id === instructorId) {
      return (
        <div className="space-y-2">
          <Link to={`/courses/${courseId}/manage`} className="w-full">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <PencilIcon className="w-4 h-4 mr-2" />
              Manage Course
            </Button>
          </Link>
          <Link to={`/courses/${courseId}/analytics`} className="w-full">
            <Button variant="outline" className="w-full">
              View Analytics
            </Button>
          </Link>
        </div>
      );
    }
    // If the instructor doesn't own this course
    return (
      <div className="space-y-2">
        <Link to={`/courses/${courseId}/view`} className="w-full">
          <Button variant="outline" className="w-full">
            <BookOpen className="w-4 h-4 mr-2" />
            View Course Content
          </Button>
        </Link>
      </div>
    );
  }

  // If user is a student and already enrolled
  if (isEnrolled) {
    return (
      <Link to={`/courses/${courseId}/learn`} className="w-full">
        <Button className="w-full bg-green-600 hover:bg-green-700">
          Continue Learning
        </Button>
      </Link>
    );
  }

  // If user is a student and not enrolled
  return (
    <Button 
      className="w-full bg-green-600 hover:bg-green-700"
      onClick={onEnroll}
    >
      Add to Cart - ${price.toFixed(2)}
    </Button>
  );
}