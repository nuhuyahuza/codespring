import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

const submissionSchema = z.object({
  content: z.string().min(1, 'Submission content is required'),
  attachments: z.array(z.instanceof(File)).optional(),
});

type SubmissionFormValues = z.infer<typeof submissionSchema>;

interface AssignmentSubmissionProps {
  courseId: string;
  lessonId: string;
  assignmentTitle: string;
  dueDate?: string;
  onSubmit: (data: FormData) => Promise<void>;
}

export function AssignmentSubmission({
  courseId,
  lessonId,
  assignmentTitle,
  dueDate,
  onSubmit,
}: AssignmentSubmissionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      content: '',
      attachments: [],
    },
  });

  const handleSubmit = async (values: SubmissionFormValues) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('courseId', courseId);
      formData.append('lessonId', lessonId);
      formData.append('content', values.content);
      
      selectedFiles.forEach((file) => {
        formData.append('attachments', file);
      });

      await onSubmit(formData);
      toast.success('Assignment submitted successfully');
      form.reset();
      setSelectedFiles([]);
    } catch (error) {
      toast.error('Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{assignmentTitle}</CardTitle>
        {dueDate && (
          <p className="text-sm text-muted-foreground">
            Due: {new Date(dueDate).toLocaleDateString()}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content">Your Submission</Label>
            <Textarea
              id="content"
              {...form.register('content')}
              rows={8}
              placeholder="Enter your submission content..."
            />
            {form.formState.errors.content && (
              <p className="text-sm text-destructive">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments</Label>
            <div className="flex items-center gap-2">
              <Input
                id="attachments"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('attachments')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Add Files
              </Button>
            </div>
            {selectedFiles.length > 0 && (
              <ul className="mt-2 space-y-2">
                {selectedFiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-sm bg-muted p-2 rounded"
                  >
                    <span>{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Assignment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 