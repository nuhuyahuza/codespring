import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  Users,
  Video,
  Award,
  Settings,
  HelpCircle,
  Bell,
  BarChart,
  FileText,
  Shield,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  children?: { title: string; href: string }[];
}

const studentNavItems: NavItem[] = [
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
    title: 'Certificates',
    href: '/dashboard/student/certificates',
    icon: <Award className="h-5 w-5" />,
  },
];

const instructorNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard/instructor',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Courses',
    href: '/dashboard/instructor/courses',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: 'Students',
    href: '/dashboard/instructor/students',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Analytics',
    href: '/dashboard/instructor/analytics',
    icon: <BarChart className="h-5 w-5" />,
  },
];

const adminNavItems: NavItem[] = [
  {
    title: 'Overview',
    href: '/admin',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Course Management',
    href: '/admin/courses',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: 'Feature Controls',
    href: '/admin/features',
    icon: <Shield className="h-5 w-5" />,
  },
];

const bottomNavItems: NavItem[] = [
  {
    title: 'Notifications',
    href: '/notifications',
    icon: <Bell className="h-5 w-5" />,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: 'Support',
    href: '/support',
    icon: <HelpCircle className="h-5 w-5" />,
  },
];

interface DashboardSidebarProps {
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();

  const getNavItems = () => {
    switch (role) {
      case 'STUDENT':
        return studentNavItems;
      case 'INSTRUCTOR':
        return instructorNavItems;
      case 'ADMIN':
        return adminNavItems;
      default:
        return [];
    }
  };

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
        {hasChildren && isExpanded && item.children && (
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

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex-1 space-y-2">
        {getNavItems().map((item) => (
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
} 