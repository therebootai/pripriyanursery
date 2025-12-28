"use client";

import { useCustomer } from "@/context/CustomerContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { addToCartApi, removeFromCartApi } from "@/library/cart";

export default function CartList() {
  const { customer, setCustomer } = useCustomer();
  const [cart, setCart] = useState<any[]>([]);

  const customerId = customer?._id;

  // 🔥 Sync cart from global customer (same as wishlist)
  useEffect(() => {
    if (customer?.cart) {
      setCart(customer.cart);
    }
  }, [customer]);

  // 🔼 / 🔽 Quantity update (uses same addToCart API)
  const handleQty = async (item: any, qty: number) => {
    if (!customerId || qty < 1) return;

    try {
      const res = await addToCartApi(
        customerId,
        item.productId._id || item.productId,
        item.variantId?._id || item.variantId,
        qty - item.quantity, // 🔥 delta logic
        item.priceAtTime
      );

      setCustomer((prev) =>
        prev
          ? {
              ...prev,
              cart: res.data,
            }
          : prev
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ Remove from cart
  const handleRemove = async (item: any) => {
    if (!customerId) return;

    try {
      const res = await removeFromCartApi(
        customerId,
        item.productId._id || item.productId,
        item.variantId?._id || item.variantId
      );

      setCustomer((prev) =>
        prev
          ? {
              ...prev,
              cart: res.data,
            }
          : prev
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="bg-white p-6 rounded-md text-center text-gray-500">
        Your cart is empty
      </div>
    );
  }

  const total = cart.reduce(
    (acc, item) => acc + (item.priceAtTime || 0) * item.quantity,
    0
  );

  return (
    <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-4">
        {cart
          .slice()
          .reverse()
          .map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-md p-4 gap-4"
            >
              {/* IMAGE + QTY */}
              <div className="flex flex-col items-center w-full md:w-40">
                <div className="relative w-full h-40 bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={item.productId.coverImage.url || ""}
                    alt={item.productId.name || ""}
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
                    className="px-4 py-2 border border-gray-200 text-defined-black rounded-full hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* INFO */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-[18px] text-defined-green">
                    {item.productId.name}
                  </h3>

                  <p className="mt-2 font-bold text-green-600 text-lg">
                    ₹{item.productId.price}
                    <span className="line-through text-gray-400 text-sm ml-3">
                      ₹{item.priceAtTime}
                    </span>
                    <span className="text-define-green text-[13px] ml-2 font-normal">
                      {item.productId.discount}% OFF
                    </span>
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="font-medium bg-defined-green text-white px-6 py-2 rounded">
                    MOVE TO WISHLIST
                  </button>

                  <button
                    onClick={() => handleRemove(item)}
                    className="font-medium text-white px-6 py-2 rounded bg-red-600"
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* RIGHT */}
      <div className="bg-white border border-gray-200 rounded-md p-4 h-fit sticky top-24">
        <h3 className="font-semibold border-b border-gray-200 pb-2">
          PRICE DETAILS
        </h3>

        <div className="text-sm space-y-3 mt-3">
          <div className="flex justify-between">
            <span>
              Price ({cart.reduce((a, b) => a + b.quantity, 0)} items)
            </span>
            <span>₹{total}</span>
          </div>

          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span>Discount</span>
            <span>₹120</span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Total Amount</span>
            <span>₹{Math.round(total - 120)}</span>
          </div>
        </div>

        <button
          onClick={() => (window.location.href = "/checkout")}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600 py-2 text-white font-semibold hover:scale-[1.03] transition"
        >
          Proceed To Checkout
        </button>
      </div>
    </div>
  );
}
