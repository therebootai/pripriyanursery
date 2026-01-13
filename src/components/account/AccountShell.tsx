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
      <div className="bg-gray-50 min-h-screen px-4 md:px-8 lg:px-16 py-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <AccountSidebar
           
          />

          {/* Content */}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </MainTemplates>
  );
}
