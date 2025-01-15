import { useState } from 'react';
import { ChartBar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollProps {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVote?: string;
  onVote: (pollId: string, optionId: string) => void;
  onClose: (pollId: string) => void;
}

export function ChatPoll({
  id,
  question,
  options,
  totalVotes,
  userVote,
  onVote,
  onClose,
}: PollProps) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    userVote
  );

  const handleVote = () => {
    if (selectedOption && !userVote) {
      onVote(id, selectedOption);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-medium">{question}</h4>
          <p className="text-sm text-muted-foreground">
            {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
          </p>
        </div>
        <ChartBar className="h-5 w-5" />
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const percentage = totalVotes > 0 
            ? Math.round((option.votes / totalVotes) * 100) 
            : 0;

          return (
            <div
              key={option.id}
              className={`relative ${
                !userVote ? 'cursor-pointer hover:bg-accent' : ''
              } rounded-lg p-2`}
              onClick={() => !userVote && setSelectedOption(option.id)}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{option.text}</span>
                <span className="text-sm">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2" />
              {selectedOption === option.id && (
                <Check className="absolute right-2 top-2 h-4 w-4 text-primary" />
              )}
            </div>
          );
        })}
      </div>

      {!userVote && (
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onClose(id)}>
            Cancel
          </Button>
          <Button
            disabled={!selectedOption}
            onClick={handleVote}
          >
            Vote
          </Button>
        </div>
      )}
    </Card>
  );
} 