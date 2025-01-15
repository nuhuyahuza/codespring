import { useState } from 'react';
import { VideoStream } from '@/components/live-classes/VideoStream';
import { LiveClassChat } from '@/components/live-classes/LiveClassChat';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

interface LiveClassViewProps {
  classId: string;
  isInstructor?: boolean;
}

export function LiveClassView({ classId, isInstructor = false }: LiveClassViewProps) {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={75}>
          <VideoStream
            roomId={classId}
            isInstructor={isInstructor}
            onStartRecording={() => setIsRecording(true)}
            onStopRecording={() => setIsRecording(false)}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25}>
          <LiveClassChat roomId={classId} isInstructor={isInstructor} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

const handleJoinClass = async (classId: string) => {
  try {
    const response = await api.post(`/student/live-classes/${classId}/join`);
    // Instead of opening in new window, show the video stream
    setSelectedClass(classId);
  } catch (error) {
    console.error('Error joining class:', error);
    toast.error('Failed to join class. Please try again.');
  }
}; 