import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
  };
}

interface GroupDiscussionsProps {
  groupId: string;
}

export function GroupDiscussions({ groupId }: GroupDiscussionsProps) {
  const { token } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ['messages', groupId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5000/api/groups/${groupId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-4">
      {messages?.map((message) => (
        <div key={message.id} className="flex items-start gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-emerald-100 text-emerald-700">
              {message.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-emerald-700">
                {message.user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(message.createdAt), 'p')}
              </span>
            </div>
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
} 