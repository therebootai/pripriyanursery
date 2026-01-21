"use client";

import { useCustomer } from "@/context/CustomerContext";
import Image from "next/image";
import { addToCartApi, removeFromCartApi } from "@/library/cart";
import { CartType, ProductType } from "@/types/types";
import { useRouter } from "next/navigation";
import { toggleWishlistApi } from "@/library/wishlist";
import toast from "react-hot-toast";
import { useMemo } from "react";

export interface CartItemProps {  
  productId: string | ProductType;
  variantId?: string | ProductType;
  quantity: number;
  priceAtTime: number;
}

export default function CartList() {
  const router = useRouter();
  const { customer, refreshCustomer} = useCustomer();
 const cart: CartType[] = (customer?.cart ?? []) as CartType[];
  const customerId = customer?._id;

  // Calculate stock status for each cart item
  const getStockStatus = (item: CartType): 'available' | 'low' | 'out' => {
    const stock = (item.productId as ProductType).stock || 0;
    if (stock === 0) return 'out';
    if (stock <= 3) return 'low';
    return 'available';
  };

  const handleQty = async (item: CartType, qty: number) => {
    if (!customerId || qty < 1) return;

    const stock = (item.productId as ProductType).stock || 0;
    const stockStatus = getStockStatus(item);

    // Block increase if exceeding stock
    if (qty > stock) {
      toast.error(`Only ${stock} products are in stock`);
      return;
    }

    try {
      await addToCartApi(
        customerId,
        (item.productId as ProductType)?._id,
        (item.variantId as ProductType)?._id,
        qty - item.quantity, // delta logic
        item.priceAtTime
      );
      await refreshCustomer();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (item: CartType) => {
    if (!customerId) return;

    try {
      await removeFromCartApi(
        customerId,
        (item.productId as ProductType)?._id,
        (item.variantId as ProductType)?._id
      );
      await refreshCustomer();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveToWishlist = async (item: CartType) => {
    if (!customerId) return;
    try {
      await toggleWishlistApi(customerId, (item.productId as ProductType)._id);
      await removeFromCartApi(
        customerId,
        (item.productId as ProductType)?._id,
        (item.variantId as ProductType)?._id
      );
      await refreshCustomer();
      toast.success("Moved to wishlist");
    } catch (err) {
      console.error(err);
      toast.error("Failed to move to wishlist");
    }
  };

  // Filter out out-of-stock items and calculate totals
const availableCartItems = (cart as CartType[]).filter((item) => {
  const status = getStockStatus(item);
  return status !== 'out';
});

const total = availableCartItems.reduce(
  (acc: number, item: CartType) => 
    acc + ((item.productId as ProductType).price || 0) * item.quantity,
  0
);



  // Replace the current total calculation with this:
const calculateItemPrice = (item: CartType): number => {
  const product = item.productId as ProductType;
  const mrp = product.mrp || 0;
  const discountPercent = product.discount || 0;
  const discountAmount = (mrp * discountPercent) / 100;
  return mrp - discountAmount; // Final price after discount
};

const totalMRP = availableCartItems.reduce((acc: number, item: CartType) => {
  const product = item.productId as ProductType;
  return acc + (product.mrp || 0) * item.quantity;
}, 0);

const totalDiscount = availableCartItems.reduce((acc: number, item: CartType) => {
  const product = item.productId as ProductType;
  const mrp = product.mrp || 0;
  const discountPercent = product.discount || 0;
  return acc + ((mrp * discountPercent) / 100) * item.quantity;
}, 0);

const totalFinalPrice = totalMRP - totalDiscount; // Same as current total

const totalItems = availableCartItems.reduce((a: number, b: CartType) => a + b.quantity, 0);

 
  const hasOutOfStockItems = cart.length > availableCartItems.length;

  if (!cart || cart.length === 0) {
    return (
      <div className="bg-white p-6 rounded-md text-center text-gray-500">
        Your cart is empty
      </div>
    );
  }

  // Handle checkout - only proceed with available items
  const handleCheckout = () => {
    if (availableCartItems.length === 0) {
      toast.error("No available items in cart");
      return;
    }
    router.push("/checkout?mode=cart");
  };

  
const reversedCart = useMemo(() => {
  return [...cart].reverse();
}, [cart]);

  return (
    <div className="self-padding grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Cart ({cart.length} items)
          </h2>
          {hasOutOfStockItems && (
            <p className="text-sm text-red-600 mt-1">
              ⚠️ Some items are out of stock and removed from checkout
            </p>
          )}
        </div>
        
        {reversedCart.map((item: CartType) => {
          const stockStatus = getStockStatus(item);
          const stock = (item.productId as ProductType).stock || 0;
          const isOutOfStock = stockStatus === 'out';
          const canIncrease = item.quantity < stock;

          return (
            <div
                key={`${(item.productId as ProductType)._id}-${(item.variantId as ProductType)?._id ?? "no-variant"}`}
              className={`flex flex-col md:flex-row bg-white border rounded-md p-4 gap-4 ${
                isOutOfStock ? 'border-red-200 bg-red-50' : 'border-gray-200'
              }`}
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

             

                <div className="flex items-center mt-3">
                  <button
                    onClick={() => handleQty(item, item.quantity - 1)}
                    className="px-4 py-2 border text-defined-black border-gray-200 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={item.quantity <= 1 || isOutOfStock}
                  >
                    −
                  </button>

                  <span className="px-4 py-1 border text-defined-black border-gray-200 mx-2 min-w-[40px] text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => handleQty(item, item.quantity + 1)}
                    className={`px-4 py-2 border rounded-full disabled:opacity-50 disabled:cursor-not-allowed ${
                      canIncrease && !isOutOfStock
                        ? 'border-gray-200 text-defined-black hover:bg-gray-100'
                        : 'border-gray-300 text-gray-400 bg-gray-50'
                    }`}
                    disabled={!canIncrease || isOutOfStock}
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
                      ?.map(
                        (v: { name: string; values: string[] }) =>
                          `${v.name}: ${v.values.join(", ")}`
                      )
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

                     {/* Stock Badge */}
                {isOutOfStock ? (
                  <div className="mt-2 px-3 w-fit py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">
                    Out of Stock
                  </div>
                ) : ("")}
                </div>

                <div className="flex gap-4 justify-evenly lg:justify-start pt-4">
                  <button
                    className={`font-bold text-sm lg:text-base lg:px-6 lg:py-2 ${
                      isOutOfStock 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'hover:text-defined-green text-defined-black'
                    }`}
                    onClick={() => handleMoveToWishlist(item)}
                    disabled={isOutOfStock}
                  >
                    MOVE TO WISHLIST
                  </button>

                  <button
                    onClick={() => handleRemove(item)}
                    className={`font-semibold text-sm lg:text-base lg:px-6 lg:py-2 ${
                      isOutOfStock ? 'text-red-400' : 'text-defined-black hover:text-red-500'
                    }`}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT - Updated for available items only */}
      <div className="bg-white border border-gray-200 rounded-md p-4 h-fit sticky top-24">
        <h3 className="font-semibold border-b text-defined-black border-gray-200 pb-2">
          PRICE DETAILS
        </h3>

        <div className="text-sm space-y-3 mt-3 text-defined-black">
          <div className="flex justify-between">
            <span>
              Price ({totalItems} available items)
            </span>
            <span>₹{totalMRP.toLocaleString()}</span>
          </div>

          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span>Discount</span>
            <span className="text-green-600">-₹{totalDiscount.toLocaleString()}</span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Total Amount</span>
            <span>₹{totalFinalPrice.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={availableCartItems.length === 0}
          className={`mt-6 w-full rounded-full py-2 font-semibold transition-all ${
            availableCartItems.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.03] text-white'
          }`}
        >
          {availableCartItems.length === 0 
            ? 'No Available Items' 
            : `Proceed To Checkout (${totalItems} items)`}
        </button>

        {hasOutOfStockItems && (
          <p className="text-xs text-red-600 mt-2 text-center">
            Out of stock items excluded from checkout
          </p>
        )}
      </div>
    </div>
  );
}
