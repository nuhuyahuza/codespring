
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, BookOpen, Calendar, FileText, CheckCircle, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type Notification = {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
  type: "course" | "assignment" | "live-class" | "announcement" | "feedback";
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Assignment deadline approaching",
      description: "Your 'React Basics' assignment is due in 2 days",
      date: "2 hours ago",
      read: false,
      type: "assignment"
    },
    {
      id: "2",
      title: "Live class reminder",
      description: "Your 'Advanced JavaScript' class starts in 1 hour",
      date: "1 hour ago",
      read: false,
      type: "live-class"
    },
    {
      id: "3",
      title: "New course material available",
      description: "New learning materials have been added to 'Python for Data Science'",
      date: "1 day ago",
      read: true,
      type: "course"
    },
    {
      id: "4",
      title: "Feedback received",
      description: "Instructor left feedback on your latest assignment",
      date: "2 days ago",
      read: true,
      type: "feedback"
    },
    {
      id: "5",
      title: "Course completion",
      description: "Congratulations! You've completed 'HTML & CSS Fundamentals'",
      date: "5 days ago",
      read: true,
      type: "announcement"
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };
  
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "course":
        return <BookOpen className="h-5 w-5" />;
      case "assignment":
        return <FileText className="h-5 w-5" />;
      case "live-class":
        return <Calendar className="h-5 w-5" />;
      case "announcement":
        return <Bell className="h-5 w-5" />;
      case "feedback":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto space-y-6 animate-slide-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
          <Button variant="outline" size="sm">
            Clear all
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-colors ${notification.read ? 'bg-card' : 'bg-accent/30'}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${notification.read ? 'bg-muted' : 'bg-primary/10'}`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{notification.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>

                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => markAsRead(notification.id)}
                      className="h-8 px-2"
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="unread" className="space-y-4">
          {notifications.filter(n => !n.read).length > 0 ? (
            notifications.filter(n => !n.read).map((notification) => (
              <Card key={notification.id} className="bg-accent/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{notification.title}</h3>
                        <span className="text-xs text-muted-foreground">{notification.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => markAsRead(notification.id)}
                      className="h-8 px-2"
                    >
                      Mark as read
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No unread notifications</h3>
              <p className="text-muted-foreground mt-2">You're all caught up!</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="read" className="space-y-4">
          {notifications.filter(n => n.read).map((notification) => (
            <Card key={notification.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-muted">
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{notification.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Assignment Reminders</h4>
                <p className="text-sm text-muted-foreground">Get reminded about upcoming deadlines</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Live Class Alerts</h4>
                <p className="text-sm text-muted-foreground">Receive alerts before live classes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Course Updates</h4>
                <p className="text-sm text-muted-foreground">Stay informed about course updates</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
