"use client";

import { useState } from "react";
import { AccountSection } from "@/types/account";
import AccountSidebar from "@/components/account/AccountSidebar";

import MyOrders from "@/components/account-content/MyOrders";
import Wishlist from "@/components/wishlist/WishlistList";
import Cart from "@/components/cart/CartList";
import AccountInformation from "@/components/account-content/AccountInformation";
import ManageAddress from "@/components/account-content/ManageAddress";
import MainTemplates from "@/templates/MainTemplates";

export default function MyAccountPage() {
  const [active, setActive] =
    useState<AccountSection>("orders");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {

    switch (active) {
      case "orders":
        return <MyOrders />;
      case "wishlist":
        return <Wishlist />;
      case "cart":
        return <Cart />;
      case "account-info":
        return <AccountInformation />;
      case "manage-address":
        return <ManageAddress />;
      default:
        return null;
    }
  };

  return (
    <MainTemplates>

    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1300px] px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* TOP on mobile */}
        <AccountSidebar
          active={active}
          onChange={setActive}
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* BOTTOM on mobile */}
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>

    </MainTemplates>
  );
}
