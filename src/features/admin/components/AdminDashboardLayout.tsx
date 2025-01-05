import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Settings,
  BarChart,
  FileText,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AdminDashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  {
    name: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Course Management',
    href: '/admin/courses',
    icon: GraduationCap,
  },
  {
    name: 'Feature Controls',
    href: '/admin/features',
    icon: Shield,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart,
  },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: FileText,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  isActive && 'bg-secondary'
                )}
                onClick={() => router.push(item.href)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Overview of platform metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <StatsCard
                  title="Total Users"
                  value="1,234"
                  description="+12% from last month"
                  icon={Users}
                />
                <StatsCard
                  title="Active Courses"
                  value="56"
                  description="4 pending approval"
                  icon={GraduationCap}
                />
                <StatsCard
                  title="Revenue"
                  value="$12,345"
                  description="+8% from last month"
                  icon={BarChart}
                />
                <StatsCard
                  title="Active Sessions"
                  value="23"
                  description="12 scheduled today"
                  icon={Users}
                />
              </div>
            </CardContent>
          </Card>
          {children}
        </div>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
} 