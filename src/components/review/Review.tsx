"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="max-w-[900px] mx-auto bg-white px-4 rounded-md shadow-sm py-8 md:my-6">
      {/* PRODUCT INFO */}
      <div className="flex gap-4 border-b border-gray-300 pb-4">
        <div className="relative w-24 h-24 border border-gray-300 rounded">
          <Image
            src="/plant.jpg"   // product image
            alt="Product"
            fill
            className="object-cover"
          />
        </div>

        <div>
          <p className="font-medium text-gray-800">
            Monstera Indoor Plant
          </p>
          <p className="text-sm text-gray-500">
            Delivered on 23 Dec 2025
          </p>
        </div>
      </div>

      {/* RATING */}
      <div className="mt-6">
        <p className="font-medium mb-2">Rate this product</p>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <Star
                size={28}
                className={`${
                  star <= (hover || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* REVIEW TITLE */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-1">
          Review title
        </label>
        <input
          type="text"
          placeholder="Eg: Very good product"
          className="w-full border   border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* REVIEW TEXT */}
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">
          Your review
        </label>
        <textarea
          rows={4}
          placeholder="Share details of your experience"
          className="w-full border  border-gray-300  rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* IMAGE UPLOAD */}
      <div className="mt-4">
        <p className="text-sm font-medium mb-1">
          Add photos (optional)
        </p>

        <label className="inline-flex items-center gap-2 px-4 py-2 border  border-gray-300 rounded cursor-pointer text-sm hover:bg-gray-50">
          <input type="file" multiple hidden />
          📷 Upload Photos
        </label>
      </div>

      {/* SUBMIT */}
      <div className="mt-6 flex justify-end">
        <Link href="/show-review">
        <button className="
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
            ">
          Submit Review
        </button>
        </Link>
      </div>
    </div>
  );
}
