import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  MessageSquare, 
  Search,
  Plus,
  Loader2
} from 'lucide-react';
import { StudentDashboardLayout } from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  isJoined: boolean;
  recentActivity?: {
    title: string;
    type: string;
    timestamp: string;
  }[];
}

const createGroupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['study', 'project', 'discussion', 'other']),
});

type CreateGroupFormData = z.infer<typeof createGroupSchema>;

function CreateGroupDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'study',
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: async (data: CreateGroupFormData) => {
      const response = await api.post('/student/community-groups', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Group created successfully!');
      queryClient.invalidateQueries({ queryKey: ['communityGroups'] });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error('Failed to create group. Please try again.');
      console.error('Error creating group:', error);
    },
  });

  const onSubmit = (data: CreateGroupFormData) => {
    createGroupMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a new community group to connect with other students
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter group name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Describe the purpose of your group"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="study">Study Group</SelectItem>
                      <SelectItem value="project">Project Team</SelectItem>
                      <SelectItem value="discussion">Discussion Group</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full"
              disabled={createGroupMutation.isPending}
            >
              {createGroupMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Group'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const { data: groups, isLoading } = useQuery<CommunityGroup[]>({
    queryKey: ['communityGroups'],
    queryFn: async () => {
      const response = await api.get('/student/community-groups');
      return response.data;
    },
  });

  const joinGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const response = await api.post(`/student/community-groups/${groupId}/join`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Successfully joined the group!');
      queryClient.invalidateQueries({ queryKey: ['communityGroups'] });
    },
    onError: (error) => {
      console.error('Error joining group:', error);
      toast.error('Failed to join group. Please try again.');
    },
  });

  const filteredGroups = groups?.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <StudentDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </StudentDashboardLayout>
    );
  }

  return (
    <StudentDashboardLayout>
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Community Groups</h1>
          <CreateGroupDialog />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups?.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {group.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {group.description}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {group.memberCount} members
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {group.recentActivity && group.recentActivity.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                      {group.recentActivity.map((activity, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <MessageSquare className="h-4 w-4" />
                          {activity.title}
                        </div>
                      ))}
                    </div>
                  )}
                  <Button 
                    className="w-full"
                    variant={group.isJoined ? "outline" : "default"}
                    onClick={() => !group.isJoined && joinGroupMutation.mutate(group.id)}
                    disabled={joinGroupMutation.isPending}
                  >
                    {group.isJoined ? 'View Discussions' : 'Join Group'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </StudentDashboardLayout>
  );
} 