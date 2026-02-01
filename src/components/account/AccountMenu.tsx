"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import AccountPageRenderer from "./AccountPageRenderer";

export default function AccountMenu() {
  const pathname = usePathname();

  const items = [
    { href: "/my-account", label: "My Account" },
    { href: "/manage-address", label: "Manage Address" },
    { href: "/my-orders", label: "My Orders" },
    { href: "/my-wishlist", label: "My Wishlist" },
    { href: "/my-cart", label: "My Cart" },
    { href: "/my-reviews", label: "My Reviews" },
    { href: "/upi", label: "UPI" },
    { href: "/card", label: "Card" },
    { href: "/net-banking", label: "Net Banking" },
  ];

  const [open, setOpen] = useState({
    orders: true,
    account: true,
    payments: true,
  });
  const [activePage, setActivePage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setActivePage(pathname);
    }
  }, [pathname, isMobile]);

  const itemClass = (href: string) => {
    const isActive = isMobile ? activePage === href : pathname.startsWith(href);

    return `px-4 py-2 text-sm rounded cursor-pointer transition flex items-center
    ${
      isActive
        ? "bg-green-50 text-defined-green font-semibold"
        : "hover:bg-green-50 text-gray-700"
    }`;
  };

  useEffect(() => {
    if (isMobile) {
      const index = items.findIndex((item) => pathname.startsWith(item.href));
      setOpen({
        account: index >= 0 && index < 2,
        orders: index >= 2 && index < 6,
        payments: index >= 6,
      });
    } else {
      setOpen({
        account: true,
        orders: true,
        payments: true,
      });
    }
  }, [pathname, isMobile]);

  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-md overflow-hidden ">
        <button
          onClick={() =>
            setOpen((prev) => ({ ...prev, account: !prev.account }))
          }
          className="w-full flex justify-between items-center px-4 py-3 bg-[#DAFFE4] text-defined-green font-semibold"
        >
          Account Settings
          <ChevronDown
            size={16}
            className={`transition-transform ${
              open.account ? "rotate-180" : ""
            }`}
          />
        </button>

        {open.account && (
          <ul className="bg-white text-gray-600">
            {items.slice(0, 2).map((item) => (
              <li key={item.href}>
                {/* Menu Row */}
                {!isMobile ? (
                  <Link href={item.href} className={itemClass(item.href)}>
                    {item.label}
                  </Link>
                ) : (
                  <div
                    onClick={() =>
                      setActivePage(activePage === item.href ? null : item.href)
                    }
                    className={itemClass(item.href) + " cursor-pointer"}
                  >
                    {item.label}
                  </div>
                )}

                {/* Mobile Inline Page */}
                {isMobile && activePage === item.href && (
                  <div
                    className="
      bg-gray-50
      mt-2
      rounded-md
      p-3
      max-h-[70vh]
      overflow-y-auto
      animate-slideDown
    "
                  >
                    <AccountPageRenderer route={item.href} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-md overflow-hidden ">
        <button
          onClick={() => setOpen((prev) => ({ ...prev, orders: !prev.orders }))}
          className="w-full flex justify-between items-center px-4 py-3 bg-[#DAFFE4] text-defined-green font-semibold"
        >
          Your Orders
          <ChevronDown
            size={16}
            className={`transition-transform ${
              open.orders ? "rotate-180" : ""
            }`}
          />
        </button>

        {open.orders && (
          <ul className="bg-white text-gray-600">
            {items.slice(2, 6).map((item) => (
              <li key={item.href}>
                {/* Menu Row */}
                {!isMobile ? (
                  <Link href={item.href} className={itemClass(item.href)}>
                    {item.label}
                  </Link>
                ) : (
                  <div
                    onClick={() =>
                      setActivePage(activePage === item.href ? null : item.href)
                    }
                    className={itemClass(item.href) + " cursor-pointer"}
                  >
                    {item.label}
                  </div>
                )}

                {/* Mobile Inline Page */}
                {isMobile && activePage === item.href && (
                  <div
                    className="
      bg-gray-50
      mt-2
      rounded-md
      p-3
      max-h-[70vh]
      overflow-y-auto
      animate-slideDown
    "
                  >
                    <AccountPageRenderer route={item.href} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-md overflow-hidden ">
        <button
          onClick={() =>
            setOpen((prev) => ({ ...prev, payments: !prev.payments }))
          }
          className="w-full flex justify-between items-center px-4 py-3 bg-[#DAFFE4] text-defined-green font-semibold"
        >
          Payments
          <ChevronDown
            size={16}
            className={`transition-transform ${
              open.payments ? "rotate-180" : ""
            }`}
          />
        </button>

        {open.payments && (
          <ul className="bg-white text-gray-600">
            {items.slice(6, 8).map((item) => (
              <li key={item.href}>
                {/* Menu Row */}
                {!isMobile ? (
                  <Link href={item.href} className={itemClass(item.href)}>
                    {item.label}
                  </Link>
                ) : (
                  <div
                    onClick={() =>
                      setActivePage(activePage === item.href ? null : item.href)
                    }
                    className={itemClass(item.href) + " cursor-pointer"}
                  >
                    {item.label}
                  </div>
                )}

                {/* Mobile Inline Page */}
                {isMobile && activePage === item.href && (
                  <div
                    className="
      bg-gray-50
      mt-2
      rounded-md
      p-3
      max-h-[70vh]
      overflow-y-auto
      animate-slideDown
    "
                  >
                    <AccountPageRenderer route={item.href} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
