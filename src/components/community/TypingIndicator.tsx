import { useEffect, useState } from 'react';
import { wsClient } from '@/lib/websocket';

interface TypingIndicatorProps {
  groupId: string;
}

export function TypingIndicator({ groupId }: TypingIndicatorProps) {
  return (
    <div className="h-6 px-4">
      {/* Typing indicator implementation will be added with WebSocket */}
    </div>
  );
} 