import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  Edit,
  Trash,
  Users,
  BookOpen,
  Clock,
  GraduationCap,
} from 'lucide-react';
import { Course } from '../types';
import { formatCurrency } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="aspect-video relative bg-gray-100">
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <BookOpen className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{course.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{course.duration} hours</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>{course.level}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Price</p>
            <p className="font-semibold">{formatCurrency(course.price)}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-sm text-gray-500">Students</p>
            <p className="font-semibold">{course._count.enrollments}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/instructor/courses/${course.id}/lessons`)}
            className="w-full"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Manage Lessons
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate(`/instructor/courses/${course.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Course
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/instructor/courses/${course.id}/students`)}
              >
                <Users className="h-4 w-4 mr-2" />
                View Students
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash className="h-4 w-4 mr-2" />
                Delete Course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
} 