import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User } from 'lucide-react';

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
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
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

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">
            No upcoming sessions scheduled
          </p>
          <Link to="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{session.courseTitle}</span>
              {isToday(session.startTime) && (
                <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  Today
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2 md:grid-cols-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(session.startTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatTime(session.startTime)} ({session.duration} minutes)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{session.instructor}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link to={`/sessions/${session.id}`}>
                  <Button>Join Session</Button>
                </Link>
                <Link to={`/sessions/${session.id}/details`}>
                  <Button variant="outline">View Details</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 