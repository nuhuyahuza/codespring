import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CourseGrid } from '@/features/courses/components/CourseGrid';
import { useCourses } from '@/features/courses/hooks/useCourses';

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export function CoursesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const { courses, isLoading, error } = useCourses();

  const filteredCourses = courses?.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    
    const matchesDifficulty = difficulty === 'All' || course.difficulty === difficulty;

    return matchesSearch && matchesDifficulty;
  });

  const handleEnroll = (courseId: string) => {
    navigate(`/courses/${courseId}/enroll`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">⌛</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-destructive">Error loading courses</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Browse Courses</h1>
          <p className="text-muted-foreground">
            Discover our wide range of coding courses and start learning today
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-[300px]"
          />
          <Select
            value={difficulty}
            onValueChange={setDifficulty}
          >
            <SelectTrigger className="sm:max-w-[200px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredCourses?.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">No courses found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <CourseGrid
            courses={filteredCourses || []}
            onEnroll={handleEnroll}
          />
        )}
      </div>
    </div>
  );
} 