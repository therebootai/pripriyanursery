"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import OrderTracker from "./OrderTracker";
import { OrderType } from "@/types/types";
import { useCustomer } from "@/context/CustomerContext";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaRupeeSign } from "react-icons/fa";
export const STATUS_COLORS: Record<string, string> = {
  Processing: "bg-yellow-500",
  Confirmed: "bg-amber-600",
  Shipped: "bg-blue-500",
  InTransit: "bg-indigo-500",
  OutForDelivery: "bg-purple-500",
  Delivered: "bg-green-600",
  Cancelled: "bg-red-500",
  RTO: "bg-gray-700",
};

interface CancelModalState {
  isOpen: boolean;
  orderId: string;
  orderNumber: string;
  reason: string;
  isLoading: boolean;
}

export default function MyOrders() {
  const { customer, loading } = useCustomer();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] =
    useState<OrderType | null>(null);
  const [cancelModal, setCancelModal] = useState<CancelModalState>({
    isOpen: false,
    orderId: "",
    orderNumber: "",
    reason: "",
    isLoading: false,
  });
  const router = useRouter();
  useEffect(() => {
    if (!customer?._id) return;

    const fetchOrders = async () => {
      const res = await axios(
        `${process.env.NEXT_PUBLIC_API_URL}/order/customers/${customer._id}?page=${page}&limit=10`,
      );
      if (res.data.success) {
        setOrders(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      }
    };

    fetchOrders();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [customer, page]);

  const handleCancelOrder = async () => {
    if (!cancelModal.orderId || !cancelModal.reason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    setCancelModal((prev) => ({ ...prev, isLoading: true }));

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/order/${cancelModal.orderId}`,
        {
          status: "Cancelled",
          cancelReason: cancelModal.reason,
        },
      );

      if (res.data.success) {
        // Update local orders state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === cancelModal.orderId
              ? { ...order, status: "Cancelled" }
              : order,
          ),
        );

        toast.success("Order cancelled successfully");
        closeCancelModal();
      } else {
        throw new Error(res.data.message || "Failed to cancel order");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to cancel order";
      toast.error(errorMessage);
    } finally {
      setCancelModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Open cancel modal
  const openCancelModal = (orderId: string, orderNumber: string) => {
    setCancelModal({
      isOpen: true,
      orderId,
      orderNumber,
      reason: "",
      isLoading: false,
    });
  };

  // Close cancel modal
  const closeCancelModal = () => {
    setCancelModal({
      isOpen: false,
      orderId: "",
      orderNumber: "",
      reason: "",
      isLoading: false,
    });
  };

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

  const getPageNumbers = () => {
    const pages = [];
    const maxVisibleButtons = 5; // How many numbers to show at once

    if (totalPages <= maxVisibleButtons) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Complex logic for ellipsis (...)
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  if (loading && page === 1) {
    return (
      <div className="bg-white p-8 rounded-lg text-center text-gray-500 shadow-sm">
        Loading...
      </div>
    );
  }

  if (orders?.length === 0 && !isFetching) {
    return (
      <div className="bg-white p-8 rounded-lg text-center text-gray-500 shadow-sm">
        You have no orders yet
      </div>
    );
  }
  return (
    <div className="">
      {isFetching && (
        <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}

      {cancelModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cancel Order #{cancelModal.orderNumber}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for cancellation *
                </label>
                <textarea
                  value={cancelModal.reason}
                  onChange={(e) =>
                    setCancelModal((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Please provide a reason for cancellation..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeCancelModal}
                  disabled={cancelModal.isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelModal.isLoading || !cancelModal.reason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelModal.isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Cancelling...
                    </span>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {orders?.map((order) => {
        const isProductAvailable = Boolean(order.product?.slug);
        const stockStatus = Number(order.product?.status);
        const handleBuyNow = async (product: any, stockStatus: number) => {
          if (stockStatus === 0) {
            toast.error("This product is out of stock");
            return;
          }
          try {
            if (!customer) {
              toast.error("Please login to proceed");
              // setIsSignupOpen(true); // Ensure this state exists or use a context method
              return;
            }

            // ✅ STORE BUY NOW ITEM
            sessionStorage.setItem(
              "BUY_NOW_ITEM",
              JSON.stringify({
                productId: product,
                variantId: undefined,
                quantity: 1,
                price: product.price,
              }),
            );

            router.push("/checkout?mode=buy-now");
          } catch (err) {
            console.error(err);
            toast.error("Failed to proceed");
          }
        };
        return (
          <div
            key={order.orderId}
            className="border border-gray-200 rounded-md bg-white my-4"
          >
            {/* HEADER */}
            <div className="grid grid-cols-2 lg:grid-cols-4 items-start lg:items-center justify-between gap-4 p-4 bg-gray-100 text-sm">
              <div>
                <p className="text-gray-500">Order Placed</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toDateString()}
                </p>
              </div>

              <div className="text-right lg:text-left">
                <p className="text-gray-500">Total Amount</p>
                <p className="font-medium">
                  <FaRupeeSign className="inline" />
                  {order.orderValue.toFixed(0)}
                </p>
              </div>

              <div className="">
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
                  {order.status === "Processing" && (
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => openCancelModal(order._id, order.orderId)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ITEMS */}

            <div
              key={order.product?._id || ""}
              className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t border-gray-200"
            >
              <div className="md:w-[70%] w-full flex flex-col gap-3">
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
                <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full ">
                  <div className="md:flex items-center justify-center border border-gray-200 rounded-md w-full md:w-fit  ">
                    {order.product?.coverImage?.url ? (
                      <div className="  md:size-40 relative h-72 w-full">
                        <Image
                          src={order.product.coverImage.url}
                          alt={order.product?.name || ""}
                          fill
                          className="object-cover w-full h-full rounded-md  "
                        />
                      </div>
                    ) : (
                      <div className=" size-40 bg-gray-100 text-gray-300 text-center rounded-md flex justify-center items-center">
                        Image Unavailable
                      </div>
                    )}
                  </div>

                  <div className=" w-full">
                    <Link
                      href={`/product/${order.product?.slug}`}
                      className="font-medium text-gray-800 max-w-md"
                    >
                      {order.product?.name || "Product Unabailable"}
                    </Link>
                    <div className="flex gap-1 text-sm text-gray-600 mt-1 flex-wrap">
                      <p>{order.address?.area}</p>, <p>{order.address?.city}</p>
                      ,<p>{order.address?.state}</p>,
                      <p>Pin: {order.address?.pin}</p>
                    </div>
                    <div className=" flex flex-wrap gap-2">
                      {getVariantText(order) && (
                        <p className="text-sm text-gray-500 mt-1">
                          {getVariantText(order)}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        | Qty:{" "}
                        <span className="font-medium">{order.quantity}</span>
                      </p>
                    </div>

                    <div className="flex md:flex-row flex-col gap-3  mt-4 w-full">
                      {isProductAvailable ? (
                        <button
                          onClick={() =>
                            handleBuyNow(order.product, stockStatus)
                          }
                          disabled={stockStatus === 0}
                          className={`lg:px-6 lg:py-4 p-3 text-sm  lg:text-sm bg-green-600 text-white rounded hover:bg-green-700 w-full md:w-fit text-center ${
                            stockStatus === 0
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                        >
                          Buy Again
                        </button>
                      ) : (
                        <button
                          disabled
                          className="lg:px-6 lg:py-4 p-3 text-sm lg:text-sm bg-gray-200 text-gray-500 rounded w-full md:w-fit cursor-not-allowed"
                          title="Product no longer available"
                        >
                          Buy Again
                        </button>
                      )}

                      {isProductAvailable ? (
                        <Link
                          href={`/product/${order.product!.slug}`}
                          className="lg:px-6 lg:py-4 p-3 text-sm lg:text-sm bg-yellow-400 rounded hover:bg-yellow-500 w-full md:w-fit text-center"
                        >
                          View Your Item
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="lg:px-6 lg:py-4 p-3 text-sm lg:text-xs bg-gray-200 text-gray-500 rounded w-full md:w-fit cursor-not-allowed"
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
              <div className="flex flex-col gap-3 md:gap-2 w-full md:w-56">
                <button
                  className={`w-full md:px-4 md:py-2 p-3 text-sm bg-green-600 text-white rounded hover:bg-green-700 capitalize ${STATUS_COLORS[order.status]}`}
                >
                  {order.status}
                </button>
                <button
                  onClick={() => {
                    setSelectedOrderForTracking(order);
                    setTrackerOpen(true);
                  }}
                  className="w-full md:px-4 md:py-2 p-3 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Track Your Order
                </button>

                <button className="w-full md:px-4 md:py-2 p-3 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                  View Return / Replacement
                </button>

                {order.status === "Delivered" && (
                  <Link href={`/review?product=${order.product?.slug}`}>
                    <button className="w-full px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                      Write a Review
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 pb-4">
          {/* Previous Button */}
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum, idx) => (
              <button
                key={idx}
                disabled={pageNum === "..."}
                onClick={() => typeof pageNum === "number" && setPage(pageNum)}
                className={`
                  min-w-9 h-9 px-3 rounded-md text-sm font-medium transition-all
                  ${
                    pageNum === page
                      ? "bg-green-600 text-white shadow-md"
                      : pageNum === "..."
                        ? "text-gray-400 cursor-default"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                  }
                `}
              >
                {pageNum}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* TRACKER MODAL */}
      <OrderTracker
        open={trackerOpen}
        order={selectedOrderForTracking}
        onClose={() => {
          setTrackerOpen(false);
          setSelectedOrderForTracking(null);
        }}
      />
    </div>
  );
}
