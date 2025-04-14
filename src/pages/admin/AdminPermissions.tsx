
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Save, Shield, UserCog, Users, Lock, Search, Plus } from "lucide-react";

const AdminPermissions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for roles
  const roles = [
    { id: 1, name: "Admin", users: 12, description: "Full platform access", isSystem: true },
    { id: 2, name: "Instructor", users: 45, description: "Course creation and student management", isSystem: true },
    { id: 3, name: "Student", users: 1100, description: "Learning access only", isSystem: true },
    { id: 4, name: "Content Manager", users: 5, description: "Content moderation and creation", isSystem: false },
    { id: 5, name: "Support Staff", users: 8, description: "Support ticket handling", isSystem: false }
  ];
  
  // Mock permissions data
  const permissionGroups = [
    {
      name: "Users",
      permissions: [
        { id: "users.view", name: "View Users", description: "Can view user profiles" },
        { id: "users.create", name: "Create Users", description: "Can create new user accounts" },
        { id: "users.edit", name: "Edit Users", description: "Can edit user account details" },
        { id: "users.delete", name: "Delete Users", description: "Can delete user accounts" }
      ]
    },
    {
      name: "Courses",
      permissions: [
        { id: "courses.view", name: "View Courses", description: "Can view course details" },
        { id: "courses.create", name: "Create Courses", description: "Can create new courses" },
        { id: "courses.edit", name: "Edit Courses", description: "Can modify course content" },
        { id: "courses.delete", name: "Delete Courses", description: "Can delete courses" },
        { id: "courses.publish", name: "Publish Courses", description: "Can publish/unpublish courses" }
      ]
    },
    {
      name: "Assignments",
      permissions: [
        { id: "assignments.view", name: "View Assignments", description: "Can view assignments" },
        { id: "assignments.create", name: "Create Assignments", description: "Can create assignments" },
        { id: "assignments.grade", name: "Grade Assignments", description: "Can grade student submissions" }
      ]
    },
    {
      name: "Platform Settings",
      permissions: [
        { id: "settings.view", name: "View Settings", description: "Can view platform settings" },
        { id: "settings.edit", name: "Edit Settings", description: "Can modify platform settings" },
        { id: "settings.billing", name: "Billing Access", description: "Can manage billing settings" }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Roles & Permissions" 
        description="Manage user roles and access control"
      >
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </PageHeader>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="users">User Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          <div className="flex justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Role
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Card key={role.id} className={role.isSystem ? "border-primary/20" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    {role.isSystem && <Badge variant="outline">System</Badge>}
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">{role.users} users</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      {!role.isSystem && (
                        <Button variant="outline" size="sm">Delete</Button>
                      )}
                    </div>
                  </div>
                  
                  {role.name === "Admin" && (
                    <div className="bg-muted/50 p-2 rounded-md text-xs text-muted-foreground">
                      This role has full access to all areas of the platform
                    </div>
                  )}
                  
                  {role.name === "Content Manager" && (
                    <div className="space-y-2">
                      <span className="text-xs font-medium">Key permissions:</span>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">Courses</Badge>
                        <Badge variant="secondary" className="text-xs">Content</Badge>
                        <Badge variant="secondary" className="text-xs">Media</Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Management</CardTitle>
              <CardDescription>Define permissions and assign them to roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {permissionGroups.map((group, groupIndex) => (
                  <div key={group.name} className="space-y-4">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium">{group.name}</h3>
                      <Separator className="flex-1 ml-4" />
                    </div>
                    
                    <div className="space-y-2">
                      {group.permissions.map((permission) => (
                        <div key={permission.id} className="flex justify-between items-center bg-card p-4 rounded-md border">
                          <div>
                            <h4 className="font-medium">{permission.name}</h4>
                            <p className="text-sm text-muted-foreground">{permission.description}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="grid grid-cols-3 gap-6 items-center">
                              <div className="flex flex-col items-center">
                                <Label htmlFor={`${permission.id}-admin`} className="mb-1 text-xs">Admin</Label>
                                <Switch id={`${permission.id}-admin`} defaultChecked disabled />
                              </div>
                              <div className="flex flex-col items-center">
                                <Label htmlFor={`${permission.id}-instructor`} className="mb-1 text-xs">Instructor</Label>
                                <Switch id={`${permission.id}-instructor`} defaultChecked={
                                  permission.id.startsWith("courses") || 
                                  permission.id.startsWith("assignments") || 
                                  permission.id === "users.view"
                                } />
                              </div>
                              <div className="flex flex-col items-center">
                                <Label htmlFor={`${permission.id}-content`} className="mb-1 text-xs">Content Mgr</Label>
                                <Switch id={`${permission.id}-content`} defaultChecked={
                                  permission.id.startsWith("courses") && 
                                  !permission.id.includes("delete")
                                } />
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Lock className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User-Specific Permissions</CardTitle>
              <CardDescription>Override role-based permissions for specific users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                />
              </div>
              
              <div className="rounded-md border">
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCog className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Dr. Robert Chen</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Instructor</Badge>
                        <span className="text-xs text-muted-foreground">robert.chen@example.com</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm">Manage</Button>
                </div>
                
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Sarah Davis</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Content Manager</Badge>
                        <Badge variant="secondary">Custom</Badge>
                        <span className="text-xs text-muted-foreground">sarah.davis@example.com</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm">Manage</Button>
                </div>
                
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Michael Johnson</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Support Staff</Badge>
                        <span className="text-xs text-muted-foreground">michael.j@example.com</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm">Manage</Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" size="sm">View All Users</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPermissions;
