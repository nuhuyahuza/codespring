
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, BookOpen, Users, UserCog, Settings, 
  Bell, Shield, BarChart2, FileText, Video, 
  ChevronLeft, ChevronRight, Menu, User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface AdminSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function AdminSidebar({ open, setOpen }: AdminSidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const mainNavItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Instructors",
      href: "/admin/instructors",
      icon: UserCog,
    },
    {
      title: "Students",
      href: "/admin/students",
      icon: Users,
    },
    {
      title: "Courses",
      href: "/admin/courses",
      icon: BookOpen,
    },
    {
      title: "Live Classes",
      href: "/admin/live-classes",
      icon: Video,
    },
    {
      title: "Assignments",
      href: "/admin/assignments",
      icon: FileText,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart2,
    },
  ];

  const settingsNavItems = [
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
      icon: Bell,
    },
    {
      title: "Permissions",
      href: "/admin/permissions",
      icon: Shield,
    },
  ];

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setOpen(!open)}
          className="rounded-full bg-background shadow-md"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Sidebar Backdrop - Only on mobile */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
          open ? "w-64 translate-x-0" : "w-0 -translate-x-full md:w-20 md:translate-x-0",
          "md:relative md:transition-width"
        )}
      >
        {/* Logo and close button */}
        <div className="h-16 flex items-center justify-between px-4">
          {open ? (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                C
              </div>
              <span className="font-bold text-xl text-sidebar-foreground">Codespring</span>
            </div>
          ) : (
            <div className="h-8 w-8 mx-auto rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              C
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setOpen(!open)}
          >
            {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        
        <Separator className="bg-sidebar-border" />
        
        {/* Navigation Links */}
        <div className="flex-1 overflow-auto py-4">
          <nav className="flex flex-col gap-1 px-2">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  location.pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  !open && "justify-center md:px-2"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", !open && "mx-auto")} />
                {open && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>

          <Separator className="my-4 bg-sidebar-border" />

          <nav className="flex flex-col gap-1 px-2">
            {settingsNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  location.pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  !open && "justify-center md:px-2"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", !open && "mx-auto")} />
                {open && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Info and Theme Toggle */}
        <div className="p-4 border-t border-sidebar-border mt-auto">
          {open ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-sidebar-foreground">Admin User</span>
                  <span className="text-xs text-sidebar-foreground/60">admin@example.com</span>
                </div>
              </div>
              <div className="flex justify-end">
                <ThemeToggle />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <ThemeToggle />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
