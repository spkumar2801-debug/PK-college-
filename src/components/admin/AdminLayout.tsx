import { type ReactNode } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";

interface AdminLayoutProps {
  children: ReactNode;
  sidebarOpen?: boolean | undefined;
  onToggleSidebar?: (() => void) | undefined;
  currentUserEmail?: string | undefined;
  onLogout?: (() => void) | undefined;
  isAuthenticated?: boolean | undefined;
  activeTabTitle?: string | undefined;
}

export function AdminLayout({
  children,
  sidebarOpen,
  onToggleSidebar,
  currentUserEmail,
  onLogout,
  isAuthenticated = false,
  activeTabTitle,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Dedicated Admin Header */}
      <AdminHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={onToggleSidebar}
        currentUserEmail={currentUserEmail}
        onLogout={onLogout}
        isAuthenticated={isAuthenticated}
        activeTabTitle={activeTabTitle}
      />

      {/* Main Admin Content Workspace */}
      <div className="flex-1 flex flex-col md:flex-row relative w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
