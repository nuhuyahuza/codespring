import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
  };
  price: number;
  thumbnail?: string;
}

export function AvailableCourses() {
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ['available-courses'],
    queryFn: async () => {
      const response = await fetch('/api/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    },
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to enroll');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolled-courses'] });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses?.map((course) => (
        <Card key={course.id}>
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="aspect-video w-full object-cover"
            />
          )}
          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              by {course.instructor.name}
            </p>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm">{course.description}</p>
            <Button
              onClick={() => enrollMutation.mutate(course.id)}
              disabled={enrollMutation.isPending}
              className="w-full"
            >
              {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 