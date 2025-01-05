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
import { Alert } from '@/components/ui/alert';
import { PaymentForm } from '@/features/payment/components/PaymentForm';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/features/auth/context/AuthContext';

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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePaymentSuccess = () => {
    navigate(`/courses/${course.id}/learn`);
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign in Required</CardTitle>
          <CardDescription>
            Please sign in to enroll in this course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You need to have an account and be signed in to enroll in courses.
          </p>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col w-full gap-4">
            <button
              onClick={() => navigate('/login', {
                state: { from: `/courses/${course.id}/enroll` }
              })}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/signup', {
                state: { from: `/courses/${course.id}/enroll` }
              })}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2 rounded-md"
            >
              Create account
            </button>
          </div>
        </CardFooter>
      </Card>
    );
  }

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
          <Alert variant="destructive">
            {error}
          </Alert>
        )}
        <PaymentForm
          courseId={course.id}
          amount={course.price}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </CardContent>
    </Card>
  );
} 