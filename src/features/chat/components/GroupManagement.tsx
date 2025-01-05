import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  useCourseGroups,
  useCreateGroup,
  useUpdateGroup,
  useAddMember,
  useRemoveMember,
} from '../hooks/useGroups';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Users,
  MessageSquare,
  Settings,
  UserPlus,
  UserMinus,
} from 'lucide-react';
import { toast } from 'sonner';

interface GroupManagementProps {
  courseId: string;
  onJoinGroup: (groupId: string) => void;
}

export function GroupManagement({ courseId, onJoinGroup }: GroupManagementProps) {
  const { user } = useAuth();
  const { data: groups, isLoading } = useCourseGroups(courseId);
  const { mutate: createGroup } = useCreateGroup();
  const { mutate: updateGroup } = useUpdateGroup();
  const { mutate: addMember } = useAddMember();
  const { mutate: removeMember } = useRemoveMember();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
  });

  const handleCreateGroup = () => {
    if (!newGroupData.name.trim()) {
      toast.error('Group name is required');
      return;
    }

    createGroup({
      name: newGroupData.name,
      description: newGroupData.description,
      courseId,
    });

    setNewGroupData({ name: '', description: '' });
    setIsCreateDialogOpen(false);
  };

  const handleUpdateGroup = () => {
    if (!selectedGroup || !selectedGroup.name.trim()) {
      toast.error('Group name is required');
      return;
    }

    updateGroup({
      groupId: selectedGroup.id,
      data: {
        name: selectedGroup.name,
        description: selectedGroup.description,
      },
    });

    setSelectedGroup(null);
    setIsEditDialogOpen(false);
  };

  const handleJoinGroup = (groupId: string) => {
    addMember({
      groupId,
      data: {
        userId: user!.id,
      },
    });
    onJoinGroup(groupId);
  };

  const handleLeaveGroup = (groupId: string) => {
    removeMember({
      groupId,
      userId: user!.id,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin">⌛</div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Discussion Groups</CardTitle>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Messages</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups?.map((group) => {
              const userRole = group.members?.[0]?.role;
              const isMember = !!userRole;

              return (
                <TableRow key={group.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{group.name}</div>
                      {group.description && (
                        <div className="text-sm text-muted-foreground">
                          {group.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{group._count?.members || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{group._count?.messages || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isMember ? (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => onJoinGroup(group.id)}
                          >
                            Join Chat
                          </Button>
                          {userRole === 'OWNER' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedGroup(group);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleLeaveGroup(group.id)}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleJoinGroup(group.id)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Join Group
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Create Group Dialog */}
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Discussion Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name">Group Name</label>
                <Input
                  id="name"
                  value={newGroupData.name}
                  onChange={(e) =>
                    setNewGroupData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter group name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  value={newGroupData.description}
                  onChange={(e) =>
                    setNewGroupData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter group description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateGroup}>Create Group</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Group Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="edit-name">Group Name</label>
                <Input
                  id="edit-name"
                  value={selectedGroup?.name || ''}
                  onChange={(e) =>
                    setSelectedGroup((prev: any) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter group name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-description">Description</label>
                <Textarea
                  id="edit-description"
                  value={selectedGroup?.description || ''}
                  onChange={(e) =>
                    setSelectedGroup((prev: any) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter group description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateGroup}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
} 