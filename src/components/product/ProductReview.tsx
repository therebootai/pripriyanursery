import React from "react";
import {
  Star,
  CheckCircle,
  Calendar,
  ThumbsUp,
  MessageCircle,
  CheckCircle2,
  ThumbsDown,
} from "lucide-react";

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

const ReviewCard = ({
  review,
}: {
  review: {
    user: { name?: string };
    rating: number;
    description: string;
    createdAt: string;
    title: string;
    supporting_files: { url: string; public_id: string }[];
  };
}) => {
  return (
    <div className="p-4 bg-white font-sans border-b border-gray-100">
      {/* Top Section: Rating and Title */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1 bg-[#388e3c] text-white px-1.5 py-0.5 rounded text-sm font-bold">
          <Star size={14} fill="currentColor" />
          <span>{review.rating.toFixed(1)}</span>
        </div>
        <h3 className="text-gray-800 font-medium text-lg">{review.title}</h3>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-line">
          {review.description}
        </p>
      </div>

      {/* Supporting Files (Images) */}
      {review.supporting_files?.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {review.supporting_files.map((file) => (
            <div
              key={file.public_id}
              className="w-20 h-20 flex-shrink-0 border border-gray-200 rounded-sm overflow-hidden"
            >
              <img
                src={file.url}
                alt="Review Attachment"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
          <span className="font-semibold text-gray-700">
            {review.user?.name || "Customer"}
          </span>

          <div className="flex items-center gap-1">
            <CheckCircle2 size={14} className="text-green-600 fill-green-50" />
            <span className="text-[12px]">Certified Buyer,</span>
          </div>

          <span className="text-[12px]">
            Hamirpur District {formatDate(review.createdAt)}
          </span>
        </div>

        {/* Interaction Buttons (Like/Dislike) */}
        <div className="flex items-center gap-6 text-gray-500">
          <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
            <ThumbsUp size={18} />
            <span className="text-sm font-medium">51</span>
          </button>
          <button className="flex items-center gap-2 hover:text-red-600 transition-colors">
            <ThumbsDown size={18} />
            <span className="text-sm font-medium">51</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
