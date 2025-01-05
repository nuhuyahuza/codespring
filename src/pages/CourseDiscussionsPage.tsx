import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { GroupManagement } from '@/features/chat/components/GroupManagement';
import { GroupChat } from '@/features/chat/components/GroupChat';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function CourseDiscussionsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const handleJoinGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  const handleLeaveChat = () => {
    setSelectedGroupId(null);
  };

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="space-y-8">
          {selectedGroupId ? (
            <div className="space-y-4">
              <Button
                variant="ghost"
                className="pl-0"
                onClick={handleLeaveChat}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Groups
              </Button>
              <GroupChat
                courseId={courseId!}
                groupId={selectedGroupId}
              />
            </div>
          ) : (
            <GroupManagement
              courseId={courseId!}
              onJoinGroup={handleJoinGroup}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 