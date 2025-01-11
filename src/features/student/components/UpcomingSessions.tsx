import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/utils";
import { Calendar, Video, ExternalLink } from "lucide-react";

interface Session {
  id: string;
  courseTitle: string;
  startTime: string;
  duration: number;
  instructor: string;
}

interface UpcomingSessionsProps {
  sessions: Session[];
}

export function UpcomingSessions({ sessions }: UpcomingSessionsProps) {
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const isToday = (date: string) => {
    const today = new Date();
    const sessionDate = new Date(date);
    return (
      today.getDate() === sessionDate.getDate() &&
      today.getMonth() === sessionDate.getMonth() &&
      today.getFullYear() === sessionDate.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Upcoming Live Sessions
          </h2>
          <p className="text-muted-foreground">
            Join interactive live sessions with instructors
          </p>
        </div>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="grid gap-4">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <CardTitle className="line-clamp-1">{session.courseTitle}</CardTitle>
              <CardDescription>with {session.instructor}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {isToday(session.startTime)
                        ? "Today"
                        : formatDate(session.startTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {formatTime(session.startTime)} (
                      {formatDuration(session.duration)})
                    </span>
                  </div>
                </div>
                <Button className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Join Session
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {sessions.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Upcoming Sessions</h3>
            <p className="text-muted-foreground">
              Check back later for new sessions
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 