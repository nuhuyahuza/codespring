
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, Users, Video, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const LiveClasses = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for upcoming live classes
  const allLiveClasses = [
    {
      id: "1",
      title: "React Performance Optimization",
      description: "Learn techniques to optimize your React applications for better performance",
      instructor: "Jane Cooper",
      date: new Date(2024, 6, 15, 14, 0),
      duration: "60 min",
      attendees: 46,
      image: "/lovable-uploads/9ef64252-f03e-4682-9aa3-2f2877a7d64f.png",
    },
    {
      id: "2",
      title: "Modern CSS Techniques",
      description: "Explore modern CSS features, including Grid, Flexbox, and custom properties",
      instructor: "Esther Howard",
      date: new Date(2024, 6, 16, 13, 0),
      duration: "90 min",
      attendees: 38,
      image: "/lovable-uploads/9ef64252-f03e-4682-9aa3-2f2877a7d64f.png",
    },
    {
      id: "3",
      title: "State Management in React",
      description: "Compare different state management solutions: Context, Redux, Zustand",
      instructor: "Cameron Williamson",
      date: new Date(2024, 6, 17, 15, 30),
      duration: "75 min",
      attendees: 52,
      image: "/lovable-uploads/9ef64252-f03e-4682-9aa3-2f2877a7d64f.png",
    },
    {
      id: "4",
      title: "Building API Endpoints with Node.js",
      description: "Learn to create robust RESTful APIs using Node.js and Express",
      instructor: "Leslie Alexander",
      date: new Date(2024, 6, 20, 11, 0),
      duration: "60 min",
      attendees: 29,
      image: "/lovable-uploads/9ef64252-f03e-4682-9aa3-2f2877a7d64f.png",
    },
  ];

  // Filter classes based on search query
  const filteredClasses = allLiveClasses.filter((liveClass) =>
    liveClass.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    liveClass.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    liveClass.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter classes by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingClasses = filteredClasses.filter(
    (liveClass) => liveClass.date >= today
  );

  const classesForSelectedDate = date
    ? filteredClasses.filter(
        (liveClass) =>
          liveClass.date.getDate() === date.getDate() &&
          liveClass.date.getMonth() === date.getMonth() &&
          liveClass.date.getFullYear() === date.getFullYear()
      )
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Live Classes" 
        description="Join interactive live sessions with instructors"
      >
        <div className="relative w-full md:w-[260px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search classes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </PageHeader>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list" className="flex gap-2">
            <Video size={16} />
            <span>List View</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex gap-2">
            <CalendarIcon size={16} />
            <span>Calendar View</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6 mt-6">
          {upcomingClasses.length > 0 ? (
            <div className="space-y-4">
              {upcomingClasses.map((liveClass) => (
                <DashboardCard key={liveClass.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="aspect-video relative md:w-1/3 rounded-md overflow-hidden">
                      <img
                        src={liveClass.image || "/placeholder.svg"}
                        alt={liveClass.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90 text-foreground font-medium">
                          {liveClass.duration}
                        </Badge>
                      </div>
                    </div>
                    <div className="md:w-2/3 space-y-3">
                      <h3 className="text-xl font-semibold">{liveClass.title}</h3>
                      <p className="text-muted-foreground">{liveClass.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-muted-foreground" />
                          <span>Instructor: {liveClass.instructor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-muted-foreground" />
                          <span>{liveClass.attendees} attending</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={16} className="text-muted-foreground" />
                          <span>{format(liveClass.date, "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-muted-foreground" />
                          <span>{format(liveClass.date, "h:mm a")}</span>
                        </div>
                      </div>
                      
                      <div className="pt-3">
                        <Button className="gap-2 shadow-sm">
                          <Video size={16} />
                          <span>Join Class</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-lg font-medium">No upcoming classes found</h3>
              <p className="text-muted-foreground mt-1">
                Check back later or try adjusting your search
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <DashboardCard>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md"
                />
              </DashboardCard>
            </div>
            <div className="md:col-span-2">
              <DashboardCard>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                  </h3>
                </div>
                <Separator className="my-4" />
                {classesForSelectedDate.length > 0 ? (
                  <div className="space-y-6">
                    {classesForSelectedDate.map((liveClass) => (
                      <div key={liveClass.id} className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h4 className="font-medium">{liveClass.title}</h4>
                          <div className="text-sm text-muted-foreground">
                            {format(liveClass.date, "h:mm a")} • {liveClass.duration}
                          </div>
                          <div className="text-sm">Instructor: {liveClass.instructor}</div>
                        </div>
                        <Button size="sm">Join</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No classes scheduled for this date
                    </p>
                  </div>
                )}
              </DashboardCard>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveClasses;
