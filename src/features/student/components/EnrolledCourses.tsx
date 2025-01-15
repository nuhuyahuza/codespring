import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Course {
  id: string;
  title: string;
  thumbnail: string | null;
  progress: number;
  instructor: {
    name: string;
  };
  lastAccessedAt?: string;
}

interface EnrolledCoursesProps {
  courses: Course[] | undefined;
  showProgress?: boolean;
  showFilters?: boolean;
}

export function EnrolledCourses({ courses = [], showProgress = true, showFilters = true }: EnrolledCoursesProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  // Ensure courses is an array before mapping
  const coursesToDisplay = Array.isArray(courses) ? courses : [];

  const filteredCourses = coursesToDisplay.filter((course) => {
    if (filter === "in-progress") return course.progress < 100;
    if (filter === "completed") return course.progress === 100;
    return true;
  });

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex justify-end">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            )}
            <CardHeader>
              <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              <CardDescription>by {course.instructor.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {showProgress && (
                <div className="space-y-2">
                  <Progress value={course.progress} />
                  <p className="text-sm text-muted-foreground">
                    {course.progress}% complete
                  </p>
                </div>
              )}
              <Button
                onClick={() => navigate(`/courses/${course.id}/learn`)}
                className="w-full"
              >
                {course.progress === 0 ? "Start Course" : "Continue Learning"}
              </Button>
            </CardContent>
          </Card>
        ))}

        {filteredCourses.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No courses found.
          </div>
        )}
      </div>
    </div>
  );
} 