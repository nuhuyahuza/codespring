import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface EnrollmentFormProps {
  course: {
    id: string;
    title: string;
    description: string;
    price: number;
    instructor: {
      name: string;
    };
  };
}

export function EnrollmentForm({ course }: EnrollmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleEnroll = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to enroll in course');
      }

      // Redirect to course content or dashboard
      navigate(`/courses/${course.id}/learn`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enroll in Course</CardTitle>
        <CardDescription>
          You're about to enroll in {course.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Course Details</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {course.description}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Instructor</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {course.instructor.name}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Price</h3>
          <p className="text-2xl font-bold mt-1">
            {formatCurrency(course.price)}
          </p>
        </div>
        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex flex-col w-full gap-4">
          <Button
            onClick={handleEnroll}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Processing...' : `Enroll for ${formatCurrency(course.price)}`}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/courses')}
            disabled={isLoading}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 