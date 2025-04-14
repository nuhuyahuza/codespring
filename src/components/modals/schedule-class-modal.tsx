
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
import { Plus, Video } from "lucide-react";
import { toast } from "sonner";

interface ScheduleClassModalProps {
  triggerContent?: React.ReactNode;
}

export const ScheduleClassModal = ({ triggerContent }: ScheduleClassModalProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Live class scheduled successfully!");
    const dialogCloseTrigger = document.getElementById("close-dialog-class");
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
            <Video className="h-4 w-4 mr-2" />
            Schedule Class
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Schedule Live Class</DialogTitle>
          <DialogDescription>
            Set up a new live session for your students
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Session Title</Label>
            <Input id="title" placeholder="e.g., React Hooks Deep Dive" required />
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
              <Label htmlFor="instructor">Instructor</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emma">Emma Wilson</SelectItem>
                  <SelectItem value="michael">Michael Johnson</SelectItem>
                  <SelectItem value="sarah">Sarah Davis</SelectItem>
                  <SelectItem value="james">James Thompson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (hours)</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="1.5">1.5 hours</SelectItem>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="2.5">2.5 hours</SelectItem>
                <SelectItem value="3">3 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Provide details about what will be covered in this session"
              rows={3}
              required
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" id="close-dialog-class">
              Cancel
            </Button>
            <Button type="submit">Schedule Class</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
