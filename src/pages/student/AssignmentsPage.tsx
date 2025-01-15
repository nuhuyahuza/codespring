import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Upload,
  Download,
  Eye,
  Loader2
} from 'lucide-react';
import { api } from '@/lib/api';
import { StudentDashboardLayout } from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Assignment } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  submitted: 'bg-blue-100 text-blue-800',
  graded: 'bg-green-100 text-green-800',
};

export function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: assignments, isLoading, refetch } = useQuery<Assignment[]>({
    queryKey: ['assignments'],
    queryFn: async () => {
      const response = await api.get('/student/assignments');
      return response.data;
    },
  });

  const filteredAssignments = assignments?.filter(assignment => 
    activeTab === 'all' ? true : assignment.status === activeTab
  );

  const handleFileUpload = async (assignmentId: string, file: File, notes?: string) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('file', file);
      if (notes) {
        formData.append('notes', notes);
      }

      await api.uploadFile(`/student/assignments/${assignmentId}/submit`, formData, token);
      
      toast.success('Assignment submitted successfully!');
      // Refetch assignments to update the list
      refetch();
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Failed to submit assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <StudentDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </StudentDashboardLayout>
    );
  }

  return (
    <StudentDashboardLayout>
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Assignments</h1>
        </div>

        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="graded">Graded</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {filteredAssignments?.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{assignment.title}</h3>
                      <Badge 
                        variant="secondary"
                        className={statusColors[assignment.status]}
                      >
                        {assignment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {assignment.courseName}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      Due: {format(parseISO(assignment.dueDate), 'PPp')}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {/* View Assignment Details */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{assignment.title}</DialogTitle>
                          <DialogDescription>
                            Course: {assignment.courseName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Description</h4>
                            <p className="text-sm text-muted-foreground">
                              {assignment.description}
                            </p>
                          </div>
                          {assignment.status === 'graded' && (
                            <div>
                              <h4 className="font-medium mb-2">Feedback</h4>
                              <p className="text-sm text-muted-foreground">
                                {assignment.feedback}
                              </p>
                              <div className="mt-2">
                                <span className="font-medium">Grade: </span>
                                <span>{assignment.grade}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Submit Assignment */}
                    {assignment.status === 'pending' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Submit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Submit Assignment</DialogTitle>
                            <DialogDescription>
                              Upload your completed assignment here
                            </DialogDescription>
                          </DialogHeader>
                          <form className="space-y-4">
                            <div>
                              <Label htmlFor="file">Assignment File</Label>
                              <Input
                                id="file"
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(assignment.id, file);
                                  }
                                }}
                              />
                            </div>
                            <div>
                              <Label htmlFor="notes">Additional Notes</Label>
                              <Textarea
                                id="notes"
                                placeholder="Any comments for your instructor..."
                              />
                            </div>
                            <Button 
                              type="submit" 
                              disabled={isSubmitting}
                              className="w-full"
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                'Submit Assignment'
                              )}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}

                    {/* Download Submitted Assignment */}
                    {assignment.status !== 'pending' && assignment.submissionUrl && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(assignment.submissionUrl, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredAssignments?.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No {activeTab === 'all' ? '' : activeTab} assignments found.
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </StudentDashboardLayout>
  );
} 