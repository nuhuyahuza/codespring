import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Send, Loader2, MoreVertical, FileIcon, Download } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { wsClient } from '@/lib/websocket';
import { FilePreview } from './FilePreview';
import { TypingIndicator } from './TypingIndicator';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

interface GroupDiscussionsProps {
  groupId: string;
}

export function GroupDiscussions({ groupId }: GroupDiscussionsProps) {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();

  const { data: messages, isLoading, refetch } = useQuery<Message[]>({
    queryKey: ['groupMessages', groupId],
    queryFn: async () => {
      const response = await api.get(`/student/community-groups/${groupId}/discussions`);
      return response.data;
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    wsClient.joinGroup(groupId);

    const handleNewMessage = (message: Message) => {
      refetch();
    };

    wsClient.subscribe('new_message', handleNewMessage);

    return () => {
      wsClient.leaveGroup(groupId);
      wsClient.unsubscribe('new_message', handleNewMessage);
    };
  }, [groupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setIsSubmitting(true);
      const message = await api.post(`/student/community-groups/${groupId}/messages`, {
        content: newMessage,
      });

      wsClient.send({
        type: 'new_message',
        groupId,
        data: message.data,
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('file', file);

      await api.uploadFile(
        `/student/community-groups/${groupId}/messages/file`,
        formData,
        token,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!
            );
            setUploadProgress(progress);
          },
        }
      );

      toast.success('File uploaded successfully!');
      refetch();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  function MessageModeration({ message }: { message: Message }) {
    const handleModerate = async (action: string) => {
      try {
        await api.put(`/student/community-groups/${groupId}/messages/${message.id}/moderate`, {
          action,
        });
        refetch();
        toast.success('Message moderated successfully');
      } catch (error) {
        console.error('Error moderating message:', error);
        toast.error('Failed to moderate message');
      }
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleModerate('delete')}>
            Delete Message
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleModerate('warn')}>
            Warn User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  function FilePreview({ file }: { file: { url: string; name: string; type: string } }) {
    return (
      <div className="flex items-center gap-2 p-2 bg-muted rounded">
        <FileIcon className="h-4 w-4" />
        <span className="text-sm truncate">{file.name}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(file.url, '_blank')}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const handleTyping = () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    wsClient.send({
      type: 'typing',
      groupId,
      data: {
        userId: user!.id,
        userName: user!.name,
      },
    });

    setTypingTimeout(
      setTimeout(() => {
        setTypingTimeout(undefined);
      }, 3000)
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col h-full"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.user.id === user?.id ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.user.id === user?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm font-medium">{message.user.name}</p>
              <p className="mt-1">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {format(new Date(message.createdAt), 'PPp')}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <TypingIndicator groupId={groupId} />

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleTyping}
            placeholder="Type your message..."
            disabled={isSubmitting}
          />
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isSubmitting}
          >
            <FileIcon className="h-4 w-4" />
          </Button>
          <Button type="submit" disabled={isSubmitting || !newMessage.trim()}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        {uploadProgress > 0 && (
          <Progress value={uploadProgress} className="mt-2" />
        )}
      </form>
    </div>
  );
} 