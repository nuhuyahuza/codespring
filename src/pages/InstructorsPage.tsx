import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, BookOpen } from 'lucide-react';
import axios from 'axios';

interface Instructor {
  id: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
  expertise: string[];
  totalStudents: number;
  totalCourses: number;
  rating: number;
  courses: {
    id: string;
    title: string;
    students: number;
    rating: number;
  }[];
}

export function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/instructors`);
        setInstructors(response.data);
      } catch (error) {
        console.error('Error fetching instructors:', error);
        setError('Failed to load instructors. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  const renderInstructorSkeleton = () => (
    <div className="bg-card rounded-xl p-6 shadow-lg animate-pulse">
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 bg-muted rounded-full" />
        <div className="flex-1 space-y-4">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="h-20 bg-muted rounded" />
        <div className="h-20 bg-muted rounded" />
        <div className="h-20 bg-muted rounded" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-foreground text-white py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Learn from Industry Experts
            </h1>
            <p className="text-xl text-white/90">
              Our instructors are experienced professionals who bring real-world expertise to every lesson. Discover their courses and start learning today.
            </p>
          </div>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {error ? (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid gap-8">
              {isLoading
                ? Array(4).fill(null).map((_, i) => (
                    <div key={i}>{renderInstructorSkeleton()}</div>
                  ))
                : instructors.map((instructor) => (
                    <div
                      key={instructor.id}
                      className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-start gap-6">
                        <img
                          src={instructor.avatar}
                          alt={instructor.name}
                          className="w-24 h-24 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/avatar-placeholder.jpg';
                          }}
                        />
                        <div>
                          <h2 className="text-2xl font-bold mb-2">
                            {instructor.name}
                          </h2>
                          <p className="text-primary font-medium mb-4">
                            {instructor.role}
                          </p>
                          <p className="text-muted-foreground mb-4">
                            {instructor.bio}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {instructor.expertise.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="flex items-center gap-4 bg-muted p-4 rounded-lg">
                          <Users className="w-8 h-8 text-primary" />
                          <div>
                            <p className="text-2xl font-bold">
                              {instructor.totalStudents.toLocaleString()}
                            </p>
                            <p className="text-muted-foreground">Students</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 bg-muted p-4 rounded-lg">
                          <BookOpen className="w-8 h-8 text-primary" />
                          <div>
                            <p className="text-2xl font-bold">
                              {instructor.totalCourses}
                            </p>
                            <p className="text-muted-foreground">Courses</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 bg-muted p-4 rounded-lg">
                          <Star className="w-8 h-8 text-primary" />
                          <div>
                            <p className="text-2xl font-bold">
                              {instructor.rating.toFixed(1)}
                            </p>
                            <p className="text-muted-foreground">Rating</p>
                          </div>
                        </div>
                      </div>

                      {instructor.courses.length > 0 && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold mb-4">
                            Popular Courses
                          </h3>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {instructor.courses.map((course) => (
                              <Link
                                key={course.id}
                                to={`/courses/${course.id}`}
                                className="block p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                              >
                                <h4 className="font-medium mb-2">{course.title}</h4>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                  <span>{course.students} students</span>
                                  <span>★ {course.rating.toFixed(1)}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          )}
        </div>
      </section>

      {/* Become an Instructor */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Share Your Knowledge</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of expert instructors and help shape the next
            generation of developers. Start creating courses and reach students
            worldwide.
          </p>
          <Link
            to="/instructor/signup"
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90"
          >
            Become an Instructor
          </Link>
        </div>
      </section>
    </div>
  );
} 