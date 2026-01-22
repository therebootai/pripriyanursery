import React from "react";
import {
  Star,
  CheckCircle,
  Calendar,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";

const ReviewCard = ({ review }) => {
  // Check if file is video
  const isVideoFile = (url) => {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
    return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
  };

  // Check if file is image
  const isImageFile = (url) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    return imageExtensions.some((ext) => url.toLowerCase().includes(ext));
  };

  // Format date to "Month, Year"
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (review.user?.name && review.user?.name.trim()) {
      return review.user.name;
    }
    // Extract name from email if available
    if (review.user?.email) {
      const namePart = review.user.email.split("@")[0];
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    // Use mobile number last 4 digits
    if (review.user?.mobile) {
      return `User ${review.user.mobile.slice(-4)}`;
    }
    return "Anonymous";
  };

  // Get user location
  const getUserLocation = () => {
    const address = review.user.addresses?.[0];
    if (address?.city && address?.area) {
      return `${address.area}, ${address.city}`;
    }
    if (address?.city) {
      return address.city;
    }
    return "Unknown Location";
  };

  // Calculate average rating (for demo)
  const calculateAverageRating = () => {
    return review.rating.toFixed(1);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Rating header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col space-x-3">
          {/* Rating badge */}
          <div className="flex items-center justify-center mt-0.5">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={12}
                className={`${
                  index < Math.floor(review.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-gray-900 font-bold text-xl mt-1">{review.title}</p>
        </div>
      </div>

      {/* Review content */}
      <div className="mb-4">
        <p className="text-gray-700 line-clamp-3 leading-relaxed">
          {review.description ||
            "Nice product, good quality, happy with the purchase..."}
        </p>

        {/* Read more if long */}
        {review.description && review.description.length > 150 && (
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2">
            Read more
          </button>
        )}
      </div>

      {/* Media files */}
      {review.supporting_files && review.supporting_files.length > 0 && (
        <div className="mb-4">
          <div className="flex space-x-3 overflow-x-auto pb-3">
            {review.supporting_files.map((file) => (
              <div
                key={file._id}
                className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 relative group cursor-pointer"
              >
                {isImageFile(file.url) ? (
                  <img
                    src={file.url}
                    alt="Review media"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : isVideoFile(file.url) ? (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-white ml-1"></div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                        <span>Video</span>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  {isImageFile(file.url) ? (
                    <div className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                      View
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User info footer */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* User avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="font-semibold text-blue-600">
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Verified badge */}
              {review.status === "approved" && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle size={12} className="text-white" />
                </div>
              )}
            </div>

            {/* User details */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">
                  {getUserDisplayName()}
                </span>

                {/* Certified Buyer badge */}
                {/* {review.user.totalOrders > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <CheckCircle size={10} className="mr-1" />
                    Certified Buyer
                  </span>
                )} */}
              </div>

              <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                <span className="flex items-center">
                  <Calendar size={12} className="mr-1" />
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* User tier */}
          {review.user?.rewards?.tier && (
            <div
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                review.user.rewards.tier === "Gold"
                  ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border border-amber-200"
                  : review.user.rewards.tier === "Platinum"
                    ? "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300"
                    : "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              {review.user.rewards.tier} Member
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
