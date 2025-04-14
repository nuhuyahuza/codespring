import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Download
} from "lucide-react";
import { AddUserModal } from "@/components/modals/add-user-modal";

const AdminUsers = () => {
  // Mock user data
  const users = [
    { 
      id: "1", 
      name: "Alex Johnson", 
      email: "alex.j@example.com", 
      role: "Admin", 
      status: "Active", 
      lastActive: "Just now" 
    },
    { 
      id: "2", 
      name: "Sarah Williams", 
      email: "sarah.w@example.com", 
      role: "Instructor", 
      status: "Active", 
      lastActive: "2 hours ago" 
    },
    { 
      id: "3", 
      name: "Michael Chen", 
      email: "michael.c@example.com", 
      role: "Student", 
      status: "Active", 
      lastActive: "1 day ago" 
    },
    { 
      id: "4", 
      name: "Emma Rodriguez", 
      email: "emma.r@example.com", 
      role: "Student", 
      status: "Inactive", 
      lastActive: "2 weeks ago" 
    },
    { 
      id: "5", 
      name: "James Wilson", 
      email: "james.w@example.com", 
      role: "Instructor", 
      status: "Active", 
      lastActive: "3 days ago" 
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="User Management" 
        description="View and manage all platform users"
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <AddUserModal />
        </div>
      </PageHeader>

      <DashboardCard>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-8" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <AddUserModal triggerContent={
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </>
            } />
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      user.status === "Active" 
                        ? "bg-green-50 text-green-700" 
                        : "bg-red-50 text-red-700"
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem>Reset Password</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DashboardCard>
    </div>
  );
};

export default AdminUsers;
