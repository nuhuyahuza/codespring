
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, MessageSquare, User, Calendar, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

const CommunityGroups = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for community groups
  const allGroups = [
    {
      id: "1",
      name: "JavaScript Study Group",
      description: "A community of JavaScript enthusiasts sharing knowledge and resources",
      members: 24,
      joined: true,
      category: "Study",
      lastActive: new Date(2024, 6, 14),
      discussions: 42,
      latestDiscussions: [
        {
          id: "1",
          title: "Promises vs Async/Await",
          author: "Jane Cooper",
          date: new Date(2024, 6, 14),
          replies: 12,
        },
        {
          id: "2",
          title: "ES6+ Features You Should Know",
          author: "Wade Warren",
          date: new Date(2024, 6, 13),
          replies: 8,
        },
      ],
    },
    {
      id: "2",
      name: "Web Development Projects",
      description: "Collaborate on web projects and get feedback from peers",
      members: 36,
      joined: true,
      category: "Projects",
      lastActive: new Date(2024, 6, 15),
      discussions: 57,
      latestDiscussions: [
        {
          id: "3",
          title: "Portfolio Website Feedback",
          author: "Leslie Alexander",
          date: new Date(2024, 6, 15),
          replies: 16,
        },
        {
          id: "4",
          title: "E-commerce Project Collaboration",
          author: "Guy Hawkins",
          date: new Date(2024, 6, 12),
          replies: 21,
        },
      ],
    },
    {
      id: "3",
      name: "React Developers",
      description: "Everything related to React and its ecosystem",
      members: 48,
      joined: false,
      category: "Framework",
      lastActive: new Date(2024, 6, 13),
      discussions: 93,
      latestDiscussions: [
        {
          id: "5",
          title: "React 18 New Features Discussion",
          author: "Dianne Russell",
          date: new Date(2024, 6, 13),
          replies: 24,
        },
        {
          id: "6",
          title: "State Management Solutions",
          author: "Robert Fox",
          date: new Date(2024, 6, 11),
          replies: 19,
        },
      ],
    },
    {
      id: "4",
      name: "UI/UX Design Principles",
      description: "Discuss design patterns and user experience best practices",
      members: 31,
      joined: false,
      category: "Design",
      lastActive: new Date(2024, 6, 10),
      discussions: 36,
      latestDiscussions: [
        {
          id: "7",
          title: "Minimalist Design Trends in 2024",
          author: "Cameron Williamson",
          date: new Date(2024, 6, 10),
          replies: 15,
        },
        {
          id: "8",
          title: "Mobile-first Design Approach",
          author: "Savannah Nguyen",
          date: new Date(2024, 6, 8),
          replies: 11,
        },
      ],
    },
  ];

  // Filter groups based on search query
  const filteredGroups = allGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const joinedGroups = filteredGroups.filter((group) => group.joined);
  const exploreGroups = filteredGroups.filter((group) => !group.joined);

  // Toggle join status
  const toggleJoinStatus = (groupId: string) => {
    // In a real app, this would update the server data
    console.log(`Toggled join status for group: ${groupId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Community Groups" 
        description="Connect with fellow students and participate in group discussions"
      >
        <div className="relative w-full md:w-[260px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search groups..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </PageHeader>

      <Tabs defaultValue="my-groups" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-groups" className="flex gap-2">
            <Users size={16} />
            <span>My Groups</span>
          </TabsTrigger>
          <TabsTrigger value="explore" className="flex gap-2">
            <Search size={16} />
            <span>Explore</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-groups" className="space-y-6 mt-6">
          {joinedGroups.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {joinedGroups.map((group) => (
                <DashboardCard key={group.id} className="h-full">
                  <div className="flex flex-col h-full">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-medium text-lg">{group.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users size={14} />
                            <span>{group.members} members</span>
                            <Badge variant="outline" className="ml-1">
                              {group.category}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleJoinStatus(group.id)}
                        >
                          Leave
                        </Button>
                      </div>
                      <p className="text-sm">{group.description}</p>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Recent Discussions</h4>
                        <Button variant="ghost" size="sm" className="gap-1 text-sm" asChild>
                          <a href={`/groups/${group.id}`}>
                            View all
                            <ChevronRight size={14} />
                          </a>
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {group.latestDiscussions.map((discussion) => (
                          <div key={discussion.id} className="p-3 bg-muted/40 rounded-md">
                            <div className="flex justify-between items-start mb-2">
                              <a href={`/groups/${group.id}/discussions/${discussion.id}`} className="font-medium hover:underline">
                                {discussion.title}
                              </a>
                              <Badge variant="outline" className="text-xs">
                                {discussion.replies} replies
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback>{discussion.author.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{discussion.author}</span>
                              <span>•</span>
                              <span>{format(discussion.date, "MMM d")}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4">
                      <Button className="w-full" asChild>
                        <a href={`/groups/${group.id}`}>
                          View Group
                        </a>
                      </Button>
                    </div>
                  </div>
                </DashboardCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-lg font-medium">You haven't joined any groups yet</h3>
              <p className="text-muted-foreground mt-1">
                Explore available groups to connect with fellow students
              </p>
              <Button className="mt-4" variant="outline">
                Explore Groups
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="explore" className="space-y-6 mt-6">
          {exploreGroups.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {exploreGroups.map((group) => (
                <DashboardCard key={group.id} className="h-full">
                  <div className="flex flex-col h-full">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-medium text-lg">{group.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users size={14} />
                            <span>{group.members} members</span>
                            <Badge variant="outline" className="ml-1">
                              {group.category}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => toggleJoinStatus(group.id)}
                        >
                          Join
                        </Button>
                      </div>
                      <p className="text-sm">{group.description}</p>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Group Activity</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div className="p-3 bg-muted/40 rounded-md">
                          <div className="font-medium">{group.discussions}</div>
                          <div className="text-muted-foreground text-xs">Discussions</div>
                        </div>
                        <div className="p-3 bg-muted/40 rounded-md">
                          <div className="font-medium">{group.members}</div>
                          <div className="text-muted-foreground text-xs">Members</div>
                        </div>
                        <div className="p-3 bg-muted/40 rounded-md">
                          <div className="font-medium">{format(group.lastActive, "MMM d")}</div>
                          <div className="text-muted-foreground text-xs">Last Active</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4">
                      <Button variant="outline" className="w-full" asChild>
                        <a href={`/groups/${group.id}`}>
                          Preview Group
                        </a>
                      </Button>
                    </div>
                  </div>
                </DashboardCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-lg font-medium">No groups found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search query
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityGroups;
