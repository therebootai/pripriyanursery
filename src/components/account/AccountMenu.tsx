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

  const [open, setOpen] = useState({
    orders: true,
    account: true, // ✅ open by default
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
            <Link
              href="/account-info"
              onClick={onItemClick}
              className={itemClass("/account-info")}
            >
              Account Information
            </Link>

            <Link
              href="/manage-address"
              onClick={onItemClick}
              className={itemClass("/manage-address")}
            >
              Manage Address
            </Link>
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
            <Link
              href="/my-orders"
              onClick={onItemClick}
              className={itemClass("/my-orders")}

            >
              My Orders
            </Link>

            <Link
              href="/my-wishlist"
              onClick={onItemClick}
              className={itemClass("/my-wishlist")}
            >
              My Wishlist 
            </Link>

             <Link
              href="/my-cart"
              onClick={onItemClick}
              className={itemClass("/my-cart")}
            >
              My Cart
            </Link> 


             <Link
              href="/show-review"
              onClick={onItemClick}
              className={itemClass("/show-review")}
            >
              Review
            </Link> 
          </ul>
        )}
      </div>

      {/* ================= PAYMENTS ================= */}
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
            <li className="px-4 py-2 text-sm hover:bg-green-50 cursor-pointer">
              UPI
            </li>
            <li className="px-4 py-2 text-sm hover:bg-green-50 cursor-pointer">
              Cards
            </li>
            <li className="px-4 py-2 text-sm hover:bg-green-50 cursor-pointer">
              Net Banking
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
