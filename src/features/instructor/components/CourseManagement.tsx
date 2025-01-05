import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { Star, Edit, Archive } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  price: number;
  enrollmentCount: number;
  rating: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  lastUpdated: string;
}

interface CourseManagementProps {
  courses: Course[];
}

export function CourseManagement({ courses }: CourseManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || course.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'all' || course.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = ['all', ...new Set(courses.map((course) => course.category))];
  const statuses = ['all', 'DRAFT', 'PUBLISHED', 'ARCHIVED'];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Your Courses</h2>
        <Link to="/instructor/courses/new">
          <Button>Create New Course</Button>
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Enrollments</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <span className="font-medium">{course.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>{formatCurrency(course.price)}</TableCell>
                  <TableCell>{course.enrollmentCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        course.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-800'
                          : course.status === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {course.status.toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(course.lastUpdated)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link to={`/instructor/courses/${course.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          // Handle archive
                        }}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 