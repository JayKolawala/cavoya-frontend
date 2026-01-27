import React from "react";
import { Star } from "lucide-react";

/**
 * StarDisplay Component
 * Displays a star rating with support for half stars
 * @param {number} rating - The rating value (0-5)
 * @param {string} size - Size class for stars (default: "h-5 w-5")
 * @param {boolean} showHalfStars - Whether to show half stars (default: false)
 */
const StarDisplay = ({ rating = 0, size = "h-5 w-5", showHalfStars = false }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = showHalfStars && rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`${size} fill-gray-700 text-gray-700`}
          />
        ))}
      {hasHalfStar && (
        <div className="relative inline-block">
          <Star className={`${size} text-gray-300`} />
          <Star
            className={`${size} fill-gray-700 text-gray-700 absolute left-0 top-0 overflow-hidden`}
            style={{ width: "50%" }}
          />
        </div>
      )}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${size} text-gray-300`}
          />
        ))}
    </div>
  );
};

export default StarDisplay;



