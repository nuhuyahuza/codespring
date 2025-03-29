import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CourseActions } from '@/components/courses/CourseActions';
import { Button } from '@/components/ui';
import { Clock, Users, Star, BookOpen, CheckCircle, Play, Award, ChevronRight, ChevronDown } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { DEFAULT_COURSE_IMAGE } from '@/config/constants';
import { useState } from 'react';
import { Course } from '@/types/course';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

// Add this type definition
interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration: number;
  type: 'VIDEO' | 'READING' | 'QUIZ' | 'ASSIGNMENT';
  order: number;
}

export function CourseDetailPage() {
  const { courseId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();


  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await api.get<Course>(`/courses/${courseId}`, {
        params: {
          include: 'lessons,instructor'
        }
      });
      
      // Parse JSON strings into arrays
      if (typeof response.learningObjectives === 'string') {
        response.learningObjectives = JSON.parse(response.learningObjectives);
      }
      if (typeof response.requirements === 'string') {
        response.requirements = JSON.parse(response.requirements);
      }
      return response;
    },
  });

  // Only fetch enrollment status for students
  const { data: enrollmentStatus } = useQuery({
    queryKey: ['enrollmentStatus', courseId],
    queryFn: async () => {
      const response = await api.get<{ isEnrolled: boolean }>(`/student/courses/${courseId}/enrollment-status`,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      return response.isEnrolled;
    },
    enabled: user?.role === 'STUDENT', // Only run for students
  });


  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${courseId}` } });
      return;
    }

    if (!user?.hasCompletedOnboarding) {
      navigate('/onboarding');
      return;
    }

    if (!course) return;

    // Add to cart using cart context
    addToCart({
      id: courseId!,
      title: course.title,
      price: course.price
    });
    toast.success('Course added to cart!');
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    console.log(showPaymentModal);
    toast.success('Successfully enrolled in the course!');
    navigate(`/courses/${courseId}/learn`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-2/3 mb-4" />
            <div className="h-4 bg-muted rounded w-1/2 mb-8" />
            <div className="aspect-video bg-muted rounded-xl mb-8" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="col-span-2 space-y-4">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/6" />
              </div>
              <div className="h-64 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Course not found</p>
          <Button asChild>
            <Link to="/courses">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Ensure arrays are available even if parsing failed
  const learningObjectives = Array.isArray(course.learningObjectives) ? course.learningObjectives : [];
  const requirements = Array.isArray(course.requirements) ? course.requirements : [];

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-white/90 mb-6">{course.description}</p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span>{course.rating || '0'} rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{course._count?.enrolled || '0'} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration || '0'} hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{course.level || 'Beginner'}</span>
                </div>
              </div>
              <p className="text-lg mb-2">Created by {course.instructor?.name}</p>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-xl overflow-hidden shadow-xl bg-muted">
                <img
                  src={course.imageUrl || DEFAULT_COURSE_IMAGE}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== DEFAULT_COURSE_IMAGE) {
                      target.src = DEFAULT_COURSE_IMAGE;
                      target.onerror = null; // Prevent infinite loop
                    }
                  }}
                />
              </div>
              <div className="absolute -bottom-6 left-6 right-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                <CourseActions
                  courseId={course.id}
                  instructorId={course.instructor.id}
                  price={course.price}
                  isEnrolled={enrollmentStatus}
                  onEnroll={handleEnrollClick}
                />
                <p className="text-sm text-muted-foreground text-center mt-4">
                  30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-12">
              {/* What You'll Learn */}
              <div>
                <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {learningObjectives.map((objective: string, index: number) => (
                    <div key={index} className="flex gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                      <p className="text-muted-foreground">{objective}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Requirements</h2>
                <ul className="space-y-2">
                  {requirements.map((requirement: string, index: number) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                      <span className="text-muted-foreground">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Course Content */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                <div className="space-y-4">
                  {course.lessons?.sort((a: Lesson, b: Lesson) => a.order - b.order).map((lesson: Lesson) => (
                    <div key={lesson.id} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedLessonId(expandedLessonId === lesson.id ? null : lesson.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          {expandedLessonId === lesson.id ? (
                            <ChevronDown className="h-5 w-5 transition-transform duration-200" />
                          ) : (
                            <ChevronRight className="h-5 w-5 transition-transform duration-200" />
                          )}
                          {lesson.type === 'VIDEO' && <Play className="h-5 w-5 text-green-600" />}
                          {lesson.type === 'READING' && <BookOpen className="h-5 w-5 text-blue-600" />}
                          {lesson.type === 'QUIZ' && <CheckCircle className="h-5 w-5 text-yellow-600" />}
                          {lesson.type === 'ASSIGNMENT' && <Award className="h-5 w-5 text-purple-600" />}
                          <span className="font-medium">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {lesson.duration} min
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-muted">
                            {lesson.type.charAt(0) + lesson.type.slice(1).toLowerCase()}
                          </span>
                        </div>
                      </button>
                      
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          expandedLessonId === lesson.id ? 'max-h-48' : 'max-h-0'
                        }`}
                      >
                        <div className="p-4 bg-muted/30">
                          <p className="text-sm text-muted-foreground">
                            {lesson.description ?? `This is a ${lesson.type.toLowerCase()} lesson about ${lesson.title}.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 border">
                <h3 className="font-semibold mb-4">This course includes:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <Play className="h-5 w-5 text-green-600" />
                    <span>{course.duration} hours of video content</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <span>{course._count?.lessons || 0} lessons</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <Award className="h-5 w-5 text-green-600" />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 