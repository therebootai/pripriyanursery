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
  const { customer, loading } = useCustomer();
  const [orders, setOrders] = useState<OrderType[]>([]);

  useEffect(() => {
    if (!customer?._id) return;

    const fetchOrders = async () => {
      const res = await axios(
        `${process.env.NEXT_PUBLIC_API_URL}/order/customers/${customer._id}`,
      );
      if (res.data.success) {
        setOrders(res.data.data);
      }
    };

    fetchOrders();
  }, [customer]);

  useEffect(() => {}, [orders]);

  // console.log("Orders:", orders);

  const getVariantText = (order: OrderType) => {
    const vars = order.product?.variables;
    if (!vars || vars.length === 0) return null;

    return vars.map((v) => `${v.name}: ${v.values.join(", ")}`).join(" | ");
  };

  const getStatusMessage = (order: OrderType) => {
    switch (order.status) {
      case "Processing":
        return {
          text: "Payment received. Your order is being prepared.",
          color: "text-orange-600",
        };

      case "Confirmed":
      case "Shipped":
        return {
          text: order.shipping?.expectedDeliveryDate
            ? `Expected delivery by ${order.shipping.expectedDeliveryDate}`
            : "Expected delivery date will be updated soon",
          color: "text-blue-600",
        };

      case "Delivered":
        return {
          text: order.shipping?.expectedDeliveryDate
            ? `Delivered on ${order.shipping.expectedDeliveryDate}`
            : "Delivered successfully",
          color: "text-green-600",
        };

      case "Cancelled":
        return {
          text: "This order has been cancelled",
          color: "text-red-600",
        };

      default:
        return {
          text: "Order status updated",
          color: "text-gray-500",
        };
    }
  };

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
      {orders?.map((order) => {
        const isProductAvailable = Boolean(order.product?.slug);
        return (
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
              key={order.product?._id || ""}
              className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t border-gray-200"
            >
              <div className="w-[70%] flex flex-col gap-3">
                {/* LEFT */}
                <div className=" flex flex-col gap-1">
                  {(() => {
                    const statusInfo = getStatusMessage(order);

                    return (
                      <p
                        className={`text-base  mt-2 font-semibold text-gray-500`}
                      >
                        {statusInfo.text}
                      </p>
                    );
                  })()}
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-4 ">
                  <div className=" w-auto">
                    <div className="flex items-center justify-center border border-gray-200 rounded-md size-[10rem] ">
                      {order.product?.coverImage?.url ? (
                        <Image
                          src={order.product.coverImage.url}
                          alt={order.product?.name || ""}
                          width={120}
                          height={120}
                          className="object-cover w-full h-full rounded-md  "
                        />
                      ) : (
                        <div className=" size-[10rem] bg-gray-100 text-gray-300 text-center rounded-md flex justify-center items-center">
                          Image Unavailable
                        </div>
                      )}
                    </div>
                  </div>

                  <div className=" w-full">
                    <p className="font-medium text-gray-800 max-w-md">
                      {order.product?.name || "Product Unabailable"}
                    </p>
                      <div className=" flex flex-wrap gap-2">
                    {getVariantText(order) && (
                      <p className="text-sm text-gray-500 mt-1">
                        {getVariantText(order)}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      | Qty: <span className="font-medium">{order.quantity}</span>
                    </p>
                    </div>

                    <div className="flex gap-3  mt-4 w-full">
                      {isProductAvailable ? (
                        <Link
                          href="/checkout"
                          className="lg:px-6 lg:py-4 p-2 text-xs lg:text-sm bg-green-600 text-white rounded hover:bg-green-700 w-fit text-center"
                        >
                          Buy Again
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="lg:px-6 lg:py-4 p-2 text-xs lg:text-sm bg-gray-200 text-gray-500 rounded w-fit cursor-not-allowed"
                          title="Product no longer available"
                        >
                          Buy Again
                        </button>
                      )}

                      {isProductAvailable ? (
                        <Link
                          href={`/product/${order.product!.slug}`}
                          className="lg:px-6 lg:py-4 p-2 text-xs lg:text-sm bg-yellow-400 rounded hover:bg-yellow-500 w-fit text-center"
                        >
                          View Your Item
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="lg:px-6 lg:py-4 p-2 text-xs lg:text-xs bg-gray-200 text-gray-500 rounded w-fit cursor-not-allowed"
                          title="Product no longer available"
                        >
                          Product Unavailable
                        </button>
                      )}
                    </div>
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
        );
      })}

      {/* TRACKER MODAL */}
      {/* <OrderTracker
        open={trackerOpen}
        status={trackStatus}
        onClose={() => setTrackerOpen(false)}
      /> */}
    </div>
  );
}
