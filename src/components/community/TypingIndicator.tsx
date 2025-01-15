import { useEffect, useState } from 'react';
import { wsClient } from '@/lib/websocket';

interface TypingIndicatorProps {
  groupId: string;
}

export function TypingIndicator({ groupId }: TypingIndicatorProps) {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleTyping = (data: { userId: string; userName: string }) => {
      setTypingUsers(prev => {
        const next = new Set(prev);
        next.add(data.userName);
        return next;
      });

      // Clear after 3 seconds
      setTimeout(() => {
        setTypingUsers(prev => {
          const next = new Set(prev);
          next.delete(data.userName);
          return next;
        });
      }, 3000);
    };

    wsClient.subscribe('typing', handleTyping);

    return () => {
      wsClient.unsubscribe('typing', handleTyping);
    };
  }, []);

  if (typingUsers.size === 0) return null;

  const users = Array.from(typingUsers);
  return (
    <div className="text-sm text-muted-foreground animate-pulse">
      {users.length === 1
        ? `${users[0]} is typing...`
        : users.length === 2
        ? `${users[0]} and ${users[1]} are typing...`
        : `${users[0]} and ${users.length - 1} others are typing...`}
    </div>
  );
} 