import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MoreVertical,
  Plus,
  Edit,
  Trash,
  Users,
  BookOpen,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  level: string;
  duration: number;
  imageUrl: string | null;
  _count: {
    enrollments: number;
    lessons: number;
  };
  updatedAt: string;
}

export function CourseManagement() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ['instructor-courses'],
    queryFn: () => api.get('/courses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  });

  const filteredCourses = courses?.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <Button 
          onClick={() => navigate('/instructor/courses/create')}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px]"
          />
        </div>
      </div>

      {/* Course Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-center">Students</TableHead>
              <TableHead className="text-center">Lessons</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredCourses?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No courses found
                </TableCell>
              </TableRow>
            ) : (
              filteredCourses?.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>{course.level}</TableCell>
                  <TableCell>{formatCurrency(course.price)}</TableCell>
                  <TableCell className="text-center">
                    {course._count.enrollments}
                  </TableCell>
                  <TableCell className="text-center">
                    {course._count.lessons}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
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
                          onClick={() => navigate(`/instructor/courses/${course.id}/lessons`)}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Manage Lessons
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 