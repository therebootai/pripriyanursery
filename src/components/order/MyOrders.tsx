"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import OrderTracker from "./OrderTracker";

type OrderItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  qty: number;
  href?: string;
};

type Order = {
  orderId: string;
  date: string;
  status: "Delivered" | "Processing" | "Cancelled";
  total: number;
  shipTo?: string;
  items: OrderItem[];
  href: string;
};

export default function MyOrders() {
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [trackStatus, setTrackStatus] =
    useState<Order["status"]>("Processing");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedOrders: Order[] = JSON.parse(
      localStorage.getItem("orders") || "[]"
    );
    setOrders(storedOrders);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg text-center text-gray-500 shadow-sm">
        You have no orders yet
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.orderId}
          className="border border-gray-200 rounded-md bg-white"
        >
          {/* HEADER */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-100 text-sm">
            <div>
              <p className="text-gray-500">Order Placed</p>
              <p className="font-medium">{order.date}</p>
            </div>

            <div>
              <p className="text-gray-500">Total Amount</p>
              <p className="font-medium">₹{order.total}</p>
            </div>

            <div>
              <p className="text-gray-500">Ship To</p>
              <p className="font-medium">
                {order.shipTo || "Customer"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-gray-500">
                Order ID:{" "}
                <span className="font-medium">{order.orderId}</span>
              </p>
              <div className="mt-1 space-x-2">
                <Link href="#" className="text-blue-600 hover:underline">
                  View Order Details
                </Link>
                <span>|</span>
                <Link href="#" className="text-blue-600 hover:underline">
                  Get Invoice
                </Link>
              </div>
            </div>
          </div>

          {/* ITEMS */}
          {order.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 p-4 border-t border-gray-200"
            >
              {/* LEFT */}
              <div className="flex gap-4">
              <div className="relative w-30 h-30 border border-gray-200 rounded overflow-hidden">
  <Image
    src={item.image}
    alt={item.name}
    fill
    className="object-cover"
  />
</div>


                <div>
                  <p className="font-medium text-gray-800 max-w-md">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Delivered on {order.date}
                  </p>
                  <p className="text-sm text-gray-500">
                    The package was handed over to the resident.
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                      Buy Again
                    </button>

                    {/* 🔧 ONLY FIX HERE */}
                    <Link
                      href={item.href || "#"}
                      className="px-4 py-2 text-sm bg-yellow-400 rounded hover:bg-yellow-500"
                    >
                      View Your Item
                    </Link>
                  </div>
                </div>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex flex-col gap-2 w-full md:w-56">
                <button
                  onClick={() => {
                    setTrackStatus(order.status);
                    setTrackerOpen(true);
                  }}
                  className="w-full px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Track Your Order
                </button>

                <button className="w-full px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                  Get Support
                </button>

                <button className="w-full px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                  View Return / Replacement
                </button>
                  
                  <Link href='/review'>
                <button className="w-full px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                  Write a Review
                </button>
                </Link>

              </div>
            </div>
          ))}
        </div>
      ))}

      {/* TRACKER MODAL */}
      <OrderTracker
        open={trackerOpen}
        status={trackStatus}
        onClose={() => setTrackerOpen(false)}
      />
    </div>
  );
}
