import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Star, CheckCircle, AlertCircle, ShoppingBag } from "lucide-react";
import RatingForm from "../components/RatingForm";
import { API_BASE_URL, API_ENDPOINTS } from "../utils/apiHelpers";

const RateOrderPage = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const customerEmail = searchParams.get("email") || "";
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [submittedRatings, setSubmittedRatings] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Fetch order details
        const orderRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ORDER_BY_ID(orderId)}`);
        const orderJson = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderJson.message || "Order not found or invalid link.");
        const order = orderJson.data || orderJson;
        setOrderData(order);

        const orderRef = order.orderNumber || orderId;
        const items = order.items || [];
        const productIds = [...new Set(items.map(item =>
          item.product?._id || item.productId || item.product || item._id || item.id
        ).filter(Boolean))];

        // Step 2: Seed from localStorage first (instant feedback)
        const alreadyRated = new Set();
        productIds.forEach(pid => {
          if (localStorage.getItem(`rated_${orderRef}_${pid}`)) alreadyRated.add(pid);
        });
        if (alreadyRated.size > 0) setSubmittedRatings(new Set(alreadyRated));

        // Step 3: Cross-browser check — query backend for each product's ratings
        const ratingChecks = await Promise.allSettled(
          productIds.map(pid =>
            fetch(`${API_BASE_URL}${API_ENDPOINTS.PRODUCT_RATINGS(pid)}`)
              .then(r => r.json())
              .then(data => ({ 
                pid, 
                ratings: data.data?.ratings ?? data.ratings ?? []
              }))
          )
        );

        ratingChecks.forEach(result => {
          if (result.status === "fulfilled") {
            const { pid, ratings } = result.value;
            if (Array.isArray(ratings)) {
              const alreadyRatedOnServer = ratings.some(r =>
                r.orderId === orderRef || r.orderId === orderId || r.order === orderRef || r.order === orderId
              );
              if (alreadyRatedOnServer) {
                alreadyRated.add(pid);
                localStorage.setItem(`rated_${orderRef}_${pid}`, "true");
              }
            }
          }
        });

        setSubmittedRatings(new Set(alreadyRated));
      } catch (err) {
        console.error("Error loading rating page:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) fetchData();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-light mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-6 max-w-md">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Fallback to customer.email if available and query param not provided
  const emailToUse = customerEmail || orderData.customer?.email || "";

  // Get unique products from order items
  const products = orderData.items || [];
  const uniqueProducts = products.reduce((acc, item) => {
    // Backend order items might store the ID as 'product', populated 'product._id', '_id', 'id', or 'productId'
    const actualProductId = item.product?._id || item.productId || item.product || item._id || item.id;
    
    if (!acc.find((p) => p.productId === actualProductId)) {
      acc.push({
        productId: actualProductId,
        name: item.name,
        image: item.image,
        price: item.price,
      });
    }
    return acc;
  }, []);

  const handleRatingSuccess = (productId) => {
    setSubmittedRatings((prev) => new Set([...prev, productId]));
    const orderRef = orderData.orderNumber || orderId;
    localStorage.setItem(`rated_${orderRef}_${productId}`, "true");
  };

  const allRated =
    uniqueProducts.length > 0 &&
    submittedRatings.size === uniqueProducts.length;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-black p-8 text-white text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-full mb-4">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-light mb-2">Rate Your Purchase</h1>
            <p className="text-gray-300">
              Order #{orderData.orderNumber || orderId}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="mb-8 text-center max-w-lg mx-auto">
              <p className="text-gray-600 text-lg">
                Thank you for your recent purchase! Your feedback helps us improve and helps other customers make better decisions.
              </p>
              {uniqueProducts.length > 0 && (
                <div className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                  {submittedRatings.size} of {uniqueProducts.length} items rated
                </div>
              )}
            </div>

            {uniqueProducts.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-500">No products found in this order to rate.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {uniqueProducts.map((product, index) => {
                  const isRated = submittedRatings.has(product.productId);

                  return (
                    <div
                      key={product.productId || index}
                      className={`border rounded-xl p-6 transition-all duration-300 ${isRated
                        ? "bg-green-50/50 border-green-200 shadow-sm"
                        : "bg-white border-gray-200 hover:shadow-md hover:border-gray-300"
                        }`}
                    >
                      {/* Product Info */}
                      <div className="flex items-start gap-4 mb-6">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-lg shadow-sm"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                        <div className="flex-1 mt-1">
                          <h4 className="font-semibold text-lg text-gray-900 mb-1">
                            {product.name}
                          </h4>
                          <p className="text-gray-600 font-medium tracking-wide">₹{product.price}</p>
                        </div>
                        {isRated && (
                          <div className="flex items-center gap-2 text-green-600 bg-green-100 px-3 py-1.5 rounded-full mt-1">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-semibold">Rated</span>
                          </div>
                        )}
                      </div>

                      {/* Rating Form */}
                      {!isRated ? (
                        <div className="pt-4 border-t border-gray-100">
                          <RatingForm
                            productId={product.productId}
                            orderId={orderData.orderNumber || orderId}
                            defaultEmail={emailToUse}
                            onSubmit={async (ratingData) => {
                              setIsSubmitting(true);
                              try {
                                const response = await fetch(
                                  `${API_BASE_URL}/ratings/${product.productId}`,
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      orderId: orderData.orderNumber || orderId,
                                      email: emailToUse,
                                      rating: ratingData.rating,
                                      review: ratingData.comment || "",
                                    }),
                                  }
                                );

                                const data = await response.json();

                                if (!response.ok) {
                                  throw new Error(
                                    data.message || "Failed to submit rating"
                                  );
                                }

                                handleRatingSuccess(product.productId);
                                return { success: true, data };
                              } catch (error) {
                                return {
                                  success: false,
                                  error: error.message || "Failed to submit rating",
                                };
                              } finally {
                                setIsSubmitting(false);
                              }
                            }}
                            onSuccess={() => handleRatingSuccess(product.productId)}
                            onError={(error) => console.error("Rating error:", error)}
                          />
                        </div>
                      ) : (
                        <div className="pt-4 border-t border-green-100 flex items-center justify-center">
                          <p className="text-green-700 font-medium flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Thank you for your rating! Your review has been submitted.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="border-t border-gray-100 bg-gray-50 p-6 flex justify-center">
             <button
                onClick={() => navigate("/products")}
                className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                Continue Shopping
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateOrderPage;
