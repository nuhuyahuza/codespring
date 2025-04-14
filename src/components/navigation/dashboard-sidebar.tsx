
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, BookOpen, Video, ClipboardList, Users, 
  Award, User, Bell, HelpCircle, ChevronLeft, ChevronRight, 
  Settings, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type NavItem = {
  title: string;
  path: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Courses",
    path: "/courses",
    icon: BookOpen,
  },
  {
    title: "Live Classes",
    path: "/live-classes",
    icon: Video,
  },
  {
    title: "Assignments",
    path: "/assignments",
    icon: ClipboardList,
  },
  {
    title: "Community Groups",
    path: "/groups",
    icon: Users,
  },
  {
    title: "Certificates",
    path: "/certificates",
    icon: Award,
  },
  {
    title: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    title: "Support",
    path: "/support",
    icon: HelpCircle,
  },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      <div className="flex items-center justify-between p-4">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          {!collapsed && (
            <span className="text-xl font-semibold animate-fade-in">Codespring</span>
          )}
          {collapsed && (
            <div className="h-8 w-8 rounded-full bg-codespring-green-500 flex items-center justify-center text-white font-bold">
              C
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <Separator className="bg-sidebar-border" />

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center"
                )
              }
            >
              <item.icon size={20} className={cn("flex-shrink-0", !collapsed && "animate-fade-in")} />
              {!collapsed && (
                <span className="text-sm font-medium animate-fade-in">{item.title}</span>
              )}
              {collapsed && (
                <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-sidebar-accent text-sidebar-accent-foreground text-xs invisible opacity-0 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
                  {item.title}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <Separator className="bg-sidebar-border" />

      <div className={cn("p-4", collapsed ? "items-center justify-center" : "")}>
        <div className={cn("flex items-center", collapsed && "flex-col gap-2")}>
          <Avatar className="h-9 w-9 border-2 border-sidebar-border">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium">Alex Smith</p>
              <p className="text-xs text-sidebar-foreground/60">alex@example.com</p>
            </div>
          )}
          {!collapsed && (
            <Button variant="ghost" size="icon" className="ml-auto">
              <Settings size={18} className="text-sidebar-foreground/60" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
