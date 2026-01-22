"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AccountSidebar from "@/components/account/AccountSidebar";
import MainTemplates from "@/templates/MainTemplates";
import { useCustomer } from "@/context/CustomerContext";

export default function AccountShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { customer, loading } = useCustomer();
  const router = useRouter();

  // 🔐 Client-side auth protection
  useEffect(() => {
    if (!loading && !customer) {
      router.replace("/");
    }
  }, [loading, customer, router]);

  // ⏳ Prevent UI flicker
  if (loading || !customer) {
    return null; // or loader
  }

  return (
    <MainTemplates>
      <div className="bg-gray-50 min-h-screen  mx-auto max-w-[1200px] xl:max-w-[1300px] xxl:max-w-[1600px] xxxl:max-w-[1800px]  w-full">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <AccountSidebar />

          {/* Content */}
          <div className="flex-1 hidden md:block w-full">
            {children}
          </div>
        </div>
      </div>
    </MainTemplates>
  );
}
