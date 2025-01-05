import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  Flag,
} from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
  submittedAt: string;
  price: number;
  reportCount: number;
  rating: number;
  enrollments: number;
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    instructor: 'Jane Smith',
    category: 'Programming',
    status: 'PENDING',
    submittedAt: '2023-07-01T10:00:00Z',
    price: 49.99,
    reportCount: 0,
    rating: 0,
    enrollments: 0,
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    instructor: 'John Doe',
    category: 'Programming',
    status: 'APPROVED',
    submittedAt: '2023-06-28T15:30:00Z',
    price: 79.99,
    reportCount: 2,
    rating: 4.5,
    enrollments: 150,
  },
  {
    id: '3',
    title: 'Digital Marketing Fundamentals',
    instructor: 'Alice Johnson',
    category: 'Marketing',
    status: 'FLAGGED',
    submittedAt: '2023-06-25T09:15:00Z',
    price: 59.99,
    reportCount: 5,
    rating: 3.8,
    enrollments: 75,
  },
];

export function CourseModeration() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState('');

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || course.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateCourseStatus = async (
    courseId: string,
    status: Course['status'],
    note?: string
  ) => {
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId ? { ...course, status } : course
        )
      );
      toast.success(`Course ${status.toLowerCase()} successfully`);
      setIsReviewDialogOpen(false);
      setReviewNote('');
    } catch (error) {
      toast.error('Failed to update course status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Course Moderation</h2>
        <p className="text-muted-foreground">
          Review and manage course submissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Review Queue</CardTitle>
          <CardDescription>Review and moderate course submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={selectedStatus || ''}
              onValueChange={(value) => setSelectedStatus(value || null)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="FLAGGED">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.status === 'APPROVED'
                          ? 'success'
                          : course.status === 'REJECTED'
                          ? 'destructive'
                          : course.status === 'FLAGGED'
                          ? 'warning'
                          : 'secondary'
                      }
                    >
                      {course.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {course.reportCount > 0 && (
                      <Badge variant="warning">{course.reportCount}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedCourse(course);
                          setIsReviewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {course.status === 'PENDING' && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleUpdateCourseStatus(course.id, 'APPROVED')
                            }
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleUpdateCourseStatus(course.id, 'REJECTED')
                            }
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                      {course.status !== 'FLAGGED' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleUpdateCourseStatus(course.id, 'FLAGGED')
                          }
                        >
                          <Flag className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review Course</DialogTitle>
            <DialogDescription>
              Review course details and make a decision
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="grid gap-6">
              <div className="grid gap-4">
                <div>
                  <Label className="text-base font-semibold">
                    {selectedCourse.title}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    by {selectedCourse.instructor}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Category</Label>
                    <p className="text-sm">{selectedCourse.category}</p>
                  </div>
                  <div>
                    <Label>Price</Label>
                    <p className="text-sm">
                      ${selectedCourse.price.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label>Submitted</Label>
                    <p className="text-sm">
                      {new Date(
                        selectedCourse.submittedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedCourse.reportCount > 0 && (
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <Label className="text-yellow-700">
                        {selectedCourse.reportCount} reports received
                      </Label>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Review Note</Label>
                  <Textarea
                    placeholder="Add a note about your decision..."
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsReviewDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() =>
                    handleUpdateCourseStatus(
                      selectedCourse.id,
                      'REJECTED',
                      reviewNote
                    )
                  }
                >
                  Reject
                </Button>
                <Button
                  onClick={() =>
                    handleUpdateCourseStatus(
                      selectedCourse.id,
                      'APPROVED',
                      reviewNote
                    )
                  }
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 