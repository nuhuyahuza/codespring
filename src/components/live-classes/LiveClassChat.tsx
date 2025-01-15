import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/features/auth';
import { wsClient } from '@/lib/websocket';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  type: 'text' | 'file';
  fileUrl?: string;
  fileName?: string;
}

interface LiveClassChatProps {
  roomId: string;
  isInstructor?: boolean;
}

export function LiveClassChat({ roomId, isInstructor }: LiveClassChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial messages
    loadMessages();

    // Subscribe to new messages
    wsClient.subscribe('chat_message', handleNewMessage);

    return () => {
      wsClient.unsubscribe('chat_message', handleNewMessage);
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await api.get(`/student/live-classes/${roomId}/chat`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load chat messages');
    }
  };

  const handleNewMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await api.post(`/student/live-classes/${roomId}/chat`, {
        content: newMessage,
        type: 'text',
      });

      wsClient.send({
        type: 'chat_message',
        roomId,
        data: response.data,
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.uploadFile(
        `/student/live-classes/${roomId}/chat/file`,
        formData,
        token
      );

      wsClient.send({
        type: 'chat_message',
        roomId,
        data: response.data,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full border-l">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Live Chat</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender.id === user?.id ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar>
                <AvatarImage src={message.sender.avatar} />
                <AvatarFallback>
                  {message.sender.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex flex-col ${
                  message.sender.id === user?.id ? 'items-end' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {message.sender.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(message.timestamp), 'p')}
                  </span>
                </div>
                {message.type === 'text' ? (
                  <div className="mt-1 rounded-lg bg-muted p-3">
                    {message.content}
                  </div>
                ) : (
                  <a
                    href={message.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-2 rounded-lg bg-muted p-3 hover:bg-muted/80"
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="text-sm">{message.fileName}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isSubmitting}
          />
          <input
            type="file"
            id="chat-file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => document.getElementById('chat-file')?.click()}
            disabled={isSubmitting}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button type="submit" disabled={isSubmitting || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
} 