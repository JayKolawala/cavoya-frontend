import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Star,
  Truck,
  RefreshCw,
  Shield,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import StarDisplay from "../components/StarDisplay";
import ReviewsDisplay from "../components/ReviewsDisplay";
import { isVideo } from "../utils/mediaHelpers";
import { getColorClasses } from "../utils/colorHelpers";
import { API_BASE_URL } from "../utils/apiHelpers";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, products, fetchProductById, showCustomAlert } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Check URL params to auto-open reviews section
  const searchParams = new URLSearchParams(location.search);
  const shouldShowReviews = searchParams.get("rate") === "true" || searchParams.get("showReviews") === "true";
  const [activeAccordion, setActiveAccordion] = useState(shouldShowReviews ? "reviews" : null);
  
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Thumbnail scroll state
  const thumbnailScrollRef = React.useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check if arrows should be visible
  const updateArrowVisibility = () => {
    if (thumbnailScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        thumbnailScrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll thumbnails left or right
  const scrollThumbnails = (direction) => {
    if (thumbnailScrollRef.current) {
      const scrollAmount = 300; // Scroll by 300px
      const newScrollLeft =
        thumbnailScrollRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      thumbnailScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  // Update arrow visibility on scroll
  React.useEffect(() => {
    const thumbnailContainer = thumbnailScrollRef.current;
    if (thumbnailContainer) {
      updateArrowVisibility();
      thumbnailContainer.addEventListener("scroll", updateArrowVisibility);
      return () =>
        thumbnailContainer.removeEventListener("scroll", updateArrowVisibility);
    }
  }, [selectedProduct]);

  // Get related products (same category, exclude current product)
  // If no related products, fallback to any other products
  const relatedProducts = selectedProduct
    ? (() => {
        // First, try to find products in the same category
        const sameCategory = products.filter(
          (p) =>
            p.category === selectedProduct.category &&
            p.id !== selectedProduct.id &&
            p._id !== selectedProduct._id,
        );

        // If we have related products from same category, use them
        if (sameCategory.length > 0) {
          return sameCategory.slice(0, 4);
        }

        // Otherwise, show any other products (excluding current)
        return products
          .filter(
            (p) => p.id !== selectedProduct.id && p._id !== selectedProduct._id,
          )
          .slice(0, 4);
      })()
    : [];

  // Determine section title based on whether we found related products
  const productsSectionTitle = selectedProduct
    ? products.some(
        (p) =>
          p.category === selectedProduct.category &&
          p.id !== selectedProduct.id &&
          p._id !== selectedProduct._id,
      )
      ? "Related Products"
      : "You May Also Like"
    : "Related Products";

  // Fetch reviews for the product
  const fetchReviews = async (productId) => {
    if (!productId) return;

    setReviewsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/ratings/${productId}`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        // API returns: { success, data: { avgRating, totalRatings, ratings: [] } }
        setReviews(data.data?.ratings || data.ratings || []);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };


  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);

      // First, try to find the product in the loaded products array
      let product = products.find((p) => p.id === id || p._id === id);

      // If product not found in array, fetch it directly from API
      if (!product && id && fetchProductById) {
        product = await fetchProductById(id);
      }

      if (product) {
        setSelectedProduct(product);
        setSelectedColor(
          product.colors && product.colors.length > 0 ? product.colors[0] : "",
        );
        setSelectedSize(
          product.sizes && product.sizes.length > 0 ? product.sizes[0] : "",
        );

        // Fetch reviews for this product
        await fetchReviews(product.id || product._id);
      }

      setLoading(false);
    };

    loadProduct();
  }, [id, products, fetchProductById]);

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  // Show loading spinner while product is being fetched
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show error message if product is not found
  if (!selectedProduct) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-light mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">
          The product you're looking for doesn't exist.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Go Back
        </button>
      </section>
    );
  }

  // Build media array with main image and additional images/videos
  const productMedia = [];

  // Add main image first
  if (selectedProduct.image) {
    productMedia.push({
      url: selectedProduct.image,
      type: isVideo(selectedProduct.image) ? "video" : "image",
      alt: selectedProduct.name,
      isMain: true,
    });
  }

  // Add additional images/videos from API response
  if (
    selectedProduct.images &&
    Array.isArray(selectedProduct.images) &&
    selectedProduct.images.length > 0
  ) {
    selectedProduct.images.forEach((media, index) => {
      // Your API returns objects with {url, alt, _id}
      const mediaUrl = media.url || media;
      const mediaAlt =
        media.alt || `${selectedProduct.name} - Image ${index + 2}`;

      if (mediaUrl) {
        productMedia.push({
          url: mediaUrl,
          type: isVideo(mediaUrl) ? "video" : "image",
          alt: mediaAlt,
          isMain: false,
        });
      }
    });
  }

  // Fallback if no media available at all
  if (productMedia.length === 0) {
    productMedia.push({
      url: "https://placehold.co/800x1200/E8D2C5/543C42?text=No+Image",
      type: "image",
      alt: "No image available",
      isMain: true,
    });
  }

  const AccordionSection = ({ title, isOpen, onToggle, children }) => (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full py-4 px-0 flex justify-between items-center text-left hover:bg-gray-50 transition-colors rounded-none"
      >
        <span className="text-gray-700 font-medium">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[2000px] pb-4 px-4" : "max-h-0"
        }`}
      >
        <div className="text-gray-600 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );

  return (
    <section className="container mx-auto px-4 pt-24 pb-16">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Enhanced Media Gallery */}
        <div className="lg:w-1/2">
          <div className="w-full h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden mb-6 relative shadow-xl">
            {productMedia[activeMediaIndex].type === "video" ? (
              <video
                src={productMedia[activeMediaIndex].url}
                className="w-full h-full object-contain"
                controls
                autoPlay
                muted
                loop
              />
            ) : (
              <img
                src={productMedia[activeMediaIndex].url}
                alt={productMedia[activeMediaIndex].alt}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            )}
          </div>

          {/* Enhanced Thumbnails with Horizontal Scroll */}
          <div className="relative px-2">
            {/* Left Arrow */}
            {showLeftArrow && (
              <button
                onClick={() => scrollThumbnails("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
            )}

            {/* Scrollable Thumbnail Container */}
            <div
              ref={thumbnailScrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth p-2 px-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {productMedia.map((media, index) => (
                <div
                  key={index}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden ${
                    activeMediaIndex === index
                      ? "ring-4 ring-gray-700 shadow-lg scale-105"
                      : "hover:opacity-80 hover:scale-105 shadow-md"
                  }`}
                  onClick={() => setActiveMediaIndex(index)}
                >
                  {media.type === "video" ? (
                    <>
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                        <Play className="h-8 w-8 text-white drop-shadow-lg" />
                      </div>
                    </>
                  ) : (
                    <img
                      src={media.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
              <button
                onClick={() => scrollThumbnails("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Product Details */}
        <div className="lg:w-1/2">
          <h1 className="text-4xl md:text-5xl font-light mb-3 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent capitalize">
            {selectedProduct.name}
          </h1>

          {/* Enhanced Rating - Use backend avgRating and totalRatings */}
          {selectedProduct.totalRatings > 0 ? (
            <div className="flex items-center mb-6">
              <StarDisplay
                rating={selectedProduct.avgRating || 0}
                size="h-5 w-5"
                showHalfStars={true}
              />
              <span className="ml-3 text-gray-600 font-medium">
                {selectedProduct.avgRating?.toFixed(1) || "0.0"} (
                {selectedProduct.totalRatings}{" "}
                {selectedProduct.totalRatings === 1 ? "review" : "reviews"})
              </span>
            </div>
          ) : (
            <div className="mb-6">
              <span className="text-gray-500 text-sm italic">
                No reviews yet
              </span>
            </div>
          )}

          {/* Enhanced Price */}
          <div className="flex items-center space-x-4 mb-8">
            <span className="text-4xl font-bold text-gray-900">
              ₹{selectedProduct.price}
            </span>
            {selectedProduct.originalPrice &&
              selectedProduct.originalPrice > selectedProduct.price && (
                <span className="text-xl text-gray-400 line-through">
                  ₹{selectedProduct.originalPrice}
                </span>
              )}
            {selectedProduct.isSale && (
              <span className="bg-black text-white px-3 py-1.5 text-sm font-semibold rounded-full shadow-md">
                SALE
              </span>
            )}
          </div>

          {/* Enhanced Description */}
          <div className="bg-gray-50 rounded-2xl py-6">
            <p className="text-gray-700 font-bold leading-relaxed">
              {selectedProduct.description || "No description available."}
            </p>
          </div>

          {/* Stock Status */}
          {/* <div className="mb-6">
            <p
              className={`text-sm font-medium ${
                selectedProduct.inventory?.stock > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {selectedProduct.inventory?.stock > 0
                ? `In Stock (${selectedProduct.inventory.stock} available)`
                : "Out of Stock"}
            </p>
          </div> */}

          {/* Color Selection */}
          {/* {selectedProduct.colors && selectedProduct.colors.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-lg mb-3">
                Color:{" "}
                <span className="text-gray-600 font-normal">
                  {selectedColor}
                </span>
              </h4>
              <div className="flex flex-wrap gap-3">
                {selectedProduct.colors.map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full ${getColorClasses(
                      color
                    )} border-2 transition-all ${selectedColor === color
                      ? "border-gray-800 scale-110 ring-2 ring-gray-300"
                      : "border-gray-300 hover:scale-105"
                      }`}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )} */}

          {/* Size Selection */}
          {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
            <div className="mb-8">
              <h4 className="font-medium text-lg mb-3">
                Size:{" "}
                <span className="text-gray-600 font-normal">
                  {selectedSize}
                </span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md transition-colors ${
                      selectedSize === size
                        ? "border-gray-900 bg-gray-100 text-gray-900"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={() =>
              addToCart(selectedProduct, selectedColor, selectedSize)
            }
            disabled={selectedProduct.inventory?.stock <= 0}
            className={`w-full py-4 rounded-lg font-bold transition-transform transform ${
              selectedProduct.inventory?.stock > 0
                ? "bg-black text-white hover:scale-[1.01] hover:bg-gray-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } mb-4`}
          >
            {selectedProduct.inventory?.stock > 0
              ? "Add to Cart"
              : "Out of Stock"}
          </button>

          {/* Category Badge */}
          {selectedProduct.category && (
            <div className="mb-4">
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Category: {selectedProduct.category}
              </span>
            </div>
          )}


          {/* Enhanced Accordion Sections */}
          <div className="border-t border-gray-200 bg-white rounded-2xl shadow-sm overflow-hidden" id="reviews-section">
            <AccordionSection
              title="Product Details"
              isOpen={activeAccordion === "details"}
              onToggle={() => toggleAccordion("details")}
            >
              <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-semibold text-gray-800 mb-1">
                      Category:
                    </p>
                    <p className="text-gray-600">
                      {selectedProduct.category || "N/A"}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-semibold text-gray-800 mb-1">Stock:</p>
                    <p className="text-gray-600">
                      {selectedProduct.inventory?.stock || 0} units
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-semibold text-gray-800 mb-1">Colors:</p>
                    <p className="text-gray-600">
                      {selectedProduct.colors?.join(", ") || "N/A"}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-semibold text-gray-800 mb-1">Sizes:</p>
                    <p className="text-gray-600">
                      {selectedProduct.sizes?.join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-1">
                    Product ID:
                  </p>
                  <p className="text-gray-500 text-xs font-mono">
                    {selectedProduct._id || selectedProduct.id}
                  </p>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection
              title="Product Description"
              isOpen={activeAccordion === "description"}
              onToggle={() => toggleAccordion("description")}
            >
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {selectedProduct.description ||
                    "No detailed description available."}
                </p>

                {selectedProduct.isFeatured && (
                  <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-4 rounded-xl border-l-4 border-gray-700 shadow-sm">
                    <p className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                      <Star className="w-4 h-4 fill-gray-700 text-gray-700" />
                      Featured Product
                    </p>
                    <p className="text-gray-600 text-sm">
                      This is one of our featured items, handpicked for quality
                      and style.
                    </p>
                  </div>
                )}
              </div>
            </AccordionSection>

            <AccordionSection
              title="Shipping & Returns"
              isOpen={activeAccordion === "shipping"}
              onToggle={() => toggleAccordion("shipping")}
            >
              <div className="space-y-5">
                <div className="flex items-start space-x-4 bg-gray-50 p-4 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">
                      Free Shipping
                    </p>
                    <p className="text-sm text-gray-600">
                      Complimentary delivery on all orders over ₹999 across
                      India
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 bg-gray-50 p-4 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">
                      Easy Returns
                    </p>
                    <p className="text-sm text-gray-600">
                      Hassle-free 30-day return policy for complete peace of
                      mind
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 bg-gray-50 p-4 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-black rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">
                      Secure Payment
                    </p>
                    <p className="text-sm text-gray-600">
                      Bank-grade encryption keeps your payment information safe
                    </p>
                  </div>
                </div>
              </div>
            </AccordionSection>
          </div>
        </div>
      </div>

      {/* Reviews Display Section - Only show reviews, no rating form */}
      <div className="border-b border-gray-200">
              <div className="py-4 px-4 ">
                <h3 className="text-gray-700 text-center font-medium text-2xl mb-6">Customer Reviews ({reviews.length})</h3>
                <div className="space-y-6">
                  {/* Reviews Display */}
                  <ReviewsDisplay reviews={reviews} loading={reviewsLoading} />
                </div>
              </div>
            </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-3xl font-light mb-8 text-center text-gray-900">
            {productsSectionTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product, index) => (
              <div
                key={product.id || product._id}
                className={`
                  ${index >= 2 ? "hidden md:block" : ""}
                  ${index >= 3 ? "lg:block" : ""}
                `}
              >
                <ProductCard
                  product={product}
                  onProductClick={(product) =>
                    navigate(`/product/${product.id || product._id}`)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductPage;
