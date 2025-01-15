import { useState } from 'react';
import { MessageSquare, Smile, MoreVertical } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';
import { ThreadView } from './ThreadView';

interface ChatMessageProps {
  message: Message;
  onReact: (messageId: string, emoji: string) => void;
  onReply: (messageId: string, content: string) => void;
}

export function ChatMessage({ message, onReact, onReply }: ChatMessageProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showThread, setShowThread] = useState(false);

  return (
    <div className="group relative">
      {/* Existing message content */}
      
      {/* Reaction buttons */}
      <div className="absolute right-0 top-0 hidden group-hover:flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowEmojiPicker(true)}
        >
          <Smile className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowThread(true)}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>

      {/* Reactions display */}
      {message.reactions?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {Object.entries(
            message.reactions.reduce((acc, reaction) => {
              acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([emoji, count]) => (
            <Badge
              key={emoji}
              variant="secondary"
              className="text-xs cursor-pointer hover:bg-accent"
              onClick={() => onReact(message.id, emoji)}
            >
              {emoji} {count}
            </Badge>
          ))}
        </div>
      )}

      {/* Thread count */}
      {message.threadCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs mt-1"
          onClick={() => setShowThread(true)}
        >
          {message.threadCount} replies
        </Button>
      )}

      {/* Emoji picker */}
      <EmojiPicker
        open={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onSelect={(emoji) => {
          onReact(message.id, emoji);
          setShowEmojiPicker(false);
        }}
      />

      {/* Thread view */}
      <ThreadView
        open={showThread}
        onClose={() => setShowThread(false)}
        messageId={message.id}
        onReply={onReply}
      />
    </div>
  );
} 