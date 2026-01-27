import React, { useState } from "react";
import { X, Star, CheckCircle } from "lucide-react";
import RatingForm from "./RatingForm";
import { API_BASE_URL } from "../utils/apiHelpers";

/**
 * RatingModal Component
 * Modal that appears after successful order to collect product ratings
 */
const RatingModal = ({
  isOpen,
  onClose,
  orderData,
  orderNumber,
  customerEmail,
  onSuccess,
}) => {
  const [submittedRatings, setSubmittedRatings] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Get unique products from order items
  const products = orderData?.items || [];
  const uniqueProducts = products.reduce((acc, item) => {
    if (!acc.find(p => p.productId === item.productId)) {
      acc.push({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
      });
    }
    return acc;
  }, []);

  const handleRatingSuccess = (productId) => {
    setSubmittedRatings((prev) => new Set([...prev, productId]));
  };

  // User closes/skips the modal without completing all ratings
  const handleSkip = () => {
    if (onClose) {
      onClose();
    }
  };

  // User is done rating (treat as successful completion)
  const handleDone = () => {
    if (onSuccess) {
      onSuccess();
    } else if (onClose) {
      onClose();
    }
  };

  const allRated =
    uniqueProducts.length > 0 &&
    submittedRatings.size === uniqueProducts.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleSkip}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Order Successful!</h2>
                <p className="text-sm text-gray-600">Order #{orderNumber}</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Rate Your Products
              </h3>
              <p className="text-gray-600">
                Help us improve by sharing your experience with the products you just purchased.
                {uniqueProducts.length > 0 && (
                  <span className="font-medium text-gray-900">
                    {" "}({submittedRatings.size}/{uniqueProducts.length} rated)
                  </span>
                )}
              </p>
            </div>

            {uniqueProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No products to rate.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {uniqueProducts.map((product, index) => {
                  const isRated = submittedRatings.has(product.productId);
                  
                  return (
                    <div
                      key={product.productId || index}
                      className={`border rounded-xl p-6 transition-all ${
                        isRated
                          ? "bg-green-50 border-green-200"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      {/* Product Info */}
                      <div className="flex items-start gap-4 mb-4">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-600">₹{product.price}</p>
                        </div>
                        {isRated && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">Rated</span>
                          </div>
                        )}
                      </div>

                      {/* Rating Form */}
                      {!isRated ? (
                        <RatingForm
                          productId={product.productId}
                          orderId={orderNumber}
                          defaultEmail={customerEmail}
                          onSubmit={async (ratingData) => {
                            setIsSubmitting(true);
                            try {
                              // Backend expects:
                              // POST /api/ratings/:productId
                              // { orderId, email, rating, review }
                              const response = await fetch(
                                `${API_BASE_URL}/ratings/${product.productId}`,
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    orderId: orderNumber,
                                    email: customerEmail,
                                    rating: ratingData.rating,
                                    review: ratingData.comment || "",
                                  }),
                                },
                              );

                              const data = await response.json();

                              if (!response.ok) {
                                throw new Error(
                                  data.message || "Failed to submit rating",
                                );
                              }

                              handleRatingSuccess(product.productId);
                              return { success: true, data };
                            } catch (error) {
                              return {
                                success: false,
                                error:
                                  error.message || "Failed to submit rating",
                              };
                            } finally {
                              setIsSubmitting(false);
                            }
                          }}
                          onSuccess={() => handleRatingSuccess(product.productId)}
                          onError={(error) => console.error("Rating error:", error)}
                        />
                      ) : (
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <p className="text-sm text-green-700 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Thank you for your rating!
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {allRated
                  ? "All products rated! Thank you for your feedback."
                  : "You can skip and rate later from your order history."}
              </p>
              <div className="flex gap-3">
                {!allRated && (
                  <button
                    onClick={handleSkip}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Skip for Now
                  </button>
                )}
                <button
                  onClick={handleDone}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {allRated ? "Continue Shopping" : "Done"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;

