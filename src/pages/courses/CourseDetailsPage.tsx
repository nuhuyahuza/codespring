import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Users, Clock, BookOpen, CheckCircle, Play, Award } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/features/auth';
import { useCart } from '@/contexts/CartContext';
import axios from 'axios';
import { DEFAULT_COURSE_IMAGE } from '@/config/constants';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  students: number;
  duration: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  learningOutcomes: string[];
  prerequisites: string[];
  curriculum: {
    section: string;
    lessons: {
      title: string;
      duration: string;
      type: 'video' | 'quiz' | 'assignment';
    }[];
  }[];
}

const SAMPLE_COURSE: Course = {
  id: '1',
  title: 'Web Development Fundamentals',
  description: 'A comprehensive introduction to modern web development. Learn HTML, CSS, JavaScript, and modern development tools to build responsive and dynamic websites.',
  instructor: 'John Doe',
  thumbnail: '/course-thumbnails/web-dev.jpg',
  rating: 4.8,
  students: 1234,
  duration: '12 weeks',
  price: 99.99,
  level: 'Beginner',
  category: 'Web Development',
  learningOutcomes: [
    'Build responsive websites using HTML5 and CSS3',
    'Write clean and efficient JavaScript code',
    'Understand modern web development workflows',
    'Deploy websites to production environments',
    'Implement common web design patterns'
  ],
  prerequisites: [
    'Basic computer skills',
    'Understanding of how the internet works',
    'No prior coding experience required'
  ],
  curriculum: [
    {
      section: 'Getting Started',
      lessons: [
        { title: 'Course Introduction', duration: '10 min', type: 'video' },
        { title: 'Setting Up Your Development Environment', duration: '20 min', type: 'video' },
        { title: 'Web Development Overview', duration: '15 min', type: 'video' }
      ]
    },
    {
      section: 'HTML Fundamentals',
      lessons: [
        { title: 'HTML Document Structure', duration: '25 min', type: 'video' },
        { title: 'Working with Text and Links', duration: '30 min', type: 'video' },
        { title: 'HTML Practice Quiz', duration: '20 min', type: 'quiz' },
        { title: 'Building Your First Webpage', duration: '45 min', type: 'assignment' }
      ]
    }
  ]
};

export function CourseDetailsPage() {
  const { courseId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // For now, using sample data
        // const response = await axios.get(`/api/courses/${courseId}`);
        // setCourse(response.data);
        setCourse(SAMPLE_COURSE);
      } catch (error) {
        console.error('Error fetching course:', error);
        setError('Failed to load course details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

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

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Course not found'}</p>
          <Link to="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
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
                    <span>{course.rating} rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>{course.students} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span>{course.level}</span>
                  </div>
                </div>
                <p className="text-lg mb-2">Created by {course.instructor}</p>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-xl overflow-hidden shadow-xl bg-muted">
                  <img
                    src={course.thumbnail || DEFAULT_COURSE_IMAGE}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = DEFAULT_COURSE_IMAGE;
                      target.onerror = null; // Prevent infinite loop if default image also fails
                    }}
                  />
                </div>
                <div className="absolute -bottom-6 left-6 right-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-3xl font-bold">${course.price}</span>
                    <Button 
                      size="lg" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleEnrollClick}
                    >
                      {isAuthenticated ? 'Add to Cart' : 'Login to Enroll'}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
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
                    {course.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex gap-3">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                        <p className="text-muted-foreground">{outcome}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prerequisites */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Prerequisites</h2>
                  <ul className="space-y-2">
                    {course.prerequisites.map((prerequisite, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full" />
                        <span className="text-muted-foreground">{prerequisite}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Course Content */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                  <div className="space-y-4">
                    {course.curriculum.map((section, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <div className="bg-muted p-4">
                          <h3 className="font-semibold">{section.section}</h3>
                        </div>
                        <div className="divide-y">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="p-4 flex items-center justify-between hover:bg-muted/50">
                              <div className="flex items-center gap-3">
                                {lesson.type === 'video' && <Play className="h-5 w-5 text-green-600" />}
                                {lesson.type === 'quiz' && <BookOpen className="h-5 w-5 text-green-600" />}
                                {lesson.type === 'assignment' && <Award className="h-5 w-5 text-green-600" />}
                                <span>{lesson.title}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                            </div>
                          ))}
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
                      <span>12 hours of video content</span>
                    </li>
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      <span>4 coding exercises</span>
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
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        courseId={courseId!}
        courseTitle={course?.title || ''}
        amount={course?.price || 0}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
} 