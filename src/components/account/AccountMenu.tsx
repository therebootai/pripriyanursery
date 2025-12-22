"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { AccountSection } from "@/types/account";

type Props = {
  active: AccountSection;
  onChange: (section: AccountSection) => void;
};

export default function AccountMenu({ active, onChange }: Props) {
  const [open, setOpen] = useState({
    orders: true,
    account: true,
    payments: true,
  });

  const itemClass = (key: AccountSection) =>
    `px-4 py-2 text-sm cursor-pointer rounded transition
     ${
       active === key
         ? "bg-green-100 text-green-700 font-medium"
         : "hover:bg-green-50 text-gray-700"
     }`;

  return (
    <div className="mt-4 space-y-3">
      {/* YOUR ORDER */}
      <div className="rounded-md overflow-hidden ">
        <button
          onClick={() => setOpen({ ...open, orders: !open.orders })}
          className="w-full flex justify-between items-center px-4 py-3 bg-green-100 text-green-800 font-semibold"
        >
          Your Order
          <ChevronDown
            size={16}
            className={`transition ${
              open.orders ? "rotate-180" : ""
            }`}
          />
        </button>

        {open.orders && (
          <ul className="bg-white">
            <li
              onClick={() => onChange("orders")}
              className={itemClass("orders")}
            >
              My Orders
            </li>
            <li
              onClick={() => onChange("wishlist")}
              className={itemClass("wishlist")}
            >
              My Wishlist
            </li>
            <li
              onClick={() => onChange("cart")}
              className={itemClass("cart")}
            >
              My Cart
            </li>
          </ul>
        )}
      </div>

      {/* ACCOUNT SETTINGS */}
      <div className="rounded-md overflow-hidden">
        <button
          onClick={() => setOpen({ ...open, account: !open.account })}
          className="w-full flex justify-between items-center px-4 py-3 bg-green-200 text-green-900 font-semibold"
        >
          Account Settings
          <ChevronDown
            size={16}
            className={`transition ${
              open.account ? "rotate-180" : ""
            }`}
          />
        </button>

        {open.account && (
          <ul className="bg-white">
            <li
              onClick={() => onChange("account-info")}
              className={itemClass("account-info")}
            >
              Account Information
            </li>
            <li
              onClick={() => onChange("manage-address")}
              className={itemClass("manage-address")}
            >
              Manage Address
            </li>
          </ul>
        )}
      </div>

      {/* PAYMENTS */}
      <div className="rounded-md overflow-hidden ">
        <button
          onClick={() => setOpen({ ...open, payments: !open.payments })}
          className="w-full flex justify-between items-center px-4 py-3 bg-green-200 text-green-900 font-semibold"
        >
          Payments
          <ChevronDown
            size={16}
            className={`transition ${
              open.payments ? "rotate-180" : ""
            }`}
          />
        </button>

        {open.payments && (
          <ul className="bg-white">
            <li className="px-5 py-2 text-sm text-gray-700 hover:bg-green-50 cursor-pointer">
              UPI
            </li>
            <li className="px-5 py-2 text-sm text-gray-700 hover:bg-green-50 cursor-pointer">
              Cards
            </li>
            <li className="px-5 py-2 text-sm text-gray-700 hover:bg-green-50 cursor-pointer">
              Net Banking
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
