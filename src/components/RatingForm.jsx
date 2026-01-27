import React, { useState } from "react";
import { Star, AlertCircle, CheckCircle } from "lucide-react";
import StarDisplay from "./StarDisplay";

/**
 * RatingForm Component
 * Form for submitting product ratings with Order ID and Email validation
 */
const RatingForm = ({ productId, orderId: propOrderId, defaultEmail, onSubmit, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    orderId: propOrderId || "",
    email: defaultEmail || "",
    rating: 0,
    comment: "",
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.orderId.trim()) {
      newErrors.orderId = "Order ID is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (selectedRating === 0) {
      newErrors.rating = "Please select a rating";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle star click
  const handleStarClick = (rating) => {
    setSelectedRating(rating);
    setFormData((prev) => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const ratingData = {
        // productId is provided separately to the submit handler (URL param)
        orderId: formData.orderId.trim(),
        email: formData.email.trim(),
        rating: selectedRating,
        // Backend expects `review` field; we expose it as `comment` here
        comment: formData.comment.trim() || "",
      };

      const result = await onSubmit(ratingData);

      if (result.success) {
        setSubmitStatus("success");
        // Reset form
        setFormData({
          orderId: "",
          email: "",
          rating: 0,
          comment: "",
        });
        setSelectedRating(0);
        setHoveredStar(0);

        if (onSuccess) {
          onSuccess(result);
        }

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus("error");
        if (onError) {
          onError(result.error || "Failed to submit rating");
        }
      }
    } catch (error) {
      setSubmitStatus("error");
      const errorMessage =
        error.message || "An error occurred while submitting your rating";
      setErrors({ submit: errorMessage });
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoveredStar || selectedRating;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Rate this product
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order ID */}
        <div>
          <label
            htmlFor="orderId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Order ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="orderId"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            disabled={!!propOrderId}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
              errors.orderId ? "border-red-500" : "border-gray-300"
            } ${propOrderId ? "bg-gray-100 cursor-not-allowed" : ""}`}
            placeholder="Enter your Order ID"
          />
          {errors.orderId && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.orderId}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!!defaultEmail}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
              errors.email ? "border-red-500" : "border-gray-300"
            } ${defaultEmail ? "bg-gray-100 cursor-not-allowed" : ""}`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1"
              onMouseLeave={() => setHoveredStar(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= displayRating
                        ? "fill-gray-700 text-gray-700"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {displayRating > 0 && (
              <span className="text-sm text-gray-600 font-medium">
                {displayRating} {displayRating === 1 ? "star" : "stars"}
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.rating}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Review (Optional)
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            placeholder="Share your experience with this product..."
          />
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Submit Success */}
        {submitStatus === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-600">
              Thank you! Your rating has been submitted successfully.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Rating"}
        </button>
      </form>
    </div>
  );
};

export default RatingForm;



