"use client";

import { useState } from "react";
import AccountSidebar from "@/components/account/AccountSidebar";
import MainTemplates from "@/templates/MainTemplates";

export default function AccountShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <MainTemplates>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-[1300px] px-4 py-6 flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <AccountSidebar
            open={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />

          {/* Content */}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </MainTemplates>
  );
}
