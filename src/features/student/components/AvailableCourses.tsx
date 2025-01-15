import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  User: {
    name: string;
  };
  _count: {
    Enrollment: number;
  };
}

export function AvailableCourses() {
  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ['available-courses'],
    queryFn: async () => {
      const response = await fetch('/api/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      console.log('Courses data:', data); // Add this for debugging
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    console.error('Error loading courses:', error);
    return (
      <div className="text-center text-red-500 p-4">
        Error loading courses
      </div>
    );
  }

  if (!courses?.length) {
    return (
      <div className="text-center text-gray-500 p-4">
        No courses are currently available
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id}>
          {course.imageUrl && (
            <img
              src={course.imageUrl}
              alt={course.title}
              className="aspect-video w-full object-cover"
            />
          )}
          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              by {course.User?.name || 'Unknown Instructor'}
            </p>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm">{course.description}</p>
            <div className="flex justify-between items-center">
              <p className="font-semibold">${course.price}</p>
              <Button>Enroll Now</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 