"use client";

import AccountProfile from "./AccountProfile";
import AccountMenu from "./AccountMenu";
import { Menu } from "lucide-react";
import { useCustomer } from "@/context/CustomerContext";

type Props = {
  open: boolean;
  onToggle: () => void;
};

export default function AccountSidebar({
  open,
  onToggle,
}: Props) {
  const {customer} = useCustomer();
  return (
    <aside className="w-full md:w-[300px] bg-white rounded-md p-3 shadow-sm">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden mb-2">
        <span className="font-medium text-gray-800">
          My Account
        </span>
        <button onClick={onToggle}>
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar Content */}
      <div
        className={`transition-all duration-300 overflow-hidden
        ${open ? "max-h-[1000px]" : "max-h-0 md:max-h-none"}`}
      >
        {/* Profile */}
        <AccountProfile
          name={customer?.name || "User"}
          image="/assets/images (3).jpeg"
        />

        {/* Menu (URL based) */}
        <AccountMenu onItemClick={onToggle} />
      </div>
    </aside>
  );
}
