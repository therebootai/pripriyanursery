"use client";

import { useCustomer } from "@/context/CustomerContext";
import Image from "next/image";
import { addToCartApi, removeFromCartApi } from "@/library/cart";
import { CartType, ProductType } from "@/types/types";
import { useRouter } from "next/navigation";
import { toggleWishlistApi } from "@/library/wishlist";
import toast from "react-hot-toast";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

export interface CartItemProps {
  productId: string | ProductType;
  variantId?: string | ProductType;
  quantity: number;
  priceAtTime: number;
}

export default function CartList() {
  const router = useRouter();
  const { customer, refreshCustomer } = useCustomer();

  const customerId = customer?._id;
  const [localCart, setLocalCart] = useState<CartType[]>([]);

  const hasInitialized = useRef(false);

  // Calculate stock status for each cart item
  const getStockStatus = (item: CartType): "available" | "low" | "out" => {
    const stock = (item.productId as ProductType).stock || 0;
    if (stock === 0) return "out";
    if (stock <= 3) return "low";
    return "available";
  };

useEffect(() => {
  if (!customer?._id) return;

  setLocalCart(customer.cart as CartType[]);
}, [customer?.cart]);



  const cart = localCart;

  useEffect(() => {
  if (!hasInitialized.current) return;
  localStorage.setItem("LOCAL_CART", JSON.stringify(localCart));
}, [localCart]);

  const handleQty = async (item: CartType, qty: number) => {
    if (!customerId || qty < 1) return;

    const stock = (item.productId as ProductType).stock || 0;
    const stockStatus = getStockStatus(item);

    // Block increase if exceeding stock
    if (qty > stock) {
      toast.error(`Only ${stock} products are in stock`);
      return;
    }

    setLocalCart((prev) =>
      prev.map((i) =>
        i.productId === item.productId && i.variantId === item.variantId
          ? { ...i, quantity: qty }
          : i,
      ),
    );

    try {
      await addToCartApi(
        customerId,
        (item.productId as ProductType)?._id,
        (item.variantId as ProductType)?._id,
        qty - item.quantity, // delta logic
        item.priceAtTime,
      );
      
      // await refreshCustomer();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (item: CartType) => {
    if (!customerId) return;

    const productId = (item.productId as ProductType)._id;
    const variantId = (item.variantId as ProductType)?._id;

    setLocalCart((prev) =>
      prev.filter(
        (i) =>
          !(
            (i.productId as ProductType)._id === productId &&
            (i.variantId as ProductType)?._id === variantId
          ),
      ),
    );

    try {
      await removeFromCartApi(customerId, productId, variantId);
      // await refreshCustomer();
    } catch (err) {
      toast.error("Failed to remove item");

      // rollback
      setLocalCart(customer?.cart as CartType[]);
    }
  };

  const handleMoveToWishlist = async (item: CartType) => {
    if (!customerId) return;
    const productId = (item.productId as ProductType)._id;
    const variantId = (item.variantId as ProductType)?._id;

    // ✅ Optimistic remove from cart
    setLocalCart((prev) =>
      prev.filter(
        (i) =>
          !(
            (i.productId as ProductType)._id === productId &&
            (i.variantId as ProductType)?._id === variantId
          ),
      ),
    );
    try {
      await toggleWishlistApi(customerId, productId);
      await removeFromCartApi(customerId, productId, variantId);
      toast.success("Moved to wishlist");
    } catch (err) {
      toast.error("Failed to move to wishlist");

      // rollback
      setLocalCart(customer?.cart as CartType[]);
    }
  };

  // Filter out out-of-stock items and calculate totals
  const availableCartItems = (cart as CartType[]).filter((item) => {
    const status = getStockStatus(item);
    return status !== "out";
  });

  const total = availableCartItems.reduce(
    (acc: number, item: CartType) =>
      acc + ((item.productId as ProductType).price || 0) * item.quantity,
    0,
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

  const totalDiscount = availableCartItems.reduce(
    (acc: number, item: CartType) => {
      const product = item.productId as ProductType;
      const mrp = product.mrp || 0;
      const discountPercent = product.discount || 0;
      return acc + ((mrp * discountPercent) / 100) * item.quantity;
    },
    0,
  );

  const totalFinalPrice = totalMRP - totalDiscount; // Same as current total

  const totalItems = availableCartItems.reduce(
    (a: number, b: CartType) => a + b.quantity,
    0,
  );

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

    const itemsToPass = availableCartItems.map((item) => ({
      productId: (item.productId as ProductType)._id,
      variantId: (item.variantId as ProductType)?._id,
      quantity: item.quantity, // This is the updated quantity from your localCart state
      priceAtTime: item.priceAtTime,
    }));

    // 2. Encode it into a string
    const encodedItems = encodeURIComponent(JSON.stringify(itemsToPass));
    router.push(`/checkout?mode=cart&items=${encodedItems}`);
  };

  // const reversedCart = useMemo(() => {
  //   return [...cart].reverse();
  // }, [cart]);

  

  const reversedCart = cart.slice().reverse();

  return (
    <div className=" grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          const isOutOfStock = stockStatus === "out";
          const canIncrease = item.quantity < stock;
          const product = item.productId as ProductType;
          const linePrice = product.price * item.quantity; // Price × Qty
const lineMRP = product.mrp * item.quantity;

          return (
            <div
              key={`${(item.productId as ProductType)._id}-${(item.variantId as ProductType)?._id ?? "no-variant"}`}
              className={`flex flex-col md:flex-row bg-white border rounded-md p-4 gap-4 ${
                isOutOfStock ? "border-red-200 bg-red-50" : "border-gray-200"
              }`}
            >
              {/* IMAGE + QTY */}
              <div className="flex flex-col items-center w-full md:w-40">
                <div className="relative w-full  h-[12rem] md:h-40 bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={(item.productId as ProductType).coverImage.url || ""}
                    alt={(item.productId as ProductType).name || ""}
                    fill
                    className="object-cover h-full w-full"
                  />
                </div>

                <div className="md:flex hidden items-center mt-3">
                  <button
                    onClick={() => handleQty(item, item.quantity - 1)}
                    className="size-[2rem] border text-defined-black border-gray-200 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={item.quantity <= 1 || isOutOfStock}
                  >
                    −
                  </button>

                  <span className=" h-[2rem] w-fit px-4 flex justify-center items-center border text-defined-black border-gray-200 mx-2 min-w-[40px] text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => handleQty(item, item.quantity + 1)}
                    className={`size-[2rem] border rounded-full disabled:opacity-50 disabled:cursor-not-allowed ${
                      canIncrease && !isOutOfStock
                        ? "border-gray-200 text-defined-black hover:bg-gray-100"
                        : "border-gray-300 text-gray-400 bg-gray-50"
                    }`}
                    disabled={!canIncrease || isOutOfStock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* INFO */}
              <div className="flex-1 flex flex-col justify-between">
                <Link href={`/product/${(item.productId as ProductType).slug}`}>
                  <h3 className="font-semibold text-[18px] text-defined-green">
                    {(item.productId as ProductType).name}
                  </h3>

                  <p className="mt-2 text-sm text-defined-black">
                    {(item.productId as ProductType).variables
                      ?.map(
                        (v: { name: string; values: string[] }) =>
                          `${v.name}: ${v.values.join(", ")}`,
                      )
                      .join(" | ")}
                  </p>

                  <p
                    className="mt-2 text-sm text-defined-black line-clamp-1"
                    dangerouslySetInnerHTML={{
                      __html: (item.productId as ProductType).shortDescription,
                    }}
                  ></p>

                  <p className="mt-2 font-bold text-green-600 text-lg">
                    ₹{linePrice.toFixed(0)}
                    <span className="line-through text-gray-400 text-sm ml-3">
                      ₹{lineMRP.toFixed(0)}
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
                  ) : (
                    ""
                  )}
                </Link>

                <div className="md:flex hidden gap-2 lg:gap-4 lg:justify-evenly items-center lg:justify-start md:pb-1 max-lg:mt-3">
                  <button
                    className={`font-bold text-sm lg:text-base  ${
                      isOutOfStock
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:text-defined-green text-defined-black"
                    }`}
                    onClick={() => handleMoveToWishlist(item)}
                    disabled={isOutOfStock}
                  >
                    MOVE TO WISHLIST
                  </button>

                  <button
                    onClick={() => handleRemove(item)}
                    className={`font-semibold text-sm lg:text-base  ${
                      isOutOfStock
                        ? "text-red-400"
                        : "text-defined-black hover:text-red-500"
                    }`}
                  >
                    REMOVE
                  </button>
                </div>
                <div className="flex md:hidden items-center gap-4 mt-3 w-full">
                  {/* 1. QUANTITY BOX (Mobile Only as per your code) */}
                  <div className="flex lg:hidden items-center border border-gray-200 rounded-md overflow-hidden h-[40px]">
                    <button
                      onClick={() => handleQty(item, item.quantity - 1)}
                      className="px-2 h-full bg-gray-50 text-defined-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      disabled={item.quantity <= 1 || isOutOfStock}
                    >
                      −
                    </button>

                    <span className="px-3 h-full flex items-center justify-center text-sm font-semibold text-defined-black border-x border-gray-200 min-w-[40px]">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => handleQty(item, item.quantity + 1)}
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
            <span>Price ({totalItems} available items)</span>
            <span>₹{totalMRP.toFixed(0)}</span>
          </div>

          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span>Discount</span>
            <span className="text-green-600">
              -₹{totalDiscount.toFixed(0)}
            </span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Total Amount</span>
            <span>₹{totalFinalPrice.toFixed(0)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={availableCartItems.length === 0}
          className={`mt-6 w-full rounded-full py-2 h-[3rem] text-sm font-semibold transition-all ${
            availableCartItems.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.03] text-white"
          }`}
        >
          {availableCartItems.length === 0
            ? "No Available Items"
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
