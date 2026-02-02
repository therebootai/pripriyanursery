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

    // Standard flow of successful order
    const STATUS_FLOW = [
      {
        key: "Processing",
        title: "Order Processing",
        desc: "We are processing your order",
      },
      {
        key: "Confirmed",
        title: "Order Confirmed",
        desc: "Your order has been confirmed",
      },
      { key: "Shipped", title: "Shipped", desc: "Your item has been shipped" },
      {
        key: "InTransit",
        title: "In Transit",
        desc: "Your item is on the way",
      },
      {
        key: "OutForDelivery",
        title: "Out for Delivery",
        desc: "Your item is out for delivery",
      },
      {
        key: "Delivered",
        title: "Delivered",
        desc: "Item delivered successfully",
      },
    ];

    // Helper to format date
    const formatDate = (dateString?: string | Date) => {
      if (!dateString) return null;
      return new Date(dateString).toLocaleString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // Determine current step index in the standard flow
    let currentStepIndex = STATUS_FLOW.findIndex((s) => s.key === orderStatus);

    // If status is Cancelled or RTO, we need to find where it stopped
    const isCancelled = orderStatus === "Cancelled";
    const isRTO = orderStatus === "RTO";

    // For Cancelled/RTO, we'll determine active steps based on history or assume Confirmed/Processing
    if (isCancelled || isRTO) {
      // If it's cancelled/RTO, we usually show up to what happened + the cancelled/RTO step
      // For simplicity, if we have history, we use that.
      // We'll treat the standard flow as "completed" up to the point before failure.
      // But simplifying: just set currentStepIndex to -1 effectively, and rely on history matching or explicit logic?
      // Better strategy: Iterating flow. If we find history, mark complete.
    } else if (currentStepIndex === -1 && orderStatus === "Processing") {
      currentStepIndex = 0;
    }

    let flowStopped = false;

    // Iterate through standard flow
    for (let i = 0; i < STATUS_FLOW.length; i++) {
      const flowStep = STATUS_FLOW[i];

      // Find matching history entry
      // Match by status string or sometimes action
      const historyEntry = trackingHistory.find(
        (entry: any) =>
          entry.status === flowStep.key ||
          entry.status === flowStep.title ||
          entry.action === flowStep.key ||
          entry.action === flowStep.title,
      );

      // Special case for Processing/Confirmed which might not be in trackingHistory but are implied by order creation
      let stepDate = historyEntry
        ? formatDate(historyEntry.timestamp || historyEntry.date)
        : null;

      // If Processing/Confirmed and no history, use order creation date for the first steps
      if (!stepDate) {
        if (flowStep.key === "Processing") stepDate = formatDate(createdAt);
        if (flowStep.key === "Confirmed" && i <= currentStepIndex)
          stepDate = formatDate(createdAt); // Fallback
      }

      const isActive = currentStepIndex === i;
      const isCompleted = currentStepIndex > i || !!historyEntry;

      // If we hit Cancelled/RTO, we stop adding *future* standard steps?
      // Actually, we usually want to show the standard steps generated so far, plus the Cancelled/RTO step at the end.

      // Logic for successful flow (or steps leading up to failure)
      // If this step is legally part of the history or implied by current status:
      if (isCompleted || isActive || currentStepIndex >= i) {
        steps.push({
          title: flowStep.title,
          date: stepDate || (isActive ? "In Progress" : "Completed"),
          desc: historyEntry?.description || flowStep.desc,
          active: isActive,
          completed: isCompleted,
          status: flowStep.key,
        });
      } else {
        // For future steps in a non-cancelled order
        if (!isCancelled && !isRTO) {
          steps.push({
            title: flowStep.title,
            date: "Pending",
            desc: "Pending",
            active: false,
            completed: false,
            status: flowStep.key,
          });
        }
      }
    }

    // Append Cancelled or RTO if applicable
    if (isCancelled) {
      steps.push({
        title: "Cancelled",
        date: formatDate(order.updatedAt), // OR find in history
        desc: "Order has been cancelled",
        active: true,
        completed: true,
        status: "Cancelled",
        isError: true, // Flag to style differently
      });
    } else if (isRTO) {
      steps.push({
        title: "RTO (Return to Origin)",
        date: formatDate(order.updatedAt),
        desc: "Order is being returned to origin",
        active: true,
        completed: true,
        status: "RTO",
        isError: true,
      });
    }

    return steps;
  };

  const steps = getStatusSteps();

  return (
    <div className="fixed inset-0 z-9999 bg-black/50 flex items-center justify-center px-4">
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
                        step.isError
                          ? "bg-red-600 border-red-600"
                          : step.completed
                            ? "bg-green-600 border-green-600"
                            : step.active
                              ? "border-green-600 bg-white"
                              : "border-gray-300 bg-white"
                      }
                    `}
                    >
                      {step.completed && !step.isError && (
                        <Check size={12} className="text-white" />
                      )}
                      {step.isError && <X size={12} className="text-white" />}
                    </div>
                    {/* Connecting line between dots */}
                    {i < steps.length - 1 && (
                      <div
                        className={`
                        absolute left-1/2 top-5 w-0.5 h-8 -translate-x-1/2
                        ${
                          steps[i + 1]?.isError
                            ? "bg-red-600"
                            : steps[i + 1]?.completed
                              ? "bg-green-600"
                              : "bg-gray-200"
                        }
                      `}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm font-medium ${
                          step.isError
                            ? "text-red-700"
                            : step.completed
                              ? "text-gray-800"
                              : step.active
                                ? "text-gray-700"
                                : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </p>
                      {step.status === orderStatus && (
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${step.isError ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                        >
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
