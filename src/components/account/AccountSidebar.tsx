"use client";

import AccountProfile from "./AccountProfile";
import AccountMenu from "./AccountMenu";
import { useCustomer } from "@/context/CustomerContext";

type Props = {
  open: boolean;
  onToggle: () => void;
};

export default function AccountSidebar() {
  const {customer} = useCustomer();
  return (
    <aside className="w-full md:w-[300px] bg-white rounded-md p-1 lg:p-3 shadow-sm">     
      {/* Sidebar Content */}
      <div
        className={`transition-all duration-300 overflow-hidden
      `}
      >
        {/* Profile */}
        <AccountProfile
          name={customer?.name || "User"}
          image="/assets/images (3).jpeg"
        />

        {/* Menu (URL based) */}
        <AccountMenu />
      </div>
    </aside>
  );
}
