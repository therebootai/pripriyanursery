"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getCart, updateQty, removeItem } from "@/utils/cart";

export default function CartClient() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleQty = (id: number, qty: number) => {
    if (qty < 1) return;
    updateQty(id, qty);
    setCart(getCart());
  };

  const handleRemove = (id: number) => {
    removeItem(id);
    setCart(getCart());
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white p-6 rounded-md text-center text-gray-500">
        Your cart is empty
      </div>
    );
  }

  const total = cart.reduce(
    (acc, item) => acc + (item.price || 0) * item.qty,
    0
  );

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT: CART ITEMS */}
      <div className="lg:col-span-2 space-y-4">
        {cart
          .slice()
          .reverse()
          .map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-md p-4 gap-4"
            >
              {/* IMAGE + QTY */}
              <div className="flex flex-col items-center w-full md:w-40">
                <div className="relative w-full h-40 bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleQty(item.id, item.qty - 1)}
                    className="px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-4 py-1 border border-gray-200 mx-2">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => handleQty(item.id, item.qty + 1)}
                    className="px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* INFO */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-[18px]">
                    {item.name}
                  </h3>

                  {item.category && (
                    <p className="text-sm text-gray-500 pt-1">
                      Category: {item.category}
                    </p>
                  )}

                  <p className="text-sm text-gray-500 pt-1">
                    Color red, Size small
                  </p>

                  <p className="mt-2 font-bold text-green-600 text-lg">
                    ₹{item.price}
                    <span className="line-through text-gray-400 text-sm ml-3">
                      ₹{Math.round(item.price * 1.4)}
                    </span>
                      <span className=" text-define-green text-[13px] ml-2 font-normal ">
                   24% OFF 
                  </span>
                  </p>
                </div>

                <div className="flex gap-4 mt-3">
                  <button className="font-medium hover:text-define-green">
                    MOVE TO WISHLIST
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="font-medium hover:text-red-600"
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* RIGHT: PRICE DETAILS (STICKY) */}
      <div
        className="
          bg-white 
          border border-gray-200 
          rounded-md 
          p-4 
          h-fit
          sticky 
          top-24
          self-start
        "
      >
        <h3 className="font-semibold border-b border-gray-200 pb-2">
          PRICE DETAILS
        </h3>

        <div className="text-sm space-y-3 mt-3">
          <div className="flex justify-between">
            <span>
              Price ({cart.reduce((a, b) => a + b.qty, 0)} items)
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

        {/* <button className="mt-6 w-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600 py-2 text-white font-semibold hover:scale-[1.03] transition">
          Proceed To Checkout
        </button> */}

           <button
  onClick={() => window.location.href = "/checkout"}
  className="mt-6 w-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600 py-2 text-white font-semibold hover:scale-[1.03] transition"
>
  Proceed To Checkout
</button>


      </div>
    </div>
  );
}
