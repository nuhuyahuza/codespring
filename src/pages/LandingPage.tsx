import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/courses/course-card';
import { useQuery } from '@tanstack/react-query';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  instructor: {
    name: string;
  };
}

export function LandingPage() {
  const { data: courses } = useQuery<Course[]>({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/courses?featured=true');
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-900 py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/50" />
        <div className="absolute inset-0">
          <img
            src="/hero-background.jpg"
            alt="Students learning"
            className="h-full w-full object-cover opacity-30"
          />
        </div>
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
              Transform Your Future with CodeSpring
            </h1>
            <p className="mt-6 text-xl text-gray-300">
              Master the latest technologies with expert-led courses. Join thousands of students learning to code and advancing their careers.
            </p>
            <div className="mt-10 flex gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                asChild
              >
                <Link to="/courses">Explore Courses</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/10"
                asChild
              >
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured Courses
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start your learning journey with our most popular courses
            </p>
          </motion.div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {courses?.slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Become an Instructor Section */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Come teach with us
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Become an instructor and change lives — including your own. Share your knowledge and experience with students worldwide.
              </p>
              <div className="mt-8">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <Link to="/instructor/signup">Start Teaching</Link>
                </Button>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">45K+</h3>
                  <p className="text-muted-foreground">Active students</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">200+</h3>
                  <p className="text-muted-foreground">Courses</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">12M+</h3>
                  <p className="text-muted-foreground">Revenue generated</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="relative"
            >
              <img
                src="/instructor.jpg"
                alt="Become an instructor"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why choose CodeSpring?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We provide the tools and skills you need to succeed in today's tech world
            </p>
          </motion.div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-center"
            >
              <div className="mx-auto h-12 w-12 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-foreground">Expert Instructors</h3>
              <p className="mt-2 text-muted-foreground">Learn from industry professionals with real-world experience</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-center"
            >
              <div className="mx-auto h-12 w-12 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-foreground">Comprehensive Curriculum</h3>
              <p className="mt-2 text-muted-foreground">Well-structured courses covering both basics and advanced topics</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-center"
            >
              <div className="mx-auto h-12 w-12 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-foreground">Community Support</h3>
              <p className="mt-2 text-muted-foreground">Connect with fellow learners and get help when you need it</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
} 