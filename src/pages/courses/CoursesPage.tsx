import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Clock, BookOpen, Filter } from 'lucide-react';
import { Button } from '@/components/ui';
import { DEFAULT_COURSE_IMAGE } from '@/config/constants';
import { FilterModal } from '@/components/courses/FilterModal';
import { useAuth } from '@/hooks/useAuth';

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

const SAMPLE_COURSES: Course[] = [
  {
    id: '1',
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of web development with HTML, CSS, and JavaScript.',
    instructor: 'John Doe',
    thumbnail: '/course-thumbnails/web-dev.jpg',
    rating: 4.8,
    students: 1234,
    duration: '12 weeks',
    price: 99.99,
    level: 'Beginner',
    category: 'Web Development'
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
    category: 'Web Development'
  },
  {
    id: '3',
    title: 'Python for Data Science',
    description: 'Learn Python programming for data analysis and machine learning.',
    instructor: 'Mike Johnson',
    thumbnail: '/course-thumbnails/python.jpg',
    rating: 4.7,
    students: 3456,
    duration: '8 weeks',
    price: 79.99,
    level: 'Intermediate',
    category: 'Data Science'
  },
  {
    id: '4',
    title: 'Mobile App Development with Flutter',
    description: 'Build cross-platform mobile apps with Flutter and Dart.',
    instructor: 'Sarah Wilson',
    thumbnail: '/course-thumbnails/flutter.jpg',
    rating: 4.6,
    students: 1567,
    duration: '14 weeks',
    price: 149.99,
    level: 'Intermediate',
    category: 'Mobile Development'
  }
];

interface CourseCardProps {
  course: Course;
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <Link to={`/courses/${course.id}`} className="block group">
      <div className="bg-card rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-video relative overflow-hidden bg-muted">
          <img
            src={course.thumbnail || DEFAULT_COURSE_IMAGE}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_COURSE_IMAGE;
              target.onerror = null; // Prevent infinite loop if default image also fails
            }}
          />
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
            ${course.price}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span>{course.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.students} students</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">{course.level}</span>
            </div>
            <span className="text-sm text-muted-foreground">{course.category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Mobile Development', 'Cloud Computing'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export function CoursesPage() {
  const { user } = useAuth();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    level: 'All',
    type: 'All'
  });

  const filteredCourses = SAMPLE_COURSES.filter(course => {
    const matchesCategory = filters.category === 'All' || course.category === filters.category;
    const matchesLevel = filters.level === 'All' || course.level === filters.level;
    const matchesSearch = course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         course.description.toLowerCase().includes(filters.search.toLowerCase());
    // TODO: Add type filtering when backend supports it
    return matchesCategory && matchesLevel && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Explore Our Courses</h1>
          <p className="text-xl text-muted-foreground">
            Discover the perfect course to advance your skills and career
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter Courses
            </Button>
          </div>

          {/* Active Filters */}
          {(filters.category !== 'All' || filters.level !== 'All' || filters.type !== 'All' || filters.search) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.search && (
                <div className="bg-muted text-sm px-3 py-1 rounded-full flex items-center gap-2">
                  <span>Search: {filters.search}</span>
                  <button
                    onClick={() => setFilters(f => ({ ...f, search: '' }))}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              )}
              {filters.category !== 'All' && (
                <div className="bg-muted text-sm px-3 py-1 rounded-full flex items-center gap-2">
                  <span>Category: {filters.category}</span>
                  <button
                    onClick={() => setFilters(f => ({ ...f, category: 'All' }))}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              )}
              {filters.level !== 'All' && (
                <div className="bg-muted text-sm px-3 py-1 rounded-full flex items-center gap-2">
                  <span>Level: {filters.level}</span>
                  <button
                    onClick={() => setFilters(f => ({ ...f, level: 'All' }))}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              )}
              {filters.type !== 'All' && (
                <div className="bg-muted text-sm px-3 py-1 rounded-full flex items-center gap-2">
                  <span>Type: {filters.type}</span>
                  <button
                    onClick={() => setFilters(f => ({ ...f, type: 'All' }))}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({
                  search: '',
                  category: 'All',
                  level: 'All',
                  type: 'All'
                })}
                className="text-muted-foreground hover:text-destructive"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No courses found matching your criteria.</p>
          </div>
        )}

        {/* Filter Modal */}
        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filters={filters}
          onFilterChange={setFilters}
        />
      </div>
    </div>
  );
} 