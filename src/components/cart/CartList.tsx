"use client";

import { useCustomer } from "@/context/CustomerContext";
import Image from "next/image";
import { addToCartApi, removeFromCartApi } from "@/library/cart";
import { ProductType } from "../product/ProductSection";
import { useRouter } from "next/navigation";

export interface CartItemProps {  
  productId: string | ProductType;
  variantId?: string | ProductType;
  quantity: number;
  priceAtTime: number;
}

export default function CartList() {
  const router = useRouter();
  const { customer, refreshCustomer} = useCustomer();
  const cart = customer?.cart ?? [];
  const customerId = customer?._id;

  const handleQty = async (item: CartItemProps, qty: number) => {
    if (!customerId || qty < 1) return;

    try {
      await addToCartApi(
        customerId,
        item.productId?._id || item.productId,
        item.variantId?._id || item.variantId,
        qty - item.quantity, // 🔥 delta logic
        item.priceAtTime
      );

      await refreshCustomer();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (item: CartItemProps) => {
    if (!customerId) return;

    try {
      await removeFromCartApi(
        customerId,
        item.productId?._id || item.productId,
        item.variantId?._id || item.variantId
      );

      await refreshCustomer();
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

  const getItemDiscount = (item: CartItemProps) => {
    const product = item.productId as ProductType;

    if (!product || !item.priceAtTime) return 0;

    return Math.round(
      ((item.priceAtTime - product.price) / item.priceAtTime) * 100
    );
  };


  const total = cart.reduce(
    (acc, item) => acc + (item.priceAtTime || 0) * item.quantity,
    0
  );

  return (
    <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Cart ({customer?.cart.length || 0})
          </h2>
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
                    src={(item.productId as ProductType).coverImage.url || ""}
                    alt={(item.productId as ProductType).name || ""}
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
                    {(item.productId as ProductType).name}
                  </h3>

                  <p className="mt-2 text-sm text-defined-black">
                    {(item.productId as ProductType).variables
                      ?.map((v) => `${v.name}: ${v.values.join(", ")}`)
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
                      ₹{(item.productId as ProductType).mrp}
                    </span>
                    <span className="text-define-green text-[13px] ml-2 font-normal">
                      {(item.productId as ProductType).discount}% OFF
                    </span>
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="font-bold hover:text-defined-green text-defined-black px-6 py-2">
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
      <div className="bg-white border border-gray-200 rounded-md p-4 h-fit sticky top-24">
        <h3 className="font-semibold border-b text-defined-black border-gray-200 pb-2">
          PRICE DETAILS
        </h3>

        <div className="text-sm space-y-3 mt-3 text-defined-black">
          <div className="flex justify-between">
            <span>
              Price ({customer?.cart.reduce((a, b) => a + b.quantity, 0)} items)
            </span>
            <span>₹{total}</span>
          </div>

          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span>Discount</span>
            <span>
              ₹
              {cart.reduce((total, item) => {
                const product = item.productId as ProductType;

                if (
                  typeof item.priceAtTime !== "number" ||
                  typeof product?.price !== "number"
                ) {
                  return total;
                }

                const discount =
                  (item.priceAtTime - product.price) * item.quantity;

                return discount > 0 ? total + discount : total;
              }, 0)}
            </span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Total Amount</span>
            <span>₹{total}</span>
          </div>
        </div>

        <button
          onClick={() => router.push("/checkout")}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600 py-2 text-white font-semibold hover:scale-[1.03] transition"
        >
          Proceed To Checkout
        </button>
      </div>
    </div>
  );
}
