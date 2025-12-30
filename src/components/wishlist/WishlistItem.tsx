"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingCart } from "lucide-react";
import { ProductType } from "../product/ProductSection";
import { toggleWishlistApi } from "@/library/wishlist";
import { useCustomer } from "@/context/CustomerContext";
import { useEffect, useState } from "react";

export default function WishlistItem({ id, name, price, mrp, discount, coverImage, variables, slug }: ProductType) {

   const { customer, refreshCustomer} = useCustomer();
   const customerId = customer?._id;
    const [loading, setLoading] = useState(false);
    console.log(name)

  const handleWishlist = async () => {
    if (!customerId || loading) return;
  
    setLoading(true);

  
    try {
      await toggleWishlistApi(customerId, id);
  
     await refreshCustomer();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between bg-white rounded-lg p-4 shadow-sm">
      {/* LEFT: Image + Details */}
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        {/* Image */}
        <div className="relative h-36 w-full sm:h-40 sm:w-40 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
          <Image
            src={coverImage?.url}
            alt={coverImage?.public_id}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between sm:h-40 w-full">
          {/* Top content */}
          <div>
            <h4 className="text-base sm:text-lg md:text-xl font-medium text-gray-800 leading-snug">
              {name}
            </h4>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {variables?.map((v) => v.name).join(", ")}
            </p>

            {price && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                  ₹{price}
                </span>
                <span className="line-through text-gray-500 text-xs sm:text-sm">
                  ₹{mrp}
                </span>
                <span className="text-xs text-green-600 font-medium">
                  {discount}% OFF
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <button
            className="
              mt-3 sm:mt-auto flex items-center justify-center gap-2
              text-white font-semibold
              text-xs sm:text-sm md:text-[15px]
              px-3 py-1.5 sm:px-4 sm:py-2 md:px-5
              rounded-full
              bg-gradient-to-r from-green-500 to-emerald-600
              shadow-md shadow-green-500/30
              transition-all duration-300
              hover:from-emerald-600 hover:to-green-500
              hover:shadow-lg hover:scale-[1.03]
              active:scale-95
              w-full sm:w-fit
            "
          >
            <ShoppingCart size={14} className="sm:size-[16px]" />
            <span className="whitespace-nowrap">Add to Cart</span>
          </button>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 justify-between lg:justify-center">
        <Link
          href={`/product/${slug}`}
          className="
            inline-flex items-center justify-center
            text-xs sm:text-sm
            font-medium
            text-gray-800
            px-3 py-1.5 sm:px-4 sm:py-2
            rounded-full
            bg-gray-100
            border border-gray-200
            transition-all duration-300
            hover:bg-gray-200 hover:border-gray-300
            hover:shadow-sm
            active:scale-95
            w-full lg:w-auto
          "
        >
          View Item
        </Link>

        <button
          className="
    inline-flex items-center justify-center gap-1
    text-xs sm:text-sm
    font-medium
    text-red-600
    px-3 py-1.5 sm:px-4 sm:py-2
    rounded-full
    bg-red-50
    border border-red-200
    transition-all duration-300 ease-in-out
    hover:bg-red-100 hover:border-red-300
    hover:text-red-700
    hover:shadow-sm
    active:scale-95
    w-full lg:w-auto
  "
          // onClick={handleWishlist}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
