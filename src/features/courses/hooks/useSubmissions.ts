import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Submission {
  id: string;
  courseId: string;
  lessonId: string;
  userId: string;
  content: string;
  attachments: Array<{
    name: string;
    url: string;
  }>;
  status: 'PENDING' | 'GRADED';
  score?: number;
  feedback?: string;
  submittedAt: string;
  gradedAt?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface GradingData {
  score: number;
  feedback: string;
}

async function submitAssignment(data: FormData) {
  const response = await fetch('/api/submissions', {
    method: 'POST',
    body: data,
  });

  if (!response.ok) {
    throw new Error('Failed to submit assignment');
  }

  return response.json();
}

async function fetchSubmission(submissionId: string) {
  const response = await fetch(`/api/submissions/${submissionId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch submission');
  }

  return response.json();
}

async function fetchLessonSubmissions(lessonId: string) {
  const response = await fetch(`/api/lessons/${lessonId}/submissions`);

  if (!response.ok) {
    throw new Error('Failed to fetch submissions');
  }

  return response.json();
}

async function gradeSubmission(submissionId: string, data: GradingData) {
  const response = await fetch(`/api/submissions/${submissionId}/grade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to grade submission');
  }

  return response.json();
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitAssignment,
    onSuccess: () => {
      toast.success('Assignment submitted successfully');
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
    onError: () => {
      toast.error('Failed to submit assignment');
    },
  });
}

export function useSubmission(submissionId: string) {
  return useQuery({
    queryKey: ['submissions', submissionId],
    queryFn: () => fetchSubmission(submissionId),
    enabled: !!submissionId,
  });
}

export function useLessonSubmissions(lessonId: string) {
  return useQuery({
    queryKey: ['submissions', 'lesson', lessonId],
    queryFn: () => fetchLessonSubmissions(lessonId),
    enabled: !!lessonId,
  });
}

export function useGradeSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ submissionId, data }: { submissionId: string; data: GradingData }) =>
      gradeSubmission(submissionId, data),
    onSuccess: (_, { submissionId }) => {
      toast.success('Submission graded successfully');
      queryClient.invalidateQueries({ queryKey: ['submissions', submissionId] });
      queryClient.invalidateQueries({ queryKey: ['submissions', 'lesson'] });
    },
    onError: () => {
      toast.error('Failed to grade submission');
    },
  });
} 