import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { StudentSidebar } from "@/components/navigation/student-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export function StudentDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 md:ml-[4.5rem]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
