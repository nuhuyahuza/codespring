
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText } from "lucide-react";
import { toast } from "sonner";

interface CreateAssignmentModalProps {
  triggerContent?: React.ReactNode;
}

export const CreateAssignmentModal = ({ triggerContent }: CreateAssignmentModalProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Assignment created successfully!");
    const dialogCloseTrigger = document.getElementById("close-dialog-assignment");
    if (dialogCloseTrigger) {
      dialogCloseTrigger.click();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerContent ? (
          <Button>{triggerContent}</Button>
        ) : (
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
          <DialogDescription>
            Add a new assignment for students to complete
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Assignment Title</Label>
            <Input id="title" placeholder="e.g., Building a REST API" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="js">Advanced JavaScript Development</SelectItem>
                  <SelectItem value="react">React Fundamentals</SelectItem>
                  <SelectItem value="data">Data Science Bootcamp</SelectItem>
                  <SelectItem value="ui">UX/UI Design Principles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe the assignment requirements and objectives"
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments (Optional)</Label>
            <Input id="attachments" type="file" />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" id="close-dialog-assignment">
              Cancel
            </Button>
            <Button type="submit">Create Assignment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
