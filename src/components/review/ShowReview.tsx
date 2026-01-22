"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import { useCustomer } from "@/context/CustomerContext";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ShowReview() {
  const { customer } = useCustomer();

  const [allReviews, setAllReviews] = useState([]);

  async function getAllReviews() {
    try {
      const { data, status } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/review?user=${customer?._id}`,
      );

      if (status === 200) {
        setAllReviews(data.reviews);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllReviews();
  }, []);

  return (
    <div className="max-w-[1300px] mx-auto bg-white px-4 rounded-md shadow-sm py-6 md:py-8">
      {/* MAIN GRID */}
      {allReviews.map(
        (review: {
          _id: string;
          rating: number;
          description: string;
          title: string;
          product: {
            coverImage: {
              url: string;
            };
            name: string;
          };
          createdAt: string | number | Date;
        }) => (
          <div
            className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-4 md:gap-6"
            key={review._id}
          >
            {/* IMAGE */}
            <div className="flex justify-center md:justify-start">
              <div className="relative aspect-square rounded">
                <Image
                  src={review.product?.coverImage?.url}
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
                {review.product?.name}
              </p>

              <p className="text-sm text-gray-500">
                Reviewed on {new Date(review.createdAt).toDateString()}
              </p>

              {/* RATING */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={
                      star <= review.rating
                        ? "fill-green-600 text-green-600"
                        : "text-gray-300"
                    }
                  />
                ))}

                <span className="text-sm text-gray-600 md:ml-2">
                  {review.rating} out of 5
                </span>
              </div>

              {/* REVIEW TITLE */}
              <h3 className="mt-3 font-medium text-gray-800 text-sm md:text-base">
                {review.title}
              </h3>

              {/* REVIEW DESCRIPTION */}
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                {review.description}
              </p>

              {/* ACTION BUTTONS */}
              <div className="mt-4 flex gap-6">
                <Link
                  href={`/review/${review._id}`}
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
        ),
      )}
    </div>
  );
}
