
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, BookOpen, Video, FileText, Users, 
  BarChart, Settings, PlusCircle, Calendar, ChevronLeft, 
  ChevronRight, Menu, User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface InstructorSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function InstructorSidebar({ open, setOpen }: InstructorSidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const mainNavItems = [
    {
      title: "Dashboard",
      href: "/instructor/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Courses",
      href: "/instructor/courses",
      icon: BookOpen,
    },
    {
      title: "Live Classes",
      href: "/instructor/live-classes",
      icon: Video,
    },
    {
      title: "Assignments",
      href: "/instructor/assignments",
      icon: FileText,
    },
    {
      title: "Students",
      href: "/instructor/students",
      icon: Users,
    },
    {
      title: "Analytics",
      href: "/instructor/analytics",
      icon: BarChart,
    },
    {
      title: "Calendar",
      href: "/instructor/calendar",
      icon: Calendar,
    },
  ];

  const accountNavItems = [
    {
      title: "Profile",
      href: "/instructor/profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/instructor/settings",
      icon: Settings,
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
            {accountNavItems.map((item) => (
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

          {open && (
            <div className="px-2 mt-4">
              <Button className="w-full gap-2" asChild>
                <Link to="/instructor/courses/create">
                  <PlusCircle className="h-4 w-4" />
                  <span>Create Course</span>
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-sidebar-border mt-auto">
          {open ? (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">Prof. Emma Wilson</span>
                <span className="text-xs text-sidebar-foreground/60">instructor@example.com</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
