import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CourseActions } from '@/components/courses/CourseActions';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui';
import { Clock, Users, Star, BookOpen, Lightbulb } from 'lucide-react';
import { useAuth } from '@/features/auth';

export function CourseDetailPage() {
  const { courseId } = useParams();
  const { user } = useAuth();

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await api.get(`/courses/${courseId}`);
      console.log("Course", response);
      return response;
    },
  });
  console.log("Course", course);
  // Only fetch enrollment status for students
  const { data: enrollmentStatus } = useQuery({
    queryKey: ['enrollmentStatus', courseId],
    queryFn: async () => {
      const response = await api.get(`/student/courses/${courseId}/enrollment-status`);
      return response.data;
    },
    enabled: user?.role === 'STUDENT', // Only run for students
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">⌛</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <p className="text-muted-foreground">The course you're looking for doesn't exist.</p>
      </div>
    );
  }

  // Instructor tips section - only shown to instructors viewing others' courses
  const InstructorTips = () => {
    if (user?.role !== 'INSTRUCTOR' || user.id === course.instructor.id) return null;

    return (
      <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-6 mb-8">
        <h3 className="flex items-center text-lg font-semibold text-green-700 dark:text-green-300 mb-3">
          <Lightbulb className="w-5 h-5 mr-2" />
          Instructor Insights
        </h3>
        <div className="space-y-4">
          <p className="text-green-600 dark:text-green-400">
            Learn from this course's success to enhance your own teaching:
          </p>
          <ul className="list-disc list-inside space-y-2 text-green-600 dark:text-green-400">
            <li>Course structure and progression</li>
            <li>Content presentation techniques</li>
            <li>Student engagement methods</li>
            <li>Pricing and marketing strategies</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {user?.role === 'INSTRUCTOR' && <InstructorTips />}
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Course Content - Left Side */}
          <div className="md:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {course.duration} hours
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {course._count.enrollments} students
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                {course?.rating?.toFixed(1)}
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                {course._count.lessons} lessons
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold">About this course</h2>
              <p>{course.description}</p>

              <h2 className="text-xl font-semibold">What you'll learn</h2>
              <ul>
                {course.learningObjectives.map((objective: string, index: number) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>

              <h2 className="text-xl font-semibold">Requirements</h2>
              <ul>
                {course.requirements.map((requirement: string, index: number) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Course Actions - Right Side */}
          <div className="md:col-span-1">
            <div className="sticky top-8 rounded-lg border p-6 space-y-6">
              {course.imageUrl && (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/course-placeholder.jpg';
                  }}
                />
              )}
              
              <CourseActions
                courseId={course.id}
                instructorId={course.instructor.id}
                price={course.price}
                isEnrolled={enrollmentStatus?.isEnrolled}
              />

              {/* Only show course includes section for students or non-owner instructors */}
              {(user?.role === 'STUDENT' || (user?.role === 'INSTRUCTOR' && user.id !== course.instructor.id)) && (
                <div className="text-sm text-muted-foreground">
                  <h3 className="font-semibold mb-2">This course includes:</h3>
                  <ul className="space-y-2">
                    <li>• {course.duration} hours of video content</li>
                    <li>• {course._count.lessons} lessons</li>
                    <li>• Full lifetime access</li>
                    <li>• Certificate of completion</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 