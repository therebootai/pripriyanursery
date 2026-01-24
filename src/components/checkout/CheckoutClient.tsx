"use client";

import Image from "next/image";
// import Link from "next/link";
import { useCustomer } from "@/context/CustomerContext";
import { addToCartApi, removeFromCartApi } from "@/library/cart";
import { AddressType, CartType, ProductType } from "@/types/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { logout } from "@/library/api";
import { CouponType } from "@/types/types";
import { toggleWishlistApi } from "@/library/wishlist";
import { IoMdSync } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import AddAddressModal from "../account-content/AddAddressModal";

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: () => void) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    contact?: string;
    email?: string;
  };
  notes?: Record<string, string>;
  theme?: { color?: string };
}

interface RazorpayWindow extends Window {
  Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}

async function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as unknown as RazorpayWindow).Razorpay) return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

export default function CheckoutClient() {
  const [availableCoupons, setAvailableCoupons] = useState<CouponType[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponType | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const [changeAccountMode, setChangeAccountMode] = useState(false);
  const [changeAddressMode, setChangeAddressMode] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const [showAddAddress, setShowAddAddress] = useState(false);
  const { customer, refreshCustomer } = useCustomer();

  const customerId = customer?._id;
  const [coupon, setCoupon] = useState("");

  const searchParams = useSearchParams();
  const checkoutMode = searchParams.get("mode");

  const addresses: any[] = customer?.addresses || [];
  const defaultAddress =
    addresses.find((a: any) => a.type?.toLowerCase() === "home") ||
    addresses[0];
  const selectedAddress =
    addresses.find((a: any) => a._id === selectedAddressId) || defaultAddress;

  const [checkoutItems, setCheckoutItems] = useState<CartType[]>([]);

  useEffect(() => {
    if (!customer) return;

    if (checkoutMode === "buy-now") {
      const stored = sessionStorage.getItem("BUY_NOW_ITEM");
      if (!stored) {
        setCheckoutItems([]);
        return;
      }
      const buyNowItem = JSON.parse(stored);
      setCheckoutItems([
        {
          productId: buyNowItem.productId,
          variantId: buyNowItem.variantId,
          quantity: buyNowItem.quantity,
          priceAtTime: buyNowItem.price,
        },
      ]);
    } else if (checkoutMode === "cart") {
      // Get available items from URL params
      const itemsParam = searchParams.get("items");
      if (itemsParam) {
        const parsedItems = JSON.parse(decodeURIComponent(itemsParam));

        // Filter out only available items with stock check
        const availableItems: CartType[] = parsedItems
          .map((itemData: any) => {
            const product = ((customer.cart as CartType[]) || []).find(
              (cartItem) => cartItem.productId._id === itemData.productId,
            );
            if (!product) return null;

            const stock = (product.productId as ProductType).stock || 0;
            if (stock === 0 || itemData.quantity > stock) return null;

            return {
              productId: product.productId,
              variantId: product.variantId,
              quantity: itemData.quantity,
              priceAtTime: itemData.priceAtTime,
            };
          })
          .filter(Boolean) as CartType[];

        setCheckoutItems(availableItems);
        return;
      }

      // Fallback to full cart (but filter out-of-stock)
      const availableCartItems = ((customer.cart as CartType[]) || []).filter(
        (item) => {
          const stock = (item.productId as ProductType).stock || 0;
          return stock > 0 && item.quantity <= stock;
        },
      );
      setCheckoutItems(availableCartItems);
    }
  }, [checkoutMode, customer, searchParams]);

  const removeBuyNowItemFromCart = async () => {
    if (!customerId) return;

    const stored = sessionStorage.getItem("BUY_NOW_ITEM");
    if (!stored) return;

    const item = JSON.parse(stored);

    try {
      await removeFromCartApi(customerId, item.productId, item.variantId);

      sessionStorage.removeItem("BUY_NOW_ITEM");
      await refreshCustomer();
    } catch (err) {
      console.error("Failed to remove buy-now item from cart", err);
    }
  };

  const getStockStatus = (item: CartType): "available" | "low" | "out" => {
    const stock = (item.productId as ProductType).stock || 0;
    if (stock === 0) return "out";
    if (stock <= 3) return "low";
    return "available";
  };

  /* ------------------ TOTAL PRICE ------------------ */
  const availableCheckoutItems = checkoutItems.filter(
    (item) => getStockStatus(item) !== "out",
  );

  /* ================= MRP TOTAL ================= */
  const totalMRP = availableCheckoutItems.reduce((acc, item) => {
    const product = item.productId as ProductType;
    return acc + Math.round((product.mrp || 0) * item.quantity);
  }, 0);

  /* ================= DISCOUNT TOTAL ================= */
  const totalDiscount = availableCheckoutItems.reduce((acc, item) => {
    const product = item.productId as ProductType;
    const mrp = product.mrp || 0;
    const discountPercent = product.discount || 0;

    const discountPerItem = Math.round((mrp * discountPercent) / 100);
    return acc + discountPerItem * item.quantity;
  }, 0);

  /* ================= FINAL PRICE ================= */
  const totalFinalPrice = totalMRP - totalDiscount;

  /* ================= TOTAL ITEMS ================= */
  const totalItems = availableCheckoutItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
  const hasOutOfStockItems = checkoutItems.some(
    (item) => getStockStatus(item) === "out",
  );
  const totalAmount = availableCheckoutItems.reduce(
    (acc: number, item: CartType) =>
      acc + ((item.productId as ProductType).price || 0) * item.quantity,
    0,
  );

  const handlePayment = async () => {
    if (hasOutOfStockItems) {
      toast.error("Please remove out-of-stock items before payment");
      return;
    }
    try {
      await loadRazorpayScript();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/razorpay/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.max(totalFinalPrice - couponDiscount, 0),
            currency: "INR",
          }),
        },
      );

      const data = await res.json();

      if (!data.success) {
        alert("Failed to create Razorpay order");
        return;
      }

      const { order, key } = data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Pri Priya Nursery",
        description: "Order Payment",
        order_id: order.id,

        handler: async (response: RazorpayResponse) => {
          const verifyRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/order/razorpay/verify`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,

                customer: customerId,
                mobile: customer?.mobile,
                address: selectedAddress,
                items: checkoutItems.map((i: CartType) => ({
                  product: (i.productId as ProductType)._id,
                  quantity: i.quantity,
                  price: (i.productId as ProductType).price,
                })),

                couponCode: appliedCoupon?.code,
                couponDiscount: couponDiscount,
                orderValue: totalFinalPrice - couponDiscount,
              }),
            },
          );

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            toast.success("Payment successful & verified!");
            if (checkoutMode === "buy-now") {
              await removeBuyNowItemFromCart();
            }

            const paymentId = verifyData.paymentGroupId;
            const orderIds = verifyData.orders.join(",");
            router.push(`/thank-you?payment=${paymentId}&orders=${orderIds}`);
          } else {
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: customer?.name,
          contact: customer?.mobile,
        },

        theme: { color: "#16a34a" },
      };

      const razorpay = new (window as unknown as RazorpayWindow).Razorpay(
        options,
      );
      razorpay.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  /* ------------------ QTY HANDLER (delta logic) ------------------ */
const handleQtyById = (
  productId: string,
  variantId: string | undefined,
  qty: number,
) => {
  if (qty < 1) return;

  setCheckoutItems((prev) =>
    prev.map((item) => {
      const match =
        item.productId._id === productId &&
        item.variantId?._id === variantId;

      if (!match) return item;

      // ✅ STOCK VALIDATION
      const stock = (item.productId as ProductType).stock || 0;
      if (qty > stock) {
        toast.error(`Only ${stock} items available`);
        return item;
      }

      return { ...item, quantity: qty };
    }),
  );

  // ✅ BUY NOW: update sessionStorage
  if (checkoutMode === "buy-now") {
    const stored = sessionStorage.getItem("BUY_NOW_ITEM");
    if (stored) {
      const parsed = JSON.parse(stored);
      sessionStorage.setItem(
        "BUY_NOW_ITEM",
        JSON.stringify({ ...parsed, quantity: qty }),
      );
    }
  }
};


  const handleMoveToWishlist = async (item: CartType) => {
    if (!customerId) return;
    try {
      await toggleWishlistApi(customerId, (item.productId as ProductType)._id);
      await removeFromCartApi(
        customerId,
        (item.productId as ProductType)?._id,
        (item.variantId as ProductType)?._id,
      );
      await refreshCustomer();
      toast.success("Moved to wishlist");
    } catch (err) {
      console.error(err);
      toast.error("Failed to move to wishlist");
    }
  };
  /* ------------------ REMOVE ------------------ */
  const handleRemove = async (item: CartType) => {
    if (!customerId) return;

    await removeFromCartApi(
      customerId,
      item.productId._id,
      item.variantId?._id,
    );

    await refreshCustomer();
  };

  useEffect(() => {
    if (totalFinalPrice <= 0) return;

    const fetchCoupons = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupon`);
        const data = await res.json();

        setAvailableCoupons(data.coupons || []);
      } catch (err) {
        console.error("Failed to fetch coupons", err);
      }
    };

    fetchCoupons();
  }, [totalFinalPrice]);

  const handleLogoutAndRedirect = async () => {
    await logout();
    router.replace("/");
  };

  useEffect(() => {
    if (selectedAddress && !selectedAddressId) {
      setSelectedAddressId(selectedAddress._id);
    }
  }, [selectedAddress, selectedAddressId]);

  const handleCouponSelect = (c: CouponType) => {
    setCoupon(c.code);
    applyCoupon(c);
  };

  const applyCoupon = (found: CouponType) => {
    let discountAmount = 0;

    if (found.discountType === "percentage") {
      discountAmount = Math.round(
        (totalFinalPrice * found.discountValue) / 100,
      );
    } else {
      discountAmount = Math.round(found.discountValue);
    }

    if (found.maxDiscountAmount) {
      discountAmount = Math.min(discountAmount, found.maxDiscountAmount);
    }

    setAppliedCoupon(found);
    setCouponDiscount(discountAmount);
    setCouponMessage(`Coupon ${found.code} applied`);
  };

  const payableAmount = Math.max(
    Math.round(totalFinalPrice - couponDiscount),
    0,
  );

  useEffect(() => {
  const saved = sessionStorage.getItem("SELECTED_ADDRESS_ID");

  if (saved && addresses.some((a) => a._id === saved)) {
    setSelectedAddressId(saved);
  } else if (defaultAddress?._id) {
    setSelectedAddressId(defaultAddress._id);
  }
}, [addresses]);

  const handleApplyCoupon = () => {
    const found = availableCoupons.find(
      (c) => c.code.toLowerCase() === coupon.toLowerCase(),
    );

    if (!found) {
      setCouponMessage("Invalid or ineligible coupon");
      setCouponDiscount(0);
      setAppliedCoupon(null);
      return;
    }

    applyCoupon(found);
  };

  if (!checkoutItems.length) {
    return (
      <div className="bg-white p-6 rounded-md text-center text-gray-500">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="self-padding grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-2">
        <div className="flex flex-col text-defined-black bg-white rounded-md p-4">
          <div className="flex justify-between items-center">
            <p className="font-medium text-sm lg:text-base">Login</p>

            {!changeAccountMode ? (
              <button
                onClick={() => setChangeAccountMode(true)}
                className="text-defined-black flex flex-row gap-2 items-center text-xs lg:text-sm p-1 px-3 bg-defined-yellow  rounded"
              >
              <IoMdSync />  Change Account
              </button>
            ) : null}
          </div>

          {!changeAccountMode ? (
            <>
              <p className="font-semibold text-sm lg:text-base">
                {customer?.name}
              </p>
              <p className="text-xs lg:text-base">
                +{customer?.mobile} | {customer?.email}
              </p>
            </>
          ) : (
            <div className="mt-3 flex justify-between items-center">
              <button
                onClick={handleLogoutAndRedirect}
                className="text-red-500 lg:text-sm text-xs underline"
              >
                Logout & sign in to different account
              </button>

              <button
                onClick={() => setChangeAccountMode(false)}
                className="text-xs lg:text-base p-1 lg:p-2 bg-defined-green text-white rounded"
              >
                Continue Checkout
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col text-defined-black bg-white rounded-md p-4 mt-2">
          <div className="flex justify-between items-center">
            <p className="font-medium text-sm lg:text-base">
              Delivery Address 
            </p>

            {!changeAddressMode ? (
              <button
                onClick={() => setChangeAddressMode(true)}
                className="text-defined-black flex flex-row gap-2 items-center text-xs lg:text-sm p-1 px-3 bg-defined-yellow  rounded"
              >
               <IoMdSync /> Change Address
              </button>
            ) : (
               <button
                onClick={() => setShowAddAddress(true)}
                className="text-defined-black flex flex-row gap-2 items-center text-xs lg:text-sm p-1 px-3 bg-defined-yellow  rounded"
              >
               <FaPlus />
 Add New Address
              </button>
            )}


          </div>

          {/* DEFAULT VIEW */}
          {!changeAddressMode && selectedAddress && (
            <div className="mt-2 text-xs lg:text-base">
              <p className="font-semibold flex gap-2 items-center">
                {selectedAddress.name}
                <span className="bg-gray-200 text-gray-400 ml-1 px-1 text-xs">
                  {" "}
                  {selectedAddress.type.toLocaleUpperCase()}
                </span>{" "}
                +{selectedAddress.mobile}
              </p>
              <p>
                {selectedAddress.area}, {selectedAddress.city},{" "}
                {selectedAddress.state} – {selectedAddress.pin}
              </p>
            </div>
          )}

          {/* CHANGE MODE */}
          {changeAddressMode && (
            <div className="mt-3 space-y-3 text-xs lg:text-base">
              {addresses.map((address: any) => (
                <label
                  key={address._id}
                  className="flex gap-3 border border-gray-200 rounded-md p-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === address._id}
                   onChange={() => {
  setSelectedAddressId(address._id);
  sessionStorage.setItem("SELECTED_ADDRESS_ID", address._id);
}}
                    className="mt-1"
                  />

                  <div className="text-xs lg:text-base">
                    <p className="font-semibold">
                      {address.name} ({address.type})
                    </p>
                    <p>{address.addressLine}</p>
                    <p>
                      {address.city}, {address.state} – {address.pincode}
                    </p>
                    <p className="mt-1">Mobile: {address.mobile}</p>
                  </div>
                </label>
              ))}

              <div className="flex justify-end">
                <button
                    onClick={() => {
    if (selectedAddressId) {
      sessionStorage.setItem("SELECTED_ADDRESS_ID", selectedAddressId);
    }
    setChangeAddressMode(false);
  }}
                  className="text-xs lg:text-base p-1 lg:p-2 bg-defined-green text-white rounded"
                >
                  Deliver Here
                </button>
              </div>
            </div>
          )}
        </div>

        {checkoutItems
          .slice()
          .reverse()
          .map((item: CartType, index) => {
            const stockStatus = getStockStatus(item);
            const stock = (item.productId as ProductType).stock || 0;
            const isOutOfStock = stockStatus === "out";
            const canIncrease = item.quantity < stock;
                      const product = item.productId as ProductType;
          const linePrice = product.price * item.quantity; // Price × Qty
const lineMRP = product.mrp * item.quantity;

            return (
              <div
                key={item.productId._id}
                className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-md p-4 gap-4"
              >
                {/* IMAGE + QTY */}
                <div className="flex flex-col items-center w-full md:w-40">
                  <div className="relative w-full h-[18rem] md:h-40 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={item.productId.coverImage.url}
                      alt={item.productId.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="md:flex hidden items-center mt-2 ">
                    <button
                      onClick={() =>
                        handleQtyById(
                          item.productId._id,
                          item.variantId?._id,
                          item.quantity - 1,
                        )
                      }
                      className="px-4 py-2 border text-defined-black border-gray-200 rounded-full hover:bg-gray-100"
                    >
                      −
                    </button>

                    <span className="px-4 py-1 border text-defined-black border-gray-200 mx-2">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        handleQtyById(
                          item.productId._id,
                          item.variantId?._id,
                          item.quantity + 1,
                        )
                      }
                      className="px-4 py-2 border text-defined-black border-gray-200 rounded-full hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* INFO */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-[18px] text-defined-green">
                      {(item.productId as ProductType).name}
                    </h3>

                    <p className="text-sm text-gray-500 pt-1">
                      {(item.productId as ProductType).variables
                        ?.map((v: any) => `${v.name}: ${v.values.join(", ")}`)
                        .join(" | ")}
                    </p>

                    <p
                      className="mt-2 text-sm text-defined-black line-clamp-1"
                      dangerouslySetInnerHTML={{
                        __html: (item.productId as ProductType)
                          .shortDescription,
                      }}
                    ></p>

                    <p className="mt-2 font-bold text-green-600 text-lg">
                      ₹{linePrice.toFixed(0)}
                      <span className="line-through text-gray-400 text-sm ml-3">
                        ₹{lineMRP.toFixed(0)}
                      </span>
                      <span className="text-defined-green text-[13px] ml-2 font-normal">
                        {(item.productId as ProductType).discount}% OFF
                      </span>
                    </p>
                    {isOutOfStock ? (
                      <div className="mt-2 px-3 w-fit py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                        Out of Stock
                      </div>
                    ) : stockStatus === "low" ? (
                      <div className="mt-2 px-3 py-1 w-fit bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                        Only {stock} left
                      </div>
                    ) : null}
                  </div>

                  <div className="md:flex hidden gap-4 justify-evenly md:justify-start pt-4 lg:pt-0 md:pb-2 lg:pb-0">
                    <button
                    className="font-bold hover:text-defined-green text-defined-black text-sm lg:text-lg lg:px-6 lg:py-2 "
                    onClick={() => handleMoveToWishlist(item)}
                  >
                    MOVE TO WISHLIST
                  </button>
                  <button
                    onClick={() => handleRemove(item)}
                    className="font-semibold text-defined-black hover:text-red-500 text-sm lg:text-lg lg:px-6 lg:py-2"
                  >
                    REMOVE
                  </button>
                  </div>
                </div>

                 <div className="flex md:hidden items-center gap-4 mt-3 w-full">
                  {/* 1. QUANTITY BOX (Mobile Only as per your code) */}
                  <div className="flex lg:hidden items-center border border-gray-200 rounded-md overflow-hidden h-[40px]">
                    <button
                      onClick={() => handleQtyById(
                          item.productId._id,
                          item.variantId?._id,
                          item.quantity - 1,
                        )
                      }
                      className="px-2 h-full bg-gray-50 text-defined-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      disabled={item.quantity <= 1 || isOutOfStock}
                    >
                      −
                    </button>

                    <span className="px-3 h-full flex items-center justify-center text-sm font-semibold text-defined-black border-x border-gray-200 min-w-[40px]">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => handleQtyById(
                          item.productId._id,
                          item.variantId?._id,
                          item.quantity + 1,
                        )}
                      className={`px-2 h-full transition-colors ${
                        canIncrease && !isOutOfStock
                          ? "bg-gray-50 text-defined-black hover:bg-gray-200"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!canIncrease || isOutOfStock}
                    >
                      +
                    </button>
                  </div>

                  {/* 2. MOVE TO WISHLIST BOX */}
                  <button
                    className={`h-[40px]    text-xs font-bold tracking-wide uppercase transition-all duration-200 flex items-center justify-center
      ${
        isOutOfStock
          ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
          : "border-gray-300 text-defined-black hover:border-defined-green hover:text-defined-green hover:bg-green-50"
      }`}
                    onClick={() => handleMoveToWishlist(item)}
                    disabled={isOutOfStock}
                  >
                    MOVE TO WISHLIST
                  </button>

                  {/* 3. REMOVE BOX */}
                  <button
                    onClick={() => handleRemove(item)}
                    className={`h-[40px]   text-xs  font-bold tracking-wide uppercase transition-all duration-200 flex items-center justify-center
      ${
        isOutOfStock
          ? "border-gray-200 text-red-300"
          : "border-gray-300 text-defined-black hover:border-red-500 hover:text-red-600 hover:bg-red-50"
      }`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* RIGHT */}
      <div className="bg-white border border-gray-200 rounded-md p-4 h-fit sticky top-24 self-start">
        <div>
          <h3 className="font-semibold text-defined-black border-b border-gray-200 pb-2">
            Have a Coupon Code?
          </h3>

          <div className="flex items-center gap-3 mt-4">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 border text-defined-black placeholder:text-defined-black border-gray-200 rounded-full px-4 py-2 text-sm outline-none"
            />

            <button
              onClick={() => {
                if (appliedCoupon) {
                  setAppliedCoupon(null);
                  setCoupon("");
                  setCouponDiscount(0);
                  setCouponMessage("");
                } else {
                  handleApplyCoupon();
                }
              }}
              className={`rounded-full px-6 py-2 text-sm font-medium whitespace-nowrap transition
    ${
      appliedCoupon
        ? "border border-red-500 text-red-500 hover:bg-red-50"
        : "border border-green-500 text-defined-green hover:bg-green-50"
    }`}
            >
              {appliedCoupon ? "Remove" : "Apply"}
            </button>
          </div>
        </div>
        {availableCoupons.length > 0 && (
          <div className="relative mt-3">
            <div className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory custom-scroll py-2 gap-2">
              {availableCoupons
                .filter((c) => c.status !== false && c.usageLimit > 0)
                .map((c) => (
                  <div key={c.code} className="min-w-full snap-center px-1">
                    <button
                      onClick={() => handleCouponSelect(c)}
                      className="w-full border  flex flex-col gap-2 justify-between border-green-500 text-defined-green rounded-xl px-4 py-3 text-sm font-medium hover:bg-green-50 transition text-center"
                    >
                      <span>{c.name}</span>
                      {/* {c.code} */}
                      <span className="text-xs text-gray-500 ml-2">
                        Tap to apply
                      </span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="text-sm space-y-3 mt-5 text-defined-black">
          <h2 className="font-semibold text-lg">Order Summary</h2>

          <div className="flex justify-between">
            <span>Price ({totalItems} items)</span>
            <span>₹{totalMRP.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span className="text-green-600">
              -₹{totalDiscount.toLocaleString()}
            </span>
          </div>

          {couponDiscount > 0 && (
            <div className="flex justify-between">
              <span>Coupon Discount</span>
              <span className="text-green-600">
                -₹{couponDiscount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between font-semibold text-lg border-t border-gray-400 text-gray-700 pt-3">
            <span>Total Amount</span>
            <span>₹{payableAmount.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={
            hasOutOfStockItems || totalFinalPrice <= 0 || !selectedAddress
          }
          className={`mt-6 w-full rounded-full py-3 text-white font-semibold hover:scale-[1.03] transition-all duration-200 flex items-center justify-center ${
            hasOutOfStockItems || totalFinalPrice <= 0 || !selectedAddress
              ? "bg-gray-400 cursor-not-allowed from-gray-400 to-gray-500"
              : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          }`}
        >
          {hasOutOfStockItems ? (
            <>
              <span className="w-5 h-5 mr-2">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </span>
              Remove out-of-stock items to pay
            </>
          ) : totalFinalPrice <= 0 ? (
            "Empty Cart"
          ) : !selectedAddress ? (
            "Select Address First"
          ) : (
            `₹${Math.max(totalFinalPrice - couponDiscount, 0).toLocaleString()} Pay Now`
          )}
        </button>
      </div>
      {showAddAddress && (
  <AddAddressModal
    onClose={() => setShowAddAddress(false)}
    onSuccess={ async (newAddressId: string) => {
      // 🔥 THIS IS THE MAGIC
        await refreshCustomer();
      sessionStorage.setItem("SELECTED_ADDRESS_ID", newAddressId);
      setSelectedAddressId(newAddressId);
      setChangeAddressMode(false);
      setShowAddAddress(false);
    }}
  />
)}
    </div>
  );
}
