
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { Toaster } from "@/components/ui/sonner";

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-codespring-green-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
    </div>
  );
}
