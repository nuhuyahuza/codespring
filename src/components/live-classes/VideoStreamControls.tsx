import { Settings, Users, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: 'instructor' | 'student';
  isSpeaking?: boolean;
  isVideoOn: boolean;
  isAudioOn: boolean;
}

interface VideoStreamControlsProps {
  participants: Participant[];
  currentQuality: string;
  onQualityChange: (quality: string) => void;
  onParticipantAction: (participantId: string, action: 'mute' | 'hide') => void;
}

export function VideoStreamControls({
  participants,
  currentQuality,
  onQualityChange,
  onParticipantAction,
}: VideoStreamControlsProps) {
  const qualities = ['1080p', '720p', '480p', '360p', 'Auto'];

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            {currentQuality}
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Quality Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {qualities.map((quality) => (
            <DropdownMenuItem
              key={quality}
              onClick={() => onQualityChange(quality)}
              className={currentQuality === quality ? 'bg-accent' : ''}
            >
              {quality}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary" size="sm">
            <Users className="h-4 w-4 mr-2" />
            {participants.length}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Participants ({participants.length})</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback>
                        {participant.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {participant.isSpeaking && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{participant.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {participant.role}
                      </Badge>
                    </div>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      {!participant.isAudioOn && <span>Muted</span>}
                      {!participant.isVideoOn && <span>Video Off</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onParticipantAction(participant.id, 'mute')}
                  >
                    {participant.isAudioOn ? 'Mute' : 'Unmute'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onParticipantAction(participant.id, 'hide')}
                  >
                    {participant.isVideoOn ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 