import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddLessonDialogProps {
  open: boolean;
  onClose: () => void;
  sectionId: string | null;
  onAdd: (data: {
    title: string;
    description: string;
    type: string;
    duration: number;
    isPreview: boolean;
  }) => void;
}

export function AddLessonDialog({ open, onClose, sectionId, onAdd }: AddLessonDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<string>('VIDEO');
  const [duration, setDuration] = useState<number>(0);
  const [isPreview, setIsPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ title, description, type, duration, isPreview });
    setTitle('');
    setDescription('');
    setType('VIDEO');
    setDuration(0);
    setIsPreview(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Lesson</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Lesson Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to React Hooks"
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Lesson Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select lesson type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIDEO">Video Lesson</SelectItem>
                <SelectItem value="READING">Reading Material</SelectItem>
                <SelectItem value="QUIZ">Quiz</SelectItem>
                <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                <SelectItem value="LIVE_SESSION">Live Session</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this lesson covers..."
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="0"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPreview"
              checked={isPreview}
              onChange={(e) => setIsPreview(e.target.checked)}
            />
            <Label htmlFor="isPreview">Make this a preview lesson</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Add Lesson
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 