import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Video,
  Users,
  Award,
  FileText,
  Bell,
  Settings,
  HelpCircle,
  ChevronDown,
  Menu,
  LayoutDashboard,
  Calendar,
  ChevronLeft,
  ChevronRight,
  PowerOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/student/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'My Courses',
    href: '/student/courses',
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    title: 'Live Classes',
    href: '/student/live-classes',
    icon: <Video className="h-5 w-5" />,
  },
  {
    title: 'Assignments',
    href: '/student/assignments',
    icon: <FileText className="h-5 w-5" />
  },
  {
    title: 'Community',
    href: '/student/community',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Certificates',
    href: '/student/certificates',
    icon: <Award className="h-5 w-5" />,
  }
];

const bottomNavItems: NavItem[] = [
  {
    title: 'Notifications',
    href: '/student/notifications',
    icon: <Bell className="h-5 w-5" />,
  },
  {
    title: 'Support',
    href: '/student/support',
    icon: <HelpCircle className="h-5 w-5" />,
  },
  {
    title: 'Logout',
    href: '/logout',
    icon: <PowerOff className="h-5 w-5 text-red-800" />,
  },
];

export function StudentDashboardLayout() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const location = useLocation();

  const toggleExpand = (title: string) => {
    if (isMobileView) {
      setExpandedItems(prev =>
        prev.includes(title)
          ? prev.filter(item => item !== title)
          : [...prev, title]
      );
    } else {
      // In desktop mode, only toggle if sidebar is expanded
      if(!isSidebarCollapsed) {
        setExpandedItems(prev =>
          prev.includes(title)
            ? prev.filter(item => item !== title)
            : [...prev, title]
        );
      }
    }
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.href;
    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div className="relative group">
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start",
            isActive && "bg-secondary",
            isSidebarCollapsed ? "p-2" : "px-3 py-2",
            "transition-all duration-300"
          )}
          onClick={() => hasChildren ? toggleExpand(item.title) : undefined}
          asChild={!hasChildren}
        >
          {hasChildren ? (
            <div className="flex items-center w-full">
              <div className="flex items-center justify-center min-w-[24px]">
                {item.icon}
              </div>
              {(!isSidebarCollapsed || isMobileView) && (
                <>
                  <span className="ml-2 flex-1">{item.title}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </>
              )}
            </div>
          ) : (
            <Link to={item.href} className="flex items-center w-full">
              <div className="flex items-center justify-center min-w-[24px]">
                {item.icon}
              </div>
              {(!isSidebarCollapsed || isMobileView) && <span className="ml-2">{item.title}</span>}
            </Link>
          )}
        </Button>

        {/* Tooltip for collapsed sidebar */}
        {isSidebarCollapsed && !isMobileView && (
          <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50">
            <div className="bg-secondary text-secondary-foreground px-3 py-2 rounded-md text-sm shadow-md whitespace-nowrap">
              {item.title}
              {hasChildren && isExpanded && (
                <div className="mt-1 space-y-1">
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      className={cn(
                        "block px-2 py-1 rounded-sm hover:bg-secondary/80",
                        location.pathname === child.href && "bg-secondary/80"
                      )}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dropdown items for expanded sidebar */}
        {hasChildren && isExpanded && (!isSidebarCollapsed || isMobileView) && (
          <div className="mt-1 ml-8 space-y-1">
            {item?.children?.map((child) => (
              <Button
                key={child.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-9",
                  location.pathname === child.href && "bg-secondary"
                )}
                asChild
              >
                <Link to={child.href}>{child.title}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const Sidebar = () => (
    <div className="flex h-full flex-col">
      <div className={cn(
        "flex items-center h-14 px-4 border-b",
        isSidebarCollapsed && !isMobileView ? "justify-center" : "justify-between"
      )}>
        {(!isSidebarCollapsed || isMobileView) && (
          <span className="text-xl font-bold truncate">CodeSpring</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={cn(
            "h-8 w-8",
            isMobileView && "hidden",
            !isSidebarCollapsed && "ml-auto"
          )}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>
      <div className="border-t py-4 px-2 space-y-1">
        {bottomNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden border-r bg-background lg:block transition-all duration-300",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <Sidebar />
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-14 border-b flex items-center px-4 sticky top-0 bg-background z-40">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="w-[280px] p-0"
              onOpenAutoFocus={(e) => {
                e.preventDefault();
                setIsMobileView(true);
              }}
              onCloseAutoFocus={() => setIsMobileView(false)}
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Access your dashboard navigation</SheetDescription>
              </SheetHeader>
              <div className="h-full">
                <Sidebar />
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-bold truncate">CodeSpring</span>
        </header>

        {/* Main Content */}
        <main className={cn(
          "flex-1 overflow-y-auto p-4 lg:p-6",
          "transition-all duration-300",
          isSidebarCollapsed ? "lg:ml-2" : "lg:ml-4"
        )}>
          <Outlet />
        </main>
      </div>
    </div>
  );
} 