"use client";

import useClickOutside from "@/hooks/useClickOutside";
import { OrderType } from "@/types/types";
import { X, Check } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  order?: OrderType | null;
};

export default function OrderTracker({ open, onClose, order }: Props) {
  if (!open || !order) return null;

  const modalRef = useClickOutside<HTMLDivElement>(() => {
    onClose();
  });

  const trackingHistory = order.shipping?.trackingHistory || [];
  const orderStatus = order.status;
  const createdAt = order.createdAt;
  const expectedDeliveryDate = order.shipping?.expectedDeliveryDate;

  // Define status progression based on order status
  const getStatusSteps = () => {
    const steps = [];
    const orderDate = new Date(createdAt);

    // Order Placed/Confirmed
    steps.push({
      title: "Order Confirmed",
      date: orderDate.toLocaleString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      desc: "Your order has been placed successfully",
      active: true,
      completed: true,
      status: "Confirmed",
    });

    // Check if we have tracking history entries
    const shippedEntry = trackingHistory.find(
      (entry: any) => entry.status === "Shipped" || entry.action === "Shipped",
    );
    const outForDeliveryEntry = trackingHistory.find(
      (entry: any) =>
        entry.status === "Out for Delivery" ||
        entry.action === "Out for Delivery",
    );
    const deliveredEntry = trackingHistory.find(
      (entry: any) =>
        entry.status === "Delivered" || entry.action === "Delivered",
    );

    // Shipped status
    if (shippedEntry) {
      steps.push({
        title: "Shipped",
        date: shippedEntry.timestamp
          ? new Date(shippedEntry.timestamp).toLocaleString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Shipping date pending",
        desc: shippedEntry.description || "Item has been shipped",
        active: true,
        completed: true,
        status: "Shipped",
      });
    } else {
      steps.push({
        title: "Shipped",
        date: "Pending",
        desc: "Item will be shipped soon",
        active: orderStatus === "Shipped" || orderStatus === "Delivered",
        completed: orderStatus === "Delivered",
        status: "Shipped",
      });
    }

    // Out for Delivery status
    if (outForDeliveryEntry) {
      steps.push({
        title: "Out for Delivery",
        date: outForDeliveryEntry.timestamp
          ? new Date(outForDeliveryEntry.timestamp).toLocaleString("en-US", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Date pending",
        desc: outForDeliveryEntry.description || "Arriving soon",
        active: true,
        completed: true,
        status: "Out for Delivery",
      });
    } else {
      steps.push({
        title: "Out for Delivery",
        date: expectedDeliveryDate
          ? `Expected by ${new Date(expectedDeliveryDate).toLocaleDateString(
              "en-US",
              {
                weekday: "short",
                day: "numeric",
                month: "short",
              },
            )}`
          : "Date will be updated soon",
        desc: "Will be out for delivery soon",
        active: orderStatus === "Delivered",
        completed: orderStatus === "Delivered",
        status: "Out for Delivery",
      });
    }

    // Delivered status
    if (deliveredEntry) {
      steps.push({
        title: "Delivered",
        date: deliveredEntry.timestamp
          ? new Date(deliveredEntry.timestamp).toLocaleString("en-US", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Delivery completed",
        desc: deliveredEntry.description || "Package delivered successfully",
        active: true,
        completed: true,
        status: "Delivered",
      });
    } else {
      steps.push({
        title: "Delivered",
        date: expectedDeliveryDate
          ? `Expected by ${new Date(expectedDeliveryDate).toLocaleDateString(
              "en-IN",
              {
                weekday: "short",
                day: "numeric",
                month: "short",
              },
            )}`
          : "Delivery date pending",
        desc: "Will be delivered to your address",
        active: orderStatus === "Delivered",
        completed: orderStatus === "Delivered",
        status: "Delivered",
      });
    }

    return steps;
  };

  const steps = getStatusSteps();

  return (
    <div className="fixed inset-0 z-1200 bg-black/50 flex items-center justify-center px-4">
      <div
        className="bg-white w-full max-w-md rounded-md shadow-lg relative"
        ref={modalRef}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h3 className="font-semibold text-gray-800">Order Tracking</h3>
            <p className="text-sm text-gray-500 mt-1">
              Order ID: {order.orderId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="text-gray-500" size={20} />
          </button>
        </div>

        {/* Current Status Summary */}
        {/* <div className="px-5 py-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Status</p>
              <p
                className={`font-semibold text-lg mt-1 ${
                  orderStatus === "Delivered"
                    ? "text-green-600"
                    : orderStatus === "Cancelled"
                      ? "text-red-600"
                      : "text-blue-600"
                }`}
              >
                {orderStatus}
              </p>
            </div>
            {expectedDeliveryDate && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Expected Delivery</p>
                <p className="font-semibold text-lg mt-1">
                  {new Date(expectedDeliveryDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        </div> */}

        {/* Timeline */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[10px] top-2 bottom-2 w-[2px] bg-gray-200" />

            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4 items-start relative">
                  {/* Dot */}
                  <div className="z-10 relative">
                    <div
                      className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${
                        step.completed
                          ? "bg-green-600 border-green-600"
                          : step.active
                            ? "border-green-600 bg-white"
                            : "border-gray-300 bg-white"
                      }
                    `}
                    >
                      {step.completed && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    {/* Connecting line between dots */}
                    {i < steps.length - 1 && (
                      <div
                        className={`
                        absolute left-1/2 top-5 w-0.5 h-8 -translate-x-1/2
                        ${steps[i + 1]?.completed ? "bg-green-600" : "bg-gray-200"}
                      `}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm font-medium ${
                          step.completed
                            ? "text-gray-800"
                            : step.active
                              ? "text-gray-700"
                              : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </p>
                      {step.status === orderStatus && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                    {step.desc && (
                      <p className="text-xs text-gray-600 mt-1">{step.desc}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t">
          {/* <p className="text-sm text-gray-600 mb-3">
            Need help with your order?
          </p> */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Close Tracking
          </button>
        </div>
      </div>
    </div>
  );
}
