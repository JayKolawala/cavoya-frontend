import React from "react";
import { Star, User } from "lucide-react";
import StarDisplay from "./StarDisplay";

/**
 * ReviewsDisplay Component
 * Displays all reviews for a product
 */
const ReviewsDisplay = ({ reviews = [], loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Reviews</h3>
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Reviews</h3>
        <p className="text-gray-500 italic">No reviews yet</p>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      {/* Horizontal list of review cards with scroll when overflowing */}
      <div className="flex flex-nowrap gap-4 pb-2">
        {reviews.map((review, index) => (
          <div
            key={review._id || review.id || index}
            className="min-w-[260px] h-fit max-w-xs bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex-shrink-0"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium
                   text-gray-900">
                    {review.name || review.customerName || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(review.createdAt || review.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <StarDisplay
                  rating={review.rating || 0}
                  size="h-4 w-4"
                  showHalfStars={false}
                />
                <span className="text-sm font-medium text-gray-700 ml-1">
                  {review.rating?.toFixed(1) || "0.0"}
                </span>
              </div>
            </div>

            {/* Review Comment */}
            {(review.comment || review.review) && (
              <p className="text-gray-700 font-bold leading-relaxed line-clamp-4">
                {review.comment || review.review}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsDisplay;



