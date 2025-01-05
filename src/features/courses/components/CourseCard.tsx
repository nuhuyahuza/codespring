import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    price: number;
    duration: number;
    difficulty: string;
    tags: string[];
    thumbnail: string | null;
    instructor: {
      name: string;
    };
  };
  onEnroll?: () => void;
}

export function CourseCard({ course, onEnroll }: CourseCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <div className="relative aspect-video">
        <img
          src={course.thumbnail || '/course-placeholder.jpg'}
          alt={course.title}
          className="object-cover w-full h-full rounded-t-lg"
        />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{course.title}</h3>
          <Badge variant={
            course.difficulty === 'Beginner' ? 'default' :
            course.difficulty === 'Intermediate' ? 'secondary' :
            'destructive'
          }>
            {course.difficulty}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">By {course.instructor.name}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {course.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <div className="flex items-center justify-between w-full">
          <div className="text-lg font-semibold">
            {formatCurrency(course.price)}
          </div>
          <Button onClick={onEnroll}>
            Enroll Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 