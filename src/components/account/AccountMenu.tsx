"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  onItemClick?: () => void;
};



export default function AccountMenu({ onItemClick }: Props) {
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


  const itemClass = (href: string) =>
    `px-4 py-2 text-sm rounded cursor-pointer transition flex items-center
     ${
       pathname.startsWith(href)
         ? "bg-green-50 text-defined-green font-semibold"
         : "hover:bg-green-50 text-gray-700"
     }`;

  
  useEffect(() => {
    if (pathname.startsWith("/account")) {
      setOpen((prev) => ({ ...prev, account: true }));
    }
  }, [pathname]);

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
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={itemClass(item.href)}
              >
                {item.label}
              </Link>
            ))}           
          </ul>
        )}
      </div>


       <div className="rounded-md overflow-hidden ">
        <button
          onClick={() =>
            setOpen((prev) => ({ ...prev, orders: !prev.orders }))
          }
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
            {items.slice(2,6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={itemClass(item.href)}
              >
                {item.label}
              </Link>
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
          <ul className="bg-white">
            {items.slice(6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={itemClass(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}