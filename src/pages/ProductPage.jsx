import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { X, Ruler, Play, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Size Chart Data ───────────────────────────────────────────────────────────
const SIZE_CHART = {
  rows: [
    { measurement: "BUST", inches: [32, 34, 36, 38, 40, 42], cm: [81, 86, 91, 97, 102, 107] },
    { measurement: "WAIST", inches: [25, 27, 29, 31, 33, 35], cm: [64, 69, 74, 79, 84, 89] },
    { measurement: "HIP", inches: [35, 37, 39, 41, 43, 45], cm: [89, 94, 99, 104, 109, 114] },
  ],
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// ─── Size Chart Modal ──────────────────────────────────────────────────────────
const SizeChartModal = ({ onClose }) => {
  const [unit, setUnit] = useState("inches");
  const chart = SIZE_CHART;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-100">
          <h2 className="text-lg font-bold tracking-widest uppercase text-gray-900">Body Measurement</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-3 py-3">
          {["inches", "cm"].map((u, i) => (
            <React.Fragment key={u}>
              {i > 0 && <span className="text-gray-300">|</span>}
              <button
                onClick={() => setUnit(u)}
                className={`text-sm font-semibold tracking-widest uppercase transition-colors ${unit === u ? "underline underline-offset-4 text-gray-900" : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                {u === "inches" ? "Inches" : "CM"}
              </button>
            </React.Fragment>
          ))}
        </div>
        <div className="px-4 pb-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left font-normal text-gray-400" />
                {SIZES.map((s) => (
                  <th key={s} className="py-3 px-4 text-center font-bold text-gray-800 tracking-widest">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.rows.map((row, i) => (
                <tr key={row.measurement} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="py-4 px-4 font-bold text-gray-800 tracking-widest border border-gray-100">{row.measurement}</td>
                  {row[unit].map((val, j) => (
                    <td key={j} className="py-4 px-4 text-center text-gray-700 border border-gray-100">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import useCartStore from "../store/useCartStore";
import useProductStore from "../store/useProductStore";
import useUIStore from "../store/useUIStore";
import ProductCard from "../components/ProductCard";
import SingleProductSkeleton from "../components/SingleProductSkeleton";
import StarDisplay from "../components/StarDisplay";
import ReviewsDisplay from "../components/ReviewsDisplay";
import { isVideo } from "../utils/mediaHelpers";
import { API_BASE_URL } from "../utils/apiHelpers";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCartStore();
  const { products, fetchProductById } = useProductStore();
  const { showCustomAlert } = useUIStore();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedTopSize, setSelectedTopSize] = useState("");
  const [selectedBottomSize, setSelectedBottomSize] = useState("");
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const thumbRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateThumbArrows = () => {
    const el = thumbRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  const scrollThumbs = (dir) => {
    const el = thumbRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  const relatedProducts = selectedProduct
    ? (() => {
      const sameCategory = products.filter(
        (p) => p.category === selectedProduct.category && p.id !== selectedProduct.id && p._id !== selectedProduct._id
      );
      if (sameCategory.length > 0) return sameCategory.slice(0, 4);
      return products.filter((p) => p.id !== selectedProduct.id && p._id !== selectedProduct._id).slice(0, 4);
    })()
    : [];

  const productsSectionTitle = selectedProduct
    ? products.some((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id && p._id !== selectedProduct._id)
      ? "Related Products"
      : "You May Also Like"
    : "Related Products";

  const fetchReviews = async (productId) => {
    if (!productId) return;
    setReviewsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ratings/${productId}`);
      const data = await response.json();
      if (response.ok && data.success) {
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
      let product = null;
      if (id && fetchProductById) {
        product = await fetchProductById(id);
      }
      if (!product) {
        product = products.find((p) => p.id === id || p._id === id);
      }
      if (product) {
        setSelectedProduct(product);
        setSelectedColor(product.colors?.length > 0 ? product.colors[0] : "");
        setSelectedSize(product.sizes?.length > 0 ? product.sizes[0] : "");
        setSelectedTopSize(product.topSizes?.[0] || "");
        setSelectedBottomSize(product.bottomSizes?.[0] || "");
        await fetchReviews(product.id || product._id);
      }
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  // Initialize and update thumbnail scroll arrows
  useEffect(() => {
    if (!selectedProduct) return;
    updateThumbArrows();
    window.addEventListener("resize", updateThumbArrows);
    // Small timeout to allow images to layout correctly
    const timeoutId = setTimeout(updateThumbArrows, 150);
    return () => {
      window.removeEventListener("resize", updateThumbArrows);
      clearTimeout(timeoutId);
    };
  }, [selectedProduct]);

  if (loading) return <SingleProductSkeleton />;

  if (!selectedProduct) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-light mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Go Back
        </button>
      </section>
    );
  }

  // Build media array
  const productMedia = [];
  if (selectedProduct.image) {
    productMedia.push({ url: selectedProduct.image, type: isVideo(selectedProduct.image) ? "video" : "image", alt: selectedProduct.name });
  }
  if (selectedProduct.images?.length > 0) {
    selectedProduct.images.forEach((media, index) => {
      const mediaUrl = media.url || media;
      const mediaAlt = media.alt || `${selectedProduct.name} - Image ${index + 2}`;
      if (mediaUrl) {
        productMedia.push({ url: mediaUrl, type: isVideo(mediaUrl) ? "video" : "image", alt: mediaAlt });
      }
    });
  }
  if (productMedia.length === 0) {
    productMedia.push({ url: "https://placehold.co/800x1200/E8D2C5/543C42?text=No+Image", type: "image", alt: "No image available" });
  }

  const hasTopBottomSizes = selectedProduct.topSizes || selectedProduct.bottomSizes;

  return (
    <>
      <Helmet>
        <title>{selectedProduct.name} - Cavoya</title>
        <meta name="description" content={selectedProduct.description?.substring(0, 150) || `Shop ${selectedProduct.name} at Cavoya`} />
        <meta property="og:title" content={`${selectedProduct.name} - Cavoya`} />
        <meta property="og:description" content={selectedProduct.description?.substring(0, 150) || `Shop ${selectedProduct.name} at Cavoya`} />
        <meta property="og:image" content={selectedProduct.image} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={selectedProduct.price} />
        <meta property="product:price:currency" content="INR" />
      </Helmet>

      {showSizeChart && (
        <SizeChartModal onClose={() => setShowSizeChart(false)} />
      )}

      <section className="container mx-auto px-4 pt-24 pb-16">
        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-12">

          {/* ── LEFT: sticky image panel ── */}
          <div className="lg:w-1/2 lg:sticky lg:top-24 lg:self-start">
            {/* Main image */}
            {/* <div className="w-fit md:h-screen rounded-2xl overflow-hidden mb-4 shadow-lg">
              {productMedia[activeMediaIndex].type === "video" ? (
                <video
                  src={productMedia[activeMediaIndex].url}
                  className="w-full object-contain"
                  // style={{ aspectRatio: "3/4" }}
                  controls autoPlay muted loop
                />
              ) : (
                <img
                  src={productMedia[activeMediaIndex].url}
                  alt={productMedia[activeMediaIndex].alt}
                  className=" w-full md:min-h-screen max-h-[500px] object-contain transition-transform duration-300 hover:scale-105"
                // style={{ aspectRatio: "3/4" }}
                />
              )}
            </div> */}
            <div className="w-full h-[80vh] lg:h-screen rounded-2xl overflow-hidden mb-4 shadow-lg">
              {productMedia[activeMediaIndex].type === "video" ? (
                <video
                  src={productMedia[activeMediaIndex].url}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <img
                  src={productMedia[activeMediaIndex].url}
                  alt={productMedia[activeMediaIndex].alt}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              )}
            </div>
            {/* Horizontal thumbnail strip with scroll arrows */}
            {productMedia.length > 1 && (
              <div className="relative">
                {/* Left arrow */}
                {canScrollLeft && (
                  <button
                    onClick={() => scrollThumbs("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md rounded-full p-1.5 transition-all"
                    aria-label="Scroll thumbnails left"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-700" />
                  </button>
                )}

                <div
                  ref={thumbRef}
                  onScroll={updateThumbArrows}
                  className="flex gap-3 overflow-x-auto pb-1 px-1"
                  style={{ scrollbarWidth: "none" }}
                >
                  {productMedia.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => { setActiveMediaIndex(index); updateThumbArrows(); }}
                      className={`relative flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 ${activeMediaIndex === index
                        ? "border-gray-900 shadow-md"
                        : "border-transparent hover:border-gray-300"
                        }`}
                    >
                      {media.type === "video" ? (
                        <>
                          <video src={media.url} className="w-full h-full object-cover" muted />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="h-5 w-5 text-white" />
                          </div>
                        </>
                      ) : (
                        <img src={media.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Right arrow */}
                {canScrollRight && (
                  <button
                    onClick={() => scrollThumbs("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md rounded-full p-1.5 transition-all"
                    aria-label="Scroll thumbnails right"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-700" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT: scrollable product info ── */}
          <div className="lg:w-1/2">

            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-light mb-2 text-gray-900 capitalize">
              {selectedProduct.name}
            </h1>

            {/* Rating */}
            {selectedProduct.totalRatings > 0 ? (
              <div className="flex items-center mb-5">
                <StarDisplay rating={selectedProduct.avgRating || 0} size="h-5 w-5" showHalfStars={true} />
                <span className="ml-3 text-gray-600 font-medium">
                  {selectedProduct.avgRating?.toFixed(1)} ({selectedProduct.totalRatings}{" "}
                  {selectedProduct.totalRatings === 1 ? "review" : "reviews"})
                </span>
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic mb-5">No reviews yet</p>
            )}

            {/* Price */}
            <div className="mb-6">
              <p className="text-sm text-gray-500">MRP:</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-3xl font-semibold text-gray-900">
                  ₹{selectedProduct.price?.toLocaleString("en-IN")}
                </span>
                {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{selectedProduct.originalPrice?.toLocaleString("en-IN")}
                  </span>
                )}
                {selectedProduct.isSale && (
                  <span className="bg-black text-white px-3 py-1 text-xs font-semibold rounded-full">SALE</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tax included.{" "}
                <span className="underline cursor-pointer">Shipping calculated at checkout.</span>
              </p>
            </div>

            <hr className="border-gray-200 mb-6" />

            {/* Size selectors */}
            {hasTopBottomSizes ? (
              <div className="space-y-5 mb-6">
                {selectedProduct.topSizes?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold tracking-widest text-gray-500 mb-2">TOP</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.topSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedTopSize(size)}
                          className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${selectedTopSize === size
                            ? "border-gray-900 bg-gray-100 text-gray-900"
                            : "border-gray-300 hover:border-gray-500"
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedProduct.bottomSizes?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold tracking-widest text-gray-500 mb-2">BOTTOM</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.bottomSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedBottomSize(size)}
                          className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${selectedBottomSize === size
                            ? "border-gray-900 bg-gray-100 text-gray-900"
                            : "border-gray-300 hover:border-gray-500"
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : selectedProduct.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "3XL", "4XL", "5XL"];
                    const sortedSizes = [...selectedProduct.sizes].sort((a, b) => {
                      const idxA = SIZE_ORDER.indexOf(a.toUpperCase());
                      const idxB = SIZE_ORDER.indexOf(b.toUpperCase());
                      if (idxA === -1 && idxB === -1) return a.localeCompare(b);
                      if (idxA === -1) return 1;
                      if (idxB === -1) return -1;
                      return idxA - idxB;
                    });
                    
                    return sortedSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${selectedSize === size
                        ? "border-gray-900 bg-gray-100 text-gray-900"
                        : "border-gray-300 hover:border-gray-500"
                        }`}
                    >
                      {size}
                    </button>
                  ))})()}
                </div>
              </div>
            )}

            {/* Size chart link */}
            <button
              onClick={() => setShowSizeChart(true)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors underline underline-offset-4 mb-6"
            >
              <Ruler className="h-4 w-4" />
              Size Chart
            </button>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(selectedProduct, selectedColor, selectedSize)}
              className="w-full py-4 rounded-lg font-bold transition-transform transform my-2 bg-black text-white hover:scale-[1.01] hover:bg-gray-800"
            >
              Add to Cart
            </button>

            <hr className="border-gray-200 my-6" />

            {/* Description — always visible */}
            {selectedProduct.description && (
              <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                {selectedProduct.description}
              </p>
            )}

            {/* ── Detail rows (always visible, no accordion) ── */}
            <div className="space-y-4 text-sm">
              {selectedProduct.material && (
                <div>
                  <p className="font-semibold text-gray-900">Material:</p>
                  <p className="text-gray-600">{selectedProduct.material}</p>
                </div>
              )}

              {selectedProduct.fit && (
                <div>
                  <p className="font-semibold text-gray-900">Fit:</p>
                  <p className="text-gray-600">{selectedProduct.fit}</p>
                </div>
              )}

              {selectedProduct.modelHeight && (
                <div>
                  <p className="font-semibold text-gray-900">Model Height:</p>
                  <p className="text-gray-600">{selectedProduct.modelHeight}</p>
                </div>
              )}

              {selectedProduct.modelIsWearing && (
                <div>
                  <p className="font-semibold text-gray-900">Model is Wearing:</p>
                  <p className="text-gray-600">{selectedProduct.modelIsWearing}</p>
                </div>
              )}

              {selectedProduct.colors?.length > 0 && (
                <div>
                  <p className="font-semibold text-gray-900">Colors:</p>
                  <p className="text-gray-600">{selectedProduct.colors.join(", ")}</p>
                </div>
              )}
            </div>

            {/* Shipping & Returns — always visible */}
            <hr className="border-gray-200 my-6" />
            <div className="space-y-2 text-sm">
              <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
              <div>
                <p className="font-semibold text-gray-900">Notes :</p>
                <p className="text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Delivery  :</p>
                <p className="text-gray-600">made to order takes 2 weeks / 10-12 days , excluding the weekend and festival holidays
                  .</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Care :</p>
                <p className="text-gray-600">Dry clean only .</p>
              </div>

            </div>

          </div>
        </div>

        {/* Reviews */}
        <div className="border-b border-gray-200 mt-16">
          <h3 className="text-gray-700 text-center font-medium text-2xl mt-8 mb-6">
            Customer Reviews ({reviews.length})
          </h3>
          <ReviewsDisplay reviews={reviews} loading={reviewsLoading} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-light mb-8 text-center text-gray-900">
              {productsSectionTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <div
                  key={product.id || product._id}
                  className={`${index >= 2 ? "hidden md:block" : ""} ${index >= 3 ? "lg:block" : ""}`}
                >
                  <ProductCard
                    product={product}
                    onProductClick={(p) => navigate(`/product/${p.id || p._id}`)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ProductPage;
