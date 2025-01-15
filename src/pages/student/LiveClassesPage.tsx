import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar, Video, Users, Clock } from 'lucide-react';
import { StudentDashboardLayout } from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LiveClass {
  id: string;
  title: string;
  description: string;
  startTime: string;
  duration: number;
  instructorName: string;
  courseTitle: string;
  attendees: number;
  status: 'upcoming' | 'live' | 'completed';
  joinUrl?: string;
  recordingUrl?: string;
}

export function LiveClassesPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'completed'>('live');

  const { data: classes, isLoading } = useQuery<LiveClass[]>({
    queryKey: ['liveClasses', activeTab],
    queryFn: async () => {
      const response = await api.get(`/student/live-classes?status=${activeTab}`);
      return response.data;
    },
  });

  const handleJoinClass = async (classId: string) => {
    try {
      const response = await api.post(`/student/live-classes/${classId}/join`);
      window.open(response.data.joinUrl, '_blank');
    } catch (error) {
      console.error('Error joining class:', error);
      toast.error('Failed to join class. Please try again.');
    }
  };

  return (
    <StudentDashboardLayout>
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Live Classes</h1>
        </div>

        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
          <TabsList>
            <TabsTrigger value="live">Live Now</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {classes?.map((liveClass) => (
              <Card key={liveClass.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        {liveClass.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {liveClass.courseTitle}
                      </p>
                    </div>
                    <Badge variant={
                      liveClass.status === 'live' ? 'destructive' :
                      liveClass.status === 'upcoming' ? 'secondary' :
                      'outline'
                    }>
                      {liveClass.status === 'live' ? 'Live Now' :
                       liveClass.status === 'upcoming' ? 'Upcoming' :
                       'Completed'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(liveClass.startTime), 'PPP')}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        {format(new Date(liveClass.startTime), 'p')} ({liveClass.duration} mins)
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        {liveClass.attendees} Attendees
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      {liveClass.status === 'live' && (
                        <Button onClick={() => handleJoinClass(liveClass.id)}>
                          Join Now
                        </Button>
                      )}
                      {liveClass.status === 'completed' && liveClass.recordingUrl && (
                        <Button variant="outline" onClick={() => window.open(liveClass.recordingUrl, '_blank')}>
                          Watch Recording
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </StudentDashboardLayout>
  );
} 