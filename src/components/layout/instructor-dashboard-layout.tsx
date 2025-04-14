
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { InstructorSidebar } from "@/components/navigation/instructor-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export function InstructorDashboardLayout() {
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
    <div className="flex h-screen overflow-hidden bg-background">
      <InstructorSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 overflow-auto">
        <main className="flex-1 p-4 md:p-6 h-[calc(100vh-4rem)] overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
