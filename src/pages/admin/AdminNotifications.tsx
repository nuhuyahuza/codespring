
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  UserPlus, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Users, 
  Megaphone, 
  Plus, 
  CheckCheck, 
  X,
  Filter 
} from "lucide-react";

const AdminNotifications = () => {
  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      title: "New instructor application",
      message: "Dr. Robert Chen has applied to become an instructor",
      type: "instructor",
      status: "unread",
      time: "10 minutes ago"
    },
    {
      id: 2,
      title: "System update scheduled",
      message: "Platform maintenance scheduled for Sunday, June, 12th at 02:00 AM UTC",
      type: "system",
      status: "unread",
      time: "2 hours ago"
    },
    {
      id: 3,
      title: "Payment processing issue",
      message: "Failed payment for student ID #45829 - Transaction #TX892341",
      type: "payment",
      status: "unread",
      time: "3 hours ago"
    },
    {
      id: 4,
      title: "New course published",
      message: "Advanced Machine Learning by Prof. Emma Wilson is now live",
      type: "course",
      status: "read",
      time: "Yesterday"
    },
    {
      id: 5,
      title: "User reported content",
      message: "Inappropriate content reported in JavaScript Developers community group",
      type: "report",
      status: "read",
      time: "2 days ago"
    },
    {
      id: 6,
      title: "Server performance alert",
      message: "High CPU usage detected on main application server",
      type: "alert",
      status: "read",
      time: "3 days ago"
    }
  ];

  // Filter notifications by status
  const unreadNotifications = notifications.filter(notification => notification.status === "unread");
  const readNotifications = notifications.filter(notification => notification.status === "read");

  // Helper function to get icon by notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "instructor":
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case "system":
        return <Info className="h-5 w-5 text-purple-500" />;
      case "payment":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "course":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "report":
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Notifications" 
        description="Manage platform notifications and alerts"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Announcement
        </Button>
      </PageHeader>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadNotifications.length > 0 && (
              <Badge variant="secondary" className="ml-2">{unreadNotifications.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <span className="text-sm text-muted-foreground">
                Showing {notifications.length} notifications
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
              <Button variant="outline" size="sm">Clear All</Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className={notification.status === "unread" ? "border-primary/50" : ""}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {notification.time}
                          </span>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="capitalize">
                          {notification.type}
                        </Badge>
                        <div className="flex gap-2">
                          {notification.status === "unread" && (
                            <Button variant="outline" size="sm">
                              <CheckCheck className="h-3 w-3 mr-1" />
                              Mark as Read
                            </Button>
                          )}
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </TabsContent>

        <TabsContent value="unread" className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              You have {unreadNotifications.length} unread notifications
            </span>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {unreadNotifications.length > 0 ? (
              unreadNotifications.map((notification) => (
                <Card key={notification.id} className="border-primary/50">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium">{notification.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {notification.time}
                            </span>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="capitalize">
                            {notification.type}
                          </Badge>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <CheckCheck className="h-3 w-3 mr-1" />
                              Mark as Read
                            </Button>
                            <Button size="sm">View Details</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">You have no unread notifications.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Announcement</CardTitle>
              <CardDescription>Broadcast a message to platform users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="announcement-title">Title</Label>
                <Input id="announcement-title" placeholder="Enter announcement title" />
              </div>
              
              <div>
                <Label htmlFor="announcement-message">Message</Label>
                <Textarea 
                  id="announcement-message" 
                  placeholder="Enter your announcement message" 
                  className="min-h-32" 
                />
              </div>
              
              <div>
                <Label>Target Audience</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="target-all" />
                    <Label htmlFor="target-all">All Users</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="target-students" />
                    <Label htmlFor="target-students">Students</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="target-instructors" />
                    <Label htmlFor="target-instructors">Instructors</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="target-admins" />
                    <Label htmlFor="target-admins">Admins</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Delivery Method</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="delivery-notification" defaultChecked />
                    <Label htmlFor="delivery-notification" className="flex items-center">
                      <Bell className="h-4 w-4 mr-2" />
                      In-App Notification
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="delivery-email" />
                    <Label htmlFor="delivery-email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="delivery-banner" />
                    <Label htmlFor="delivery-banner" className="flex items-center">
                      <Megaphone className="h-4 w-4 mr-2" />
                      Site Banner
                    </Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Priority Level</Label>
                <div className="flex mt-2">
                  <div className="flex items-center space-x-2 mr-6">
                    <input type="radio" id="priority-normal" name="priority" value="normal" defaultChecked />
                    <Label htmlFor="priority-normal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2 mr-6">
                    <input type="radio" id="priority-important" name="priority" value="important" />
                    <Label htmlFor="priority-important">Important</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="priority-urgent" name="priority" value="urgent" />
                    <Label htmlFor="priority-urgent">Urgent</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">Schedule for Later</Button>
                <Button>Send Now</Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Recent Announcements</h3>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <Megaphone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium">Platform Update: New Features Released</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">2 days ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      We're excited to announce several new features including improved video player, enhanced discussion forums, and performance optimizations. Check out the what's new section to learn more!
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge>All Users</Badge>
                        <Badge variant="outline">High Priority</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          1,245 recipients
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          24 responses
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <Megaphone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium">Scheduled Maintenance Notice</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">5 days ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      The platform will be undergoing scheduled maintenance on Sunday, June 12th from 02:00 - 04:00 UTC. During this time, the system may be temporarily unavailable. We apologize for any inconvenience.
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge>All Users</Badge>
                        <Badge variant="outline">Normal Priority</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          1,245 recipients
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          8 responses
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how notifications are delivered and displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">System Notifications</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Platform Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        New features, maintenance notices, and system-wide announcements
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center">
                        <Label htmlFor="platform-in-app" className="mb-1 text-xs">In-App</Label>
                        <Switch id="platform-in-app" defaultChecked />
                      </div>
                      <div className="flex flex-col items-center">
                        <Label htmlFor="platform-email" className="mb-1 text-xs">Email</Label>
                        <Switch id="platform-email" defaultChecked />
                      </div>
                      <div className="flex flex-col items-center">
                        <Label htmlFor="platform-urgent" className="mb-1 text-xs">Urgent</Label>
                        <Switch id="platform-urgent" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Login attempts, password changes, and security-related events
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center">
                        <Label htmlFor="security-in-app" className="mb-1 text-xs">In-App</Label>
                        <Switch id="security-in-app" defaultChecked />
                      </div>
                      <div className="flex flex-col items-center">
                        <Label htmlFor="security-email" className="mb-1 text-xs">Email</Label>
                        <Switch id="security-email" defaultChecked />
                      </div>
                      <div className="flex flex-col items-center">
                        <Label htmlFor="security-urgent" className="mb-1 text-xs">Urgent</Label>
                        <Switch id="security-urgent" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">User Management</Label>
                      <p className="text-sm text-muted-foreground">
                        New user registrations, role change requests, user reports
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center">
                        <Label htmlFor="user-in-app" className="mb-1 text-xs">In-App</Label>
                        <Switch id="user-in-app" defaultChecked />
                      </div>
                      <div className="flex flex-col items-center">
                        <Label htmlFor="user-email" className="mb-1 text-xs">Email</Label>
                        <Switch id="user-email" />
                      </div>
                      <div className="flex flex-col items-center">
                        <Label htmlFor="user-urgent" className="mb-1 text-xs">Urgent</Label>
                        <Switch id="user-urgent" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Content & Payment Notifications</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Course Management</Label>
                      <p className="text-sm text-muted-foreground">
                        New course publications, content updates, approvals needed
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center">
                        <Label htmlFor="course-in-app" className="mb-1 text-xs">In-App</Label>
                        <Switch id="course-in-app" defaultChecked />
                      </div>
                      <div className="flex flex-col items-center">
                        <Label htmlFor="course-email" className="mb-1 text-xs">Email</Label>
                        <Switch id="course-email" />
                      </div>
                      <div className="flex flex-col items-center">
                        <Label htmlFor="course-urgent" className="mb-1 text-xs">Urgent</Label>
                        <Switch id="course-urgent" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Payment & Billing</Label>
                      <p className="text-sm text-muted-foreground">
                        Payment processing, refunds, subscription changes
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center">
                        <Label htmlFor="payment-in-app" className="mb-1 text-xs">In-App</Label>
                        <Switch id="payment-in-app" defaultChecked />
                      </div>
                      <div className="flex flex-col items-center">
                        <Label htmlFor="payment-email" className="mb-1 text-xs">Email</Label>
                        <Switch id="payment-email" defaultChecked />
                      </div>
                      <div className="flex flex-col items-center">
                        <Label htmlFor="payment-urgent" className="mb-1 text-xs">Urgent</Label>
                        <Switch id="payment-urgent" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Content Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        User-reported content, moderation needs, policy violations
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center">
                        <Label htmlFor="reports-in-app" className="mb-1 text-xs">In-App</Label>
                        <Switch id="reports-in-app" defaultChecked />
                      </div>
                      <div className="flex flex-col items-center">
                        <Label htmlFor="reports-email" className="mb-1 text-xs">Email</Label>
                        <Switch id="reports-email" defaultChecked />
                      </div>
                      <div className="flex flex-col items-center">
                        <Label htmlFor="reports-urgent" className="mb-1 text-xs">Urgent</Label>
                        <Switch id="reports-urgent" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Customize notification email templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-dashed hover:border-primary/50 cursor-pointer transition-colors">
                  <CardContent className="p-4 text-center">
                    <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-medium mb-1">Welcome Email</h4>
                    <p className="text-sm text-muted-foreground">Sent to new users</p>
                  </CardContent>
                </Card>
                
                <Card className="border-dashed hover:border-primary/50 cursor-pointer transition-colors">
                  <CardContent className="p-4 text-center">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-medium mb-1">System Announcement</h4>
                    <p className="text-sm text-muted-foreground">Platform-wide notifications</p>
                  </CardContent>
                </Card>
                
                <Card className="border-dashed hover:border-primary/50 cursor-pointer transition-colors">
                  <CardContent className="p-4 text-center">
                    <ShieldAlert className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-medium mb-1">Security Alert</h4>
                    <p className="text-sm text-muted-foreground">Security-related notifications</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotifications;
