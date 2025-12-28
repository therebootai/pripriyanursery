"use client";

import Image from "next/image";
import { ShoppingCart, Heart,  } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductType } from "../product/ProductSection";
import { useCustomer } from "@/context/CustomerContext";
import axios from "axios";
import { Customer } from "@/library/api";
import { toggleWishlistApi } from "@/library/wishlist";
import { addToCartApi, removeFromCartApi } from "@/library/cart";



export default function ProductCards({
  id,
  name,
  price,
  coverImage,
  images,
  brand,
  longDescription,
  shortDescription,
  mrp,
  discount,
  // averageRating,
  // ratingCount,
  // ratingBreakdown,
  // image,
  // category,
  // tag,
  slug,
}: ProductType) {
  const { customer, setCustomer } = useCustomer();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const customerId = customer?._id;

const handleWishlist = async () => {
  if (!customerId || loading) return;

  setLoading(true);
  setIsWishlisted((prev) => !prev);

  try {
    const res = await toggleWishlistApi(customerId, id);

    // 🔥 Update global customer wishlist
    setCustomer((prev) =>
      prev
        ? {
            ...prev,
            wishlist: res.wishlist,
          }
        : prev
    );

  } catch (err) {
    setIsWishlisted((prev) => !prev);
  } finally {
    setLoading(false);
  }
};

const handleCart = async () => {
  if (!customerId || loading) return;

  setLoading(true);

  try {
    let res;

    if (isInCart) {
      res = await removeFromCartApi(customerId, id);
    } else {
      res = await addToCartApi(customerId, id, undefined, 1, price);
    }

    setCustomer((prev) =>
      prev
        ? {
            ...prev,
            cart: res.data,
          }
        : prev
    );

    setIsInCart(!isInCart);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (!customer || !customer.wishlist) return;

  const exists = customer.wishlist.some(
    (pid: any) => String(pid) === String(id)
  );

  setIsWishlisted(exists);
}, [customer, id]);

useEffect(() => {
  if (!customer || !customer.cart) return;

  const exists = customer.cart.some(
    (item: any) => String(item.productId?._id || item.productId) === String(id)
  );

  setIsInCart(exists);
}, [customer, id]);


  return (
    <div className="rounded bg-white p-4 shadow-sm hover:shadow-md">
      {/* IMAGE SECTION */}
      <div className="relative h-[180px] rounded bg-gray-100 overflow-hidden">
        {/* {tag && (
          <span className="absolute left-2 top-2 rounded-full bg-green-600 px-3 py-1 text-xs text-white">
            {tag}
          </span>
        )} */}

        <button
          onClick={handleWishlist}
          className="absolute right-2 top-2 z-10 rounded-full bg-white p-1 shadow"
        >
          <Heart
            size={18}
            className={`
              transition-all duration-300
              ${
                isWishlisted
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-gray-400"
              }
            `}
          />
        </button>

        <Image
          src={coverImage.url}
          alt={coverImage.public_id}
          fill
          className="object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="mt-4">
        {/* {category && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-green-600 text-xs">
            {category}
          </span>
        )} */}

        <h3 className="mt-2 font-semibold text-gray-900 line-clamp-1">
          {name}
        </h3>

        {price && <p className="mt-1 font-bold text-green-600">₹{price}</p>}

        {/* BUTTONS */}
        <div className="mt-4 flex justify-between items-center">
          <Link
            href={`/product/${slug}`}
            className="text-xs text-green-600 border rounded-full px-4 py-2 hover:bg-green-50"
          >
            More Info
          </Link>

          <button
            onClick={handleCart}
            disabled={isInCart}
            className={`
              group flex items-center justify-center gap-2
              text-xs sm:text-sm font-semibold
              px-4 sm:px-5 py-2
              rounded-full
              transition-all duration-300 ease-in-out
              ${
                isInCart
                  ? "bg-green-100 text-green-700 cursor-default shadow-inner"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/30 hover:shadow-lg hover:scale-[1.04] hover:from-emerald-600 hover:to-green-500 active:scale-95"
              }
            `}
          >
            {isInCart ? (
              <>
                <ShoppingCart
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
                <span>Go to Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
