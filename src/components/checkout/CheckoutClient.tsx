"use client";

import Image from "next/image";
import Link from "next/link";
import { useCustomer } from "@/context/CustomerContext";
import { addToCartApi, removeFromCartApi } from "@/library/cart";
import { ProductType } from "../product/ProductSection";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { logout } from "@/library/api";
import { CouponType } from "@/types/types";

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
    null
  );
  const router = useRouter();
  const { customer, refreshCustomer } = useCustomer();
  const cart = customer?.cart ?? [];
  const customerId = customer?._id;
  const [coupon, setCoupon] = useState("");

  const addresses = customer?.addresses || [];
const defaultAddress =
  addresses.find((a: any) => a.type === "home") || addresses[0];
const selectedAddress =
  addresses.find((a: any) => a._id === selectedAddressId) || defaultAddress;

  const handlePayment = async () => {
    try {
      await loadRazorpayScript();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/razorpay/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.max(total - couponDiscount, 0),
            currency: "INR",
          }),
        }
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
                items: cart.map((i) => ({
                  product: (i.productId as ProductType)._id,
                  quantity: i.quantity,
                })),
                couponCode: appliedCoupon?.code,
                couponDiscount: couponDiscount,
                orderValue: total - couponDiscount,
              }),
            }
          );

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
             toast.success("Payment successful & verified!");
             router.replace(`/thank-you?payment_id=${response.razorpay_payment_id}&order_id=${verifyData.orderId}`);            
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
         options
       );
       razorpay.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };


  /* ------------------ QTY HANDLER (delta logic) ------------------ */
  const handleQty = async (item: any, qty: number) => {
    if (!customerId || qty < 1) return;

    await addToCartApi(
      customerId,
      item.productId._id,
      item.variantId?._id,
      qty - item.quantity,
      item.priceAtTime
    );

    await refreshCustomer();
  };

  /* ------------------ REMOVE ------------------ */
  const handleRemove = async (item: any) => {
    if (!customerId) return;

    await removeFromCartApi(
      customerId,
      item.productId._id,
      item.variantId?._id
    );

    await refreshCustomer();
  };

  /* ------------------ TOTAL PRICE ------------------ */
  const total = cart.reduce(
    (acc, item) =>
      acc + ((item.productId as ProductType).price || 0) * item.quantity,
    0
  );

  useEffect(() => {
    if (total <= 0) return;

    const fetchCoupons = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupon`);
      const data = await res.json();
      console.log(data);
      const validCoupons = data.coupons.filter((c: CouponType) => {
        const now = new Date();
        return (
          total >= c.minOrderAmount &&
          new Date(c.startDate) <= now &&
          new Date(c.expirationDate) >= now &&
          c.usageLimit > 0
        );
      });

      setAvailableCoupons(validCoupons);
      console.log(validCoupons);
    };

    fetchCoupons();
  }, [total]);


  const handleLogoutAndRedirect = async () => {
    await logout();
    router.replace("/");
  };

  
  useEffect(() => {
    if (selectedAddress && !selectedAddressId) {
      setSelectedAddressId(selectedAddress._id);
    }
  }, [selectedAddress, selectedAddressId]);

  const handleApplyCoupon = () => {
    const found = availableCoupons.find(
      (c) => c.code.toLowerCase() === coupon.toLowerCase()
    );

    if (!found) {
      toast.error("Invalid or ineligible coupon");
      setCouponMessage("Invalid or ineligible coupon");
      setCouponDiscount(0);
      setAppliedCoupon(null);
      return;
    }

    let discountAmount = 0;

    if (found.discountType === "percentage") {
      discountAmount = (total * found.discountValue) / 100;
    } else {
      discountAmount = found.discountValue;
    }

    if (found.maxDiscountAmount) {
      discountAmount = Math.min(discountAmount, found.maxDiscountAmount);
    }

    setAppliedCoupon(found);
    setCouponDiscount(discountAmount);
    setCouponMessage(`Coupon "${found.code}" applied successfully`);
    toast.success(`Coupon "${found.code}" applied successfully`);
  };


  if (!cart.length) {
    return (
      <div className="bg-white p-6 rounded-md text-center text-gray-500">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-2">
        <div className="flex flex-col text-defined-black bg-white rounded-md p-4">
          <div className="flex justify-between items-center">
            <p className="font-medium">Login ✓</p>

            {!changeAccountMode ? (
              <button
                onClick={() => setChangeAccountMode(true)}
                className="text-white p-2 bg-defined-green rounded"
              >
                Change Account
              </button>
            ) : null}
          </div>

          {!changeAccountMode ? (
            <>
              <p className="font-semibold">{customer?.name}</p>
              <p>
                +{customer?.mobile} | {customer?.email}
              </p>
            </>
          ) : (
            <div className="mt-3 flex justify-between items-center">
              <button
                onClick={handleLogoutAndRedirect}
                className="text-red-500 text-sm underline"
              >
                Logout & sign in to different account
              </button>

              <button
                onClick={() => setChangeAccountMode(false)}
                className="px-4 py-2 bg-defined-green text-white rounded"
              >
                Continue Checkout
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col text-defined-black bg-white rounded-md p-4 mt-2">
          <div className="flex justify-between items-center">
            <p className="font-medium">Delivery Address ✓</p>

            {!changeAddressMode && (
              <button
                onClick={() => setChangeAddressMode(true)}
                className="text-white p-2 bg-defined-green rounded"
              >
                Change Address
              </button>
            )}
          </div>

          {/* DEFAULT VIEW */}
          {!changeAddressMode && selectedAddress && (
            <div className="mt-2 text-sm">
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
            <div className="mt-3 space-y-3">
              {addresses.map((address: any) => (
                <label
                  key={address._id}
                  className="flex gap-3 border border-gray-200 rounded-md p-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === address._id}
                    onChange={() => setSelectedAddressId(address._id)}
                    className="mt-1"
                  />

                  <div className="text-sm">
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
                  onClick={() => setChangeAddressMode(false)}
                  className="px-5 py-2 bg-defined-green text-white rounded"
                >
                  Deliver Here
                </button>
              </div>
            </div>
          )}
        </div>

        {cart
          .slice()
          .reverse()
          .map((item) => (
            <div
              key={(item.productId as ProductType).id}
              className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-md p-4 gap-4"
            >
              {/* IMAGE + QTY */}
              <div className="flex flex-col items-center w-full md:w-40">
                <div className="relative w-full h-40 bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={(item.productId as ProductType).coverImage.url}
                    alt={(item.productId as ProductType).name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleQty(item, item.quantity - 1)}
                    className="px-4 py-2 border text-defined-black border-gray-200 rounded-full hover:bg-gray-100"
                  >
                    −
                  </button>

                  <span className="px-4 py-1 border text-defined-black border-gray-200 mx-2">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => handleQty(item, item.quantity + 1)}
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
                    className="mt-2 text-sm text-defined-black"
                    dangerouslySetInnerHTML={{
                      __html: (item.productId as ProductType).shortDescription,
                    }}
                  ></p>

                  <p className="mt-2 font-bold text-green-600 text-lg">
                    ₹{(item.productId as ProductType).price}
                    <span className="line-through text-gray-400 text-sm ml-3">
                      ₹{item.priceAtTime}
                    </span>
                    <span className="text-defined-green text-[13px] ml-2 font-normal">
                      {(item.productId as ProductType).discount}% OFF
                    </span>
                  </p>
                </div>

                <div className="flex gap-4 md:mb-2 md:ml-[-5px] mt-2 md:mt-0">
                  <button className="font-bold hover:text-defined-green text-defined-black px-6 py-2 ">
                    MOVE TO WISHLIST
                  </button>
                  <button
                    onClick={() => handleRemove(item)}
                    className="font-semibold text-defined-black hover:text-red-500 px-6 py-2"
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* RIGHT */}
      <div className="bg-white border border-gray-200 rounded-md p-4 h-fit sticky top-24 self-start">
        {availableCoupons.length > 0 && (
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
                onClick={handleApplyCoupon}
                className="border border-green-500 text-defined-green rounded-full px-6 py-2 text-sm font-medium hover:bg-green-50 transition whitespace-nowrap"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        <div className="text-sm space-y-3 mt-5 text-defined-black">
          <h2 className="font-semibold text-lg">Order Summary</h2>
          <div className="flex justify-between">
            <span>
              Price ({cart.reduce((a, b) => a + b.quantity, 0)} items)
            </span>
            <span>₹{total}</span>
          </div>

          <div className="flex justify-between pb-3">
            <span>Discount</span>
            <span>₹{couponDiscount}</span>
          </div>

          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span>Coupon Code</span>
            <span>{coupon || "—"}</span>
          </div>
          {couponMessage !== "" && (
            <div className="border border-green-500 text-defined-green rounded-full px-6 py-2 text-sm font-medium whitespace-nowrap">
              {couponMessage}
            </div>
          )}

          <div className="flex justify-between font-semibold">
            <span>Total Amount</span>
            <span>₹{Math.max(total - couponDiscount, 0)}</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600 py-2 text-white font-semibold hover:scale-[1.03]"
        >
          ₹ Pay Now
        </button>
      </div>
    </div>
  );
}
