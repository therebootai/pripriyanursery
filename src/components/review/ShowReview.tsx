"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";

export default function ShowReview() {
  const rating = 4;

  return (
    <div className="max-w-[1300px] mx-auto bg-white px-4 rounded-md shadow-sm py-6 md:py-8">
      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 md:gap-6">

        {/* IMAGE */}
        <div className="flex justify-center md:justify-start">
          <div className="relative w-24 h-24 border rounded">
            <Image
              src="/plant.jpg"
              alt="Product"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div>
          {/* TITLE */}
          <p className="font-medium text-gray-800 text-base md:text-lg">
            Monstera Indoor Plant
          </p>

          <p className="text-sm text-gray-500">
            Delivered on 23 Dec 2025
          </p>

          {/* RATING */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                className={
                  star <= rating
                    ? "fill-green-600 text-green-600"
                    : "text-gray-300"
                }
              />
            ))}

            <span className="text-sm text-gray-600 md:ml-2">
              {rating}.0 out of 5
            </span>
          </div>

          {/* REVIEW TITLE */}
          <h3 className="mt-3 font-medium text-gray-800 text-sm md:text-base">
            Very good product
          </h3>

          {/* REVIEW DESCRIPTION */}
          <p className="mt-2 text-gray-600 text-sm leading-relaxed">
            The plant arrived in excellent condition and was well packed.
            Leaves are healthy and the size is exactly as shown in the
            product images. Totally satisfied with the purchase.
          </p>

          {/* ACTION BUTTONS */}
          <div className="mt-4 flex gap-6">
            <Link
              href="/review"
              className="text-sm text-green-600 hover:underline"
            >
              Edit
            </Link>

            <button className="text-sm text-red-600 hover:underline">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
