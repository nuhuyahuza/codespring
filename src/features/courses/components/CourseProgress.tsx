import { Progress } from '@/components/ui/progress';

interface CourseProgressProps {
  progress: {
    completedLessons: string[];
    totalProgress: number;
  };
}

export function CourseProgress({ progress }: CourseProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Course Progress</span>
        <span className="font-medium">{Math.round(progress.totalProgress * 100)}%</span>
      </div>
      <Progress value={progress.totalProgress * 100} className="h-2" />
      <p className="text-xs text-muted-foreground">
        {progress.completedLessons.length} lessons completed
      </p>
    </div>
  );
} 