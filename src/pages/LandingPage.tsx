import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, MessageCircle, Star } from 'lucide-react';
import axios from 'axios';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAuth } from '@/features/auth';
import { Navigation } from '@/components/layout/Navigation';
import { api } from '@/lib/api';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  instructor: string;
  enrolled: number;
}

interface Testimonial {
  id: string;
  content: string;
  studentName: string;
  studentRole: string;
  studentAvatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    content: "The course structure and hands-on projects helped me transition from a complete beginner to a confident web developer. The instructors are incredibly supportive and the community is amazing!",
    studentName: "Sarah Chen",
    studentRole: "Frontend Developer at TechCorp",
    studentAvatar: "/testimonials/student1.jpg"
  },
  {
    id: '2',
    content: "I've taken several online courses before, but CodeSpring's practical approach and real-world projects really set it apart. I landed my dream job within months of completing the Advanced React course.",
    studentName: "Emily Rodriguez",
    studentRole: "Full Stack Developer",
    studentAvatar: "/testimonials/student2.jpg"
  },
  {
    id: '3',
    content: "The DevOps course was exactly what I needed to level up my career. The instructor's expertise and the comprehensive curriculum exceeded my expectations. Highly recommended!",
    studentName: "Michael Park",
    studentRole: "DevOps Engineer",
    studentAvatar: "/testimonials/student3.jpg"
  },
  {
    id: '4',
    content: "As a career switcher, I was worried about learning to code. CodeSpring's supportive community and step-by-step approach made the journey much easier than I expected.",
    studentName: "Jessica Taylor",
    studentRole: "Software Engineer",
    studentAvatar: "/testimonials/student4.jpg"
  }
];

export function LandingPage() {
  const { user } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get<Course[]>('/courses/featured');
        const data = response;
        
        console.log('API Response:', data); // Debug log
        
        // Ensure the response data is an array and has the expected shape
        if (!Array.isArray(data)) {
          console.error('Expected array of courses but got:', typeof data, data);
          setError('Failed to load content. Please try again later.');
          setFeaturedCourses([]);
          return;
        }

        // Validate each course object has required properties
        const validCourses = data.filter((course): course is Course => {
          const isValid = course &&
            typeof course === 'object' &&
            typeof course.id === 'string' &&
            typeof course.title === 'string' &&
            typeof course.description === 'string' &&
            typeof course.price === 'number' &&
            typeof course.thumbnail === 'string' &&
            typeof course.instructor === 'string' &&
            typeof course.enrolled === 'number';
            
          if (!isValid) {
            console.error('Invalid course object:', course);
          }
          return isValid;
        });
        
        setFeaturedCourses(validCourses);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error)) {
          console.error('Response:', error.response?.data);
          console.error('Status:', error.response?.status);
        }
        setError('Failed to load content. Please try again later.');
        setFeaturedCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderFeaturedCourses = () => {

    if (isLoading) {
      return Array(3).fill(null).map((_, i) => (
        <div key={i} className="bg-card rounded-xl shadow-lg overflow-hidden animate-pulse">
          <div className="w-full h-48 bg-muted" />
          <div className="p-6 space-y-4">
            <div className="h-6 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="flex justify-between items-center">
              <div className="h-6 bg-muted rounded w-20" />
              <div className="h-10 bg-muted rounded w-28" />
            </div>
          </div>
        </div>
      ));
    }

    if (!featuredCourses || featuredCourses.length === 0) {
      return (
        <div className="col-span-3 text-center py-8">
          <p className="text-muted-foreground">No featured courses available at the moment.</p>
        </div>
      );
    }

    return featuredCourses.map((course) => (
      <div
        key={course.id}
        className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
      >
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/course-placeholder.jpg';
          }}
        />
        <div className="p-6">
          <h4 className="text-xl font-semibold mb-2">{course.title}</h4>
          <p className="text-muted-foreground mb-2">
            {course.description}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            By {course.instructor} • {course.enrolled} students
          </p>
          <div className="flex justify-between items-center">
            <span className="text-primary font-semibold">
              ${course.price.toFixed(2)}
            </span>
            <Link to={`/courses/${course.id}`}>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </div>
    ));
  };

  const FeaturedCoursesSection = () => (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <h3 className="text-3xl font-bold text-center mb-16 text-foreground">
          Featured Courses
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {renderFeaturedCourses()}
        </div>
      </div>
    </section>
  );

  return (
    <div className="w-full min-h-screen bg-background">
      <header className="w-full min-h-[600px] bg-gradient-to-br from-primary to-primary-foreground text-white">
        <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Codespring</Link>
          <div className="hidden md:flex space-x-8">
            <Link to="/courses" className="hover:opacity-80">Courses</Link>
            <Link to="/about" className="hover:opacity-80">About</Link>
            <Link to="/instructors" className="hover:opacity-80">Instructors</Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/login">
              <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">
                Sign In
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90">
                Sign Up
              </button>
            </Link>
          </div>
        </nav>
        <div className="container mx-auto px-6 pt-20 pb-32">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-bold mb-6">
              Master Coding with Codespring
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Learn from expert instructors, build real projects, and join a
              community of passionate developers.
            </p>
            {user ? (
              <Link to={user.role === 'STUDENT' ? '/courses' : '/dashboard/instructor'}>
                <button className="px-8 py-4 bg-accent text-accent-foreground rounded-lg text-lg font-semibold hover:bg-accent/90 flex items-center gap-2">
                  {user.role === 'STUDENT' ? 'Browse Courses' : 'Go to Dashboard'} <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            ) : (
              <Link to="/signup">
                <button className="px-8 py-4 bg-accent text-accent-foreground rounded-lg text-lg font-semibold hover:bg-accent/90 flex items-center gap-2">
                  Get Started <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-16 text-foreground">
            Why Choose Codespring?
          </h3>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-4">Interactive Learning</h4>
              <p className="text-muted-foreground">
                Learn by doing with hands-on projects and real-world applications
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-4">Expert Instructors</h4>
              <p className="text-muted-foreground">
                Learn from industry professionals with years of experience
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-4">
                Collaborative Community
              </h4>
              <p className="text-muted-foreground">
                Connect with peers, share knowledge, and grow together
              </p>
            </div>
          </div>
        </div>
      </section>

      <FeaturedCoursesSection />

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-green-50/50 to-white dark:from-green-950/30 dark:to-gray-950">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-muted-foreground">
              Join thousands of satisfied students who have transformed their careers through our courses.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white dark:bg-gray-950 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-green-100 dark:border-green-900"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.studentAvatar}
                    alt={testimonial.studentName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-green-200 dark:border-green-800"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">{testimonial.studentName}</h4>
                    <p className="text-green-600 dark:text-green-400">{testimonial.studentRole}</p>
                  </div>
                </div>
                <blockquote className="relative">
                  <span className="absolute top-0 left-0 text-6xl text-green-200 dark:text-green-800/30">"</span>
                  <p className="text-muted-foreground relative z-10 pl-6 pt-4">
                    {testimonial.content}
                  </p>
                </blockquote>
                <div className="mt-6 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 fill-current text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-8 p-4 bg-green-50 dark:bg-green-950/50 rounded-2xl">
              <div className="flex -space-x-4">
                {TESTIMONIALS.map((testimonial) => (
                  <img
                    key={testimonial.id}
                    src={testimonial.studentAvatar}
                    alt=""
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-950"
                  />
                ))}
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 text-sm font-medium border-2 border-white dark:border-gray-950">
                  +2k
                </div>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                Join over 2,000 students already learning with us!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 