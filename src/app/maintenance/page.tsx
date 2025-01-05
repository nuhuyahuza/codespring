import { Metadata } from 'next';
import { Settings, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Maintenance Mode - CodeSpring',
  description: 'CodeSpring is currently undergoing maintenance.',
};

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container flex max-w-[640px] flex-col items-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Settings className="h-10 w-10 animate-spin" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Under Maintenance
        </h1>
        <p className="text-lg text-muted-foreground">
          We're currently performing scheduled maintenance to improve your
          experience. We'll be back shortly.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-yellow-100 px-4 py-2 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
            <AlertTriangle className="h-4 w-4" />
            <span>Estimated downtime: 30 minutes</span>
          </div>
        </div>
        <div className="mt-8">
          <Link href="/">
            <Button variant="outline">
              Check Again
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 