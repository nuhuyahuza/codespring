import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Eye } from 'lucide-react';
import { useLessonSubmissions } from '../hooks/useSubmissions';
import { SubmissionGrading } from '@/features/instructor/components/SubmissionGrading';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useGradeSubmission } from '../hooks/useSubmissions';

interface LessonSubmissionsProps {
  lessonId: string;
}

export function LessonSubmissions({ lessonId }: LessonSubmissionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const { data: submissions, isLoading } = useLessonSubmissions(lessonId);
  const { mutate: gradeSubmission } = useGradeSubmission();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin">⌛</div>
      </div>
    );
  }

  const filteredSubmissions = submissions?.filter((submission) =>
    submission.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGradeSubmission = async (submissionId: string, data: { score: number; feedback: string }) => {
    await gradeSubmission({ submissionId, data });
    setSelectedSubmission(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions?.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {submission.user.firstName} {submission.user.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {submission.user.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(submission.submittedAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={submission.status === 'GRADED' ? 'success' : 'secondary'}
                  >
                    {submission.status.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  {submission.score !== null ? `${submission.score}%` : '-'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedSubmission(submission.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog
          open={!!selectedSubmission}
          onOpenChange={(open) => !open && setSelectedSubmission(null)}
        >
          <DialogContent className="max-w-4xl">
            {selectedSubmission && (
              <SubmissionGrading
                submission={
                  submissions?.find((s) => s.id === selectedSubmission)!
                }
                onGrade={handleGradeSubmission}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
} 