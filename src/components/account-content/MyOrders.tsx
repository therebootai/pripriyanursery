"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import OrderTracker from './OrderTracker'

type OrderItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  qty: number;
  href:string;
};

type Order = {
  orderId: string;
  date: string;
  status: "Delivered" | "Processing" | "Cancelled";
  total: number;
  items: OrderItem[];
  href:string;
};

const statusColor = (status: Order["status"]) => {



  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Processing":
      return "bg-yellow-100 text-yellow-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
  }
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
      <div className="bg-white p-6 rounded-md text-center text-gray-500">
        You have no orders yet
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">
        My Orders
      </h2>

      {orders.map((order) => (
        <div
          key={order.orderId}
          className="bg-white rounded-md shadow-sm border border-gray-200"
        >
          {/* Order Header */}
          <div className="flex flex-wrap gap-4 justify-between p-4  bg-gray-50">
            <div>
              <p className="text-xs text-gray-500">ORDER ID</p>
              <p className="text-sm font-medium">{order.orderId}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">ORDER DATE</p>
              <p className="text-sm">{order.date}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">TOTAL</p>
              <p className="text-sm font-medium">₹{order.total}</p>
            </div>

            <span
              className={`h-fit px-3 py-1 text-xs rounded-full font-medium ${statusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          {/* Order Items */}
          <div className="divide-y">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 items-center"
              >
                <div className="relative h-16 w-16 rounded overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.qty}
                  </p>
                </div>

                <div className="text-sm font-semibold">
                  ₹{item.price}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 p-4 bg-gray-50">
            <Link
            //    href={`/product/${order.items[0].href}`}
            href='#'

              className="text-sm px-4 py-2 border rounded hover:bg-gray-100"
            >
              View Order
            </Link>

           <Link
  href="#"
  onClick={(e) => {
    e.preventDefault();
    setTrackStatus(order.status);
    setTrackerOpen(true);
  }}
  className="text-sm px-4 py-2 border rounded hover:bg-gray-100"
>
  Track Order
</Link>


            <Link
              href="#"
              className="text-sm px-4 py-2 border rounded hover:bg-gray-100"
            >
              Return & Replace
            </Link>

            <button className="text-sm px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Buy Again
            </button>
          </div>
        </div>
      ))}


      <OrderTracker
  open={trackerOpen}
  status={trackStatus}
  onClose={() => setTrackerOpen(false)}
/>

    </div>

    
  );
}
