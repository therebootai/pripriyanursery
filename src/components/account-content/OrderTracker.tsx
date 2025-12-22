"use client";

import { X, CheckCircle } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  status: "Delivered" | "Processing" | "Cancelled";
};

type Step = {
  title: string;
  date: string;
  desc?: string;
  active: boolean;
};

export default function OrderTracker({
  open,
  onClose,
  status,
}: Props) {
  if (!open) return null;

  const steps: Step[] = [
    {
      title: "Order Confirmed",
      date: "Tue, 9th Dec '25 · 6:03 PM",
      desc: "Your order has been placed",
      active: true,
    },
    {
      title: "Shipped",
      date: "Tue, 9th Dec '25 · 7:26 PM",
      desc: "Item picked by delivery partner",
      active: status !== "Cancelled",
    },
    {
      title: "Out For Delivery",
      date: "Sat, 13th Dec '25 · 7:55 AM",
      desc: "Arriving today",
      active:
        status === "Delivered" || status === "Processing",
    },
    {
      title: "Delivered",
      date: "Expected by Sun, 14th Dec",
      active: status === "Delivered",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-md shadow-lg relative">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 ">
          <h3 className="font-semibold text-gray-800">
            Order Tracking
          </h3>
          <button onClick={onClose}>
            <X className="text-gray-500" size={18} />
          </button>
        </div>

        {/* Timeline */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[10px] top-2 bottom-2 w-[2px] bg-gray-200" />

            <div className="space-y-6">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start relative"
                >
                  {/* Dot */}
                  <div className="z-10">
                    <CheckCircle
                      size={20}
                      className={
                        step.active
                          ? "text-green-600"
                          : "text-gray-300"
                      }
                      fill={
                        step.active ? "#16a34a" : "none"
                      }
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        step.active
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </p>

                    <p className="text-xs text-gray-500">
                      {step.date}
                    </p>

                    {step.desc && (
                      <p className="text-xs text-gray-600 mt-1">
                        {step.desc}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
       
      </div>
    </div>
  );
}
