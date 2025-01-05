import { Metadata } from 'next';
import { SystemSettings } from '@/features/admin/components/SystemSettings';
import { AdminDashboardLayout } from '@/features/admin/components/AdminDashboardLayout';
import { FeatureControls } from '@/features/admin/components/FeatureControls';
import { Analytics } from '@/features/admin/components/Analytics';
import { Reports } from '@/features/admin/components/Reports';

export const metadata: Metadata = {
  title: 'Admin Dashboard - CodeSpring',
  description: 'Manage your CodeSpring platform settings and monitor performance.',
};

export default function AdminDashboardPage() {
  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        <Analytics />
        <SystemSettings />
        <FeatureControls />
        <Reports />
      </div>
    </AdminDashboardLayout>
  );
} 