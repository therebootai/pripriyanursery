import React from "react";

const ProductRatingSummary = ({
  averageRating,
  ratingCount,
  ratingBreakdown,
  reviewsCount = 477,
}: {
  averageRating: number;
  ratingCount: number;
  ratingBreakdown: { 1: number; 2: number; 3: number; 4: number; 5: number };
  reviewsCount?: number;
}) => {
  // Helper to get bar color based on rating level
  const getBarColor = (rating: number) => {
    if (rating >= 3) return "var(--color-defined-green)";
    if (rating === 2) return "var(--color-defined-yellow)";
    return "var(--color-defined-red)";
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      {/* Left Section: Average Rating */}
      <div className="flex flex-col items-center justify-center bg-white p-8 rounded-sm w-full md:w-1/3 h-full min-h-[180px]">
        <div className="flex items-center gap-2">
          <span
            className="text-6xl font-medium"
            style={{ color: "var(--color-defined-green)" }}
          >
            {averageRating}
          </span>
          <svg
            className="w-10 h-10"
            style={{ fill: "var(--color-defined-green)" }}
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
        <p className="text-[#5f6368] text-center mt-4 text-lg leading-snug">
          {ratingCount.toLocaleString()} Ratings & {reviewsCount} Reviews
        </p>
      </div>

      {/* Right Section: Rating Breakdown Bars */}
      <div className="flex flex-col justify-center bg-white p-6 rounded-sm w-full md:w-2/3 h-full min-h-[180px]">
        {[5, 4, 3, 2, 1].map((star) => {
          const count =
            ratingBreakdown[star as keyof typeof ratingBreakdown] || 0;
          const percentage = ratingCount > 0 ? (count / ratingCount) * 100 : 0;

          return (
            <div
              key={star}
              className="flex items-center gap-3 w-full mb-1 last:mb-0"
            >
              {/* Star Label */}
              <div className="flex items-center justify-end gap-1 w-8">
                <span className="text-sm font-medium text-[#5f6368]">
                  {star}
                </span>
                <svg className="w-3 h-3 fill-[#5f6368]" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>

              {/* Progress Bar Container */}
              <div className="flex-1 h-2 bg-[#e8eaed] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: getBarColor(star),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductRatingSummary;
