import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { useCart } from '@/features/cart';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
    instructor: {
      name: string;
    };
  };
}

export function CourseCard({ course }: CourseCardProps) {
  const { isAuthenticated, user } = useAuth();
  const { addItem, items } = useCart();
  const isInCart = items.some(item => item.id === course.id);

  // Query to check enrollment status
  const { data: enrollmentStatus } = useQuery({
    queryKey: ['enrollmentStatus', course.id],
    queryFn: async () => {
      if (!isAuthenticated) return { isEnrolled: false };
      const response = await api.get(`/student/courses/${course.id}/enrollment-status`);
      return response.data;
    },
    enabled: isAuthenticated,
  });

  const isEnrolled = enrollmentStatus?.isEnrolled;

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      // Handle unauthenticated user (redirect to login, show modal, etc.)
      return;
    }

    if (isEnrolled) {
      return; // Already enrolled
    }

    addItem({
      id: course.id,
      title: course.title,
      price: course.price,
    });
  };

  return (
    <div className="group relative rounded-lg border p-4 hover:shadow-md transition-shadow">
      {course.imageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-md">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <p className="text-sm text-muted-foreground">{course.instructor.name}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {course.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold">${course.price}</span>
          <Button
            onClick={handleEnrollClick}
            disabled={isEnrolled || isInCart}
            variant={isEnrolled ? "outline" : "default"}
          >
            {isEnrolled ? 'Enrolled' : isInCart ? 'In Cart' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
} 