"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import OrderTracker from "./OrderTracker";
import { OrderType } from "@/types/types";
import { useCustomer } from "@/context/CustomerContext";
import axios from "axios";

export default function MyOrders() {
    // const [trackerOpen, setTrackerOpen] = useState(false);
    // const [trackStatus, setTrackStatus] =
    //   useState<Order["status"]>("Processing");
    const {customer, loading} = useCustomer();
  const [orders, setOrders] = useState<OrderType[]>([]);
useEffect(() => {
  if (!customer?._id) return;

  const fetchOrders = async () => {
    const res = await axios(
      `${process.env.NEXT_PUBLIC_API_URL}/order/customers/${customer._id}`
    );
    console.log("Fetched Orders Response:", res.data);
    if (res.data.success) {
      setOrders(res.data.data);
    }
  };

  fetchOrders();
}, [customer]);


  useEffect(() => {
    console.log("Orders:", orders);
  }, [orders]);
  // console.log("Orders:", orders);

  
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg text-center text-gray-500 shadow-sm">
        Loading...
      </div>
    );
  }

  if (orders?.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg text-center text-gray-500 shadow-sm">
        You have no orders yet
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {orders?.map((order) => (
        <div
          key={order.orderId}
          className="border border-gray-200 rounded-md bg-white"
        >
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 bg-gray-100 text-sm">
            <div>
              <p className="text-gray-500">Order Placed</p>
              <p className="font-medium">
                {new Date(order.createdAt).toDateString()}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Total Amount</p>
              <p className="font-medium">₹{order.orderValue}</p>
            </div>

            <div>
              <p className="text-gray-500">Ship To</p>
              <p className="font-medium">{customer?.name || ""}</p>
            </div>

            <div className="text-right">
              <p className="text-gray-500">
                Order ID: <span className="font-medium">{order.orderId}</span>
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

            <div
              key={order.product._id}
              className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t border-gray-200"
            >
              {/* LEFT */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
                <div className="flex items-center justify-center border border-gray-200 rounded ">
                  <Image
                    src={order.product.coverImage.url}
                    alt={order.product.name}
                    width={120}
                    height={120}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div>
                  <p className="font-medium text-gray-800 max-w-md">
                    {order.product.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Delivered on {order.shipping?.expectedDeliveryDate || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    The package was handed over to the resident.
                  </p>

                  <div className="flex gap-3 justify-evenly mt-4">
                    <Link
                      href="/checkout"
                      className="lg:px-4 lg:py-2 p-2 text-xs lg:text-sm bg-green-600 text-white rounded hover:bg-green-700 w-full text-center"
                    >
                      Buy Again
                    </Link>

                    <Link
                      href={`/product/${order.product.slug}`}
                      className="lg:px-4 lg:py-2 p-2 text-xs lg:text-sm  bg-yellow-400 rounded hover:bg-yellow-500 w-full text-center"
                    >
                      View Your Item
                    </Link>
                  </div>
                </div>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex flex-col gap-2 w-full md:w-56">
                <button
                  // onClick={() => {
                  //   setTrackStatus(order.status);
                  //   setTrackerOpen(true);
                  // }}
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

                <Link href="/review">
                  <button className="w-full px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                    Write a Review
                  </button>
                </Link>
              </div>
            </div>

        </div>
      ))}

      {/* TRACKER MODAL */}
      {/* <OrderTracker
        open={trackerOpen}
        status={trackStatus}
        onClose={() => setTrackerOpen(false)}
      /> */}
    </div>
  );
}
