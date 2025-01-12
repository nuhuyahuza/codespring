import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Users, Clock, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

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
}

const CATEGORIES = [
  'All Categories',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Cloud Computing',
  'DevOps',
  'Cybersecurity',
];

const SAMPLE_COURSES: Course[] = [
  {
    id: '1',
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
    instructor: 'John Doe',
    thumbnail: '/course-thumbnails/web-dev.jpg',
    rating: 4.8,
    students: 1234,
    duration: '12 weeks',
    price: 99.99,
    level: 'Beginner',
    category: 'Web Development',
  },
  {
    id: '2',
    title: 'Advanced React Development',
    description: 'Master React.js and build modern web applications.',
    instructor: 'Jane Smith',
    thumbnail: '/course-thumbnails/react.jpg',
    rating: 4.9,
    students: 2345,
    duration: '10 weeks',
    price: 129.99,
    level: 'Advanced',
    category: 'Web Development',
  },
  // Add more sample courses as needed
];

const TESTIMONIALS = [
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

export function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = SAMPLE_COURSES.filter((course) => {
    const matchesCategory = selectedCategory === 'All Categories' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-green-50/50 to-background/95 dark:from-background dark:via-green-950/10 dark:to-background/95">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-green-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
        <div className="container relative mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover Your Next Learning Adventure
            </h1>
            <p className="text-xl text-white/90">
              Choose from our wide range of courses designed to help you master new skills and advance your career. Learn at your own pace with expert instructors.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm border-y border-green-100 dark:border-green-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-green-200 dark:border-green-900 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm focus:bg-white dark:focus:bg-gray-950 transition-colors focus:border-green-500 dark:focus:border-green-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <select
                className="px-4 py-3 rounded-xl border border-green-200 dark:border-green-900 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-950 transition-colors focus:border-green-500 dark:focus:border-green-700"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="icon" className="rounded-xl border-green-200 dark:border-green-900 hover:bg-green-50 dark:hover:bg-green-900/50">
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gradient-to-b from-white/50 to-transparent dark:from-gray-950/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-green-600 dark:text-green-500" />
              Available Courses
            </h2>
            <Button variant="ghost" className="gap-2 text-green-700 dark:text-green-500 hover:text-green-800 dark:hover:text-green-400">
              View all categories <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group relative bg-white dark:bg-gray-950 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-100 dark:border-green-900"
              >
                <div className="aspect-video relative overflow-hidden bg-green-50 dark:bg-green-950">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/course-placeholder.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-2 right-2 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium border border-green-200 dark:border-green-800 shadow-sm">
                    {course.level}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500 mb-3">
                    <BookOpen className="h-4 w-4" />
                    {course.category}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-500 px-2 py-1 rounded-full">
                        <Star className="h-4 w-4" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{course.students}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{course.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-green-100 dark:border-green-900 flex items-center justify-between">
                    <div className="font-bold text-lg">
                      ${course.price}
                    </div>
                    <Button size="sm" className="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already learning and growing with our courses.
            Start your journey today!
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg text-lg font-semibold transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
} 