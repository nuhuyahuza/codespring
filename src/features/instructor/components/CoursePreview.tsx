import { Course } from '@/types/course';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Clock, GraduationCap, BarChart } from 'lucide-react';

interface CoursePreviewProps {
  course: Course;
}

export function CoursePreview({ course }: CoursePreviewProps) {
  const totalLessons = course.sections.reduce(
    (acc, section) => acc + section.lessons.length,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Course Preview</h2>
        <p className="text-muted-foreground">
          Preview how your course will appear to students.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{course.title}</CardTitle>
                <p className="mt-2 text-muted-foreground">{course.description}</p>
              </div>
              <Badge variant="secondary">{course.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{course.duration} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>{course.level.toLowerCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart className="h-4 w-4 text-muted-foreground" />
                <span>{totalLessons} lessons</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {course.sections.map((section) => (
                <div key={section.id} className="space-y-2">
                  <h3 className="font-semibold">{section.title}</h3>
                  <ul className="space-y-1">
                    {section.lessons.map((lesson) => (
                      <li
                        key={lesson.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{lesson.title}</span>
                        <Badge variant="outline">{lesson.type}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Price</h3>
                <p className="text-2xl font-bold">
                  {formatCurrency(course.price)}
                </p>
              </div>

              <div>
                <h3 className="font-semibold">What You'll Learn</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  {course.sections.map((section) => (
                    <li key={section.id}>{section.title}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">Requirements</h3>
                <p className="text-sm text-muted-foreground">
                  {course.level === 'BEGINNER'
                    ? 'No prior knowledge required'
                    : course.level === 'INTERMEDIATE'
                    ? 'Basic understanding of the subject'
                    : 'Advanced understanding of the subject'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 