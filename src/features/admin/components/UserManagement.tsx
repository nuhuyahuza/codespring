import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Search,
  UserPlus,
  Mail,
  Lock,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  enrolledCourses?: number;
  createdCourses?: number;
  lastActive: string;
  permissions: string[];
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'STUDENT',
    status: 'ACTIVE',
    enrolledCourses: 5,
    lastActive: '2023-07-01T10:00:00Z',
    permissions: ['VIEW_COURSES', 'ENROLL_COURSES'],
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'INSTRUCTOR',
    status: 'ACTIVE',
    createdCourses: 3,
    lastActive: '2023-07-02T15:30:00Z',
    permissions: ['CREATE_COURSES', 'MANAGE_COURSES', 'VIEW_ANALYTICS'],
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    lastActive: '2023-07-03T09:15:00Z',
    permissions: ['MANAGE_USERS', 'MANAGE_COURSES', 'MANAGE_SETTINGS'],
  },
];

const rolePermissions = {
  STUDENT: [
    'VIEW_COURSES',
    'ENROLL_COURSES',
    'SUBMIT_ASSIGNMENTS',
    'JOIN_LIVE_SESSIONS',
  ],
  INSTRUCTOR: [
    'CREATE_COURSES',
    'MANAGE_COURSES',
    'VIEW_ANALYTICS',
    'MANAGE_ASSIGNMENTS',
    'HOST_LIVE_SESSIONS',
  ],
  ADMIN: [
    'MANAGE_USERS',
    'MANAGE_COURSES',
    'MANAGE_SETTINGS',
    'VIEW_ANALYTICS',
    'MANAGE_FEATURES',
  ],
};

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleUpdateUser = async (userId: string, data: Partial<User>) => {
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, ...data } : user
        )
      );
      toast.success('User updated successfully');
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>View and manage platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={selectedRole || ''}
              onValueChange={(value) => setSelectedRole(value || null)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All roles</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === 'ADMIN'
                          ? 'destructive'
                          : user.role === 'INSTRUCTOR'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {user.role.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === 'ACTIVE'
                          ? 'success'
                          : user.status === 'INACTIVE'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {user.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.lastActive).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input defaultValue={selectedUser.name} />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input defaultValue={selectedUser.email} type="email" />
                </div>
                <div className="grid gap-2">
                  <Label>Role</Label>
                  <Select defaultValue={selectedUser.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select defaultValue={selectedUser.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Permissions</Label>
                  <Button variant="outline" size="sm">
                    <Shield className="mr-2 h-4 w-4" />
                    Reset to Role Defaults
                  </Button>
                </div>
                <div className="grid gap-2">
                  {rolePermissions[selectedUser.role].map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center justify-between"
                    >
                      <Label>{permission.replace(/_/g, ' ').toLowerCase()}</Label>
                      <Switch
                        checked={selectedUser.permissions.includes(permission)}
                        onCheckedChange={(checked) => {
                          const newPermissions = checked
                            ? [...selectedUser.permissions, permission]
                            : selectedUser.permissions.filter(
                                (p) => p !== permission
                              );
                          handleUpdateUser(selectedUser.id, {
                            permissions: newPermissions,
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    handleUpdateUser(selectedUser.id, {
                      name: selectedUser.name,
                      email: selectedUser.email,
                      role: selectedUser.role,
                      status: selectedUser.status,
                    })
                  }
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 