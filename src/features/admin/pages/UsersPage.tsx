import { useState } from 'react';
import { UsersTable } from '../components/UsersTable';
import { Button } from '@/components/ui/button';
import { Plus, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { useSystemSettings } from '@/hooks/useSystemSettings';

// Mock data - replace with actual API calls
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'STUDENT',
    isActive: true,
    createdAt: '2024-03-15T10:00:00Z',
    lastLogin: '2024-03-20T15:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'INSTRUCTOR',
    isActive: true,
    createdAt: '2024-03-10T09:00:00Z',
    lastLogin: '2024-03-19T14:20:00Z',
  },
  // Add more mock users as needed
];

export function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const { settings } = useSystemSettings();

  const handleEditUser = (userId: string) => {
    // Implement edit user logic
    toast.info('Edit user functionality to be implemented');
  };

  const handleDeleteUser = (userId: string) => {
    // Implement delete user logic with confirmation
    toast.info('Delete user functionality to be implemented');
  };

  const handleToggleUserStatus = (userId: string, isActive: boolean) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isActive } : user
      )
    );
    toast.success(
      `User ${isActive ? 'activated' : 'deactivated'} successfully`
    );
  };

  const handleCreateUser = () => {
    // Implement create user logic
    toast.info('Create user functionality to be implemented');
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/admin/settings'}
          >
            <UserCog className="mr-2 h-4 w-4" />
            User Settings
          </Button>
          <Button onClick={handleCreateUser}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* System status alerts */}
      {!settings?.general.allowRegistration && (
        <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/30">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                Registration Disabled
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  New user registration is currently disabled. Only administrators
                  can create new accounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users table */}
      <UsersTable
        users={users}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onToggleUserStatus={handleToggleUserStatus}
      />
    </div>
  );
} 