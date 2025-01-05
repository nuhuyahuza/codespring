import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  progress: number;
  instructor?: string;
  category?: string;
  lastAccessedAt?: string;
}

interface EnrolledCoursesProps {
  courses: Course[];
  showProgress?: boolean;
  showFilters?: boolean;
}

export function EnrolledCourses({
  courses,
  showProgress = false,
  showFilters = false,
}: EnrolledCoursesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(courses.map((course) => course.category))];

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category?.charAt(0).toUpperCase() + category?.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <Link key={course.id} to={`/courses/${course.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                {course.instructor && (
                  <p className="text-sm text-muted-foreground">
                    by {course.instructor}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {showProgress && (
                  <div className="space-y-2">
                    <Progress value={course.progress} />
                    <p className="text-sm text-muted-foreground">
                      {course.progress}% complete
                    </p>
                    {course.lastAccessedAt && (
                      <p className="text-xs text-muted-foreground">
                        Last accessed:{' '}
                        {new Date(course.lastAccessedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No courses found</p>
        </div>
      )}
    </div>
  );
} 