import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const gradingSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string().min(1, 'Feedback is required'),
});

type GradingFormValues = z.infer<typeof gradingSchema>;

interface Submission {
  id: string;
  studentName: string;
  submittedAt: string;
  content: string;
  attachments: Array<{
    name: string;
    url: string;
  }>;
  status: 'PENDING' | 'GRADED';
  score?: number;
  feedback?: string;
}

interface SubmissionGradingProps {
  submission: Submission;
  onGrade: (submissionId: string, data: GradingFormValues) => Promise<void>;
}

export function SubmissionGrading({
  submission,
  onGrade,
}: SubmissionGradingProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GradingFormValues>({
    resolver: zodResolver(gradingSchema),
    defaultValues: {
      score: submission.score || 0,
      feedback: submission.feedback || '',
    },
  });

  const handleSubmit = async (values: GradingFormValues) => {
    try {
      setIsSubmitting(true);
      await onGrade(submission.id, values);
      toast.success('Submission graded successfully');
    } catch (error) {
      toast.error('Failed to grade submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Submission</CardTitle>
        <div className="flex flex-col space-y-1">
          <p className="text-sm text-muted-foreground">
            Student: {submission.studentName}
          </p>
          <p className="text-sm text-muted-foreground">
            Submitted: {new Date(submission.submittedAt).toLocaleString()}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Student's submission content */}
          <div className="space-y-2">
            <Label>Submission Content</Label>
            <div className="rounded-lg border bg-muted p-4">
              <p className="whitespace-pre-wrap">{submission.content}</p>
            </div>
          </div>

          {/* Attachments */}
          {submission.attachments.length > 0 && (
            <div className="space-y-2">
              <Label>Attachments</Label>
              <ul className="space-y-2">
                {submission.attachments.map((attachment, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between rounded border bg-muted p-2"
                  >
                    <span className="text-sm">{attachment.name}</span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a href={attachment.url} download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Grading form */}
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="score">Score (0-100)</Label>
              <Input
                id="score"
                type="number"
                min={0}
                max={100}
                {...form.register('score', { valueAsNumber: true })}
              />
              {form.formState.errors.score && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.score.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                {...form.register('feedback')}
                rows={4}
                placeholder="Provide feedback on the submission..."
              />
              {form.formState.errors.feedback && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.feedback.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Grade
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
} 