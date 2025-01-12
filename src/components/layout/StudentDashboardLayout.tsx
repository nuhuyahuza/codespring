import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  X,
  LayoutDashboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
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
    href: '/dashboard/student',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'My Courses',
    href: '/dashboard/student/courses',
    icon: <BookOpen className="h-5 w-5" />,
    children: [
      { title: 'In Progress', href: '/dashboard/student/courses?status=in-progress' },
      { title: 'Completed', href: '/dashboard/student/courses?status=completed' },
    ],
  },
  {
    title: 'Live Classes',
    href: '/dashboard/student/live-classes',
    icon: <Video className="h-5 w-5" />,
  },
  {
    title: 'Assignments',
    href: '/dashboard/student/assignments',
    icon: <FileText className="h-5 w-5" />,
    children: [
      { title: 'Pending', href: '/dashboard/student/assignments?status=pending' },
      { title: 'Submitted', href: '/dashboard/student/assignments?status=submitted' },
    ],
  },
  {
    title: 'Community',
    href: '/dashboard/student/community',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Certificates',
    href: '/dashboard/student/certificates',
    icon: <Award className="h-5 w-5" />,
  },
];

const bottomNavItems: NavItem[] = [
  {
    title: 'Notifications',
    href: '/dashboard/student/notifications',
    icon: <Bell className="h-5 w-5" />,
  },
  {
    title: 'Settings',
    href: '/dashboard/student/settings',
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: 'Support',
    href: '/dashboard/student/support',
    icon: <HelpCircle className="h-5 w-5" />,
  },
];

export function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();

  const toggleExpand = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.href;
    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-2",
            isActive && "bg-secondary"
          )}
          onClick={() => hasChildren ? toggleExpand(item.title) : undefined}
          asChild={!hasChildren}
        >
          {hasChildren ? (
            <div className="flex items-center">
              {item.icon}
              <span className="flex-1">{item.title}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "rotate-180"
                )}
              />
            </div>
          ) : (
            <Link to={item.href}>
              {item.icon}
              <span>{item.title}</span>
            </Link>
          )}
        </Button>
        {hasChildren && isExpanded && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children.map((child) => (
              <Button
                key={child.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start pl-6",
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
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>
      <div className="space-y-2">
        {bottomNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r bg-background lg:block">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 