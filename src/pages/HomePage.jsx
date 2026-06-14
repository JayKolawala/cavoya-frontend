// pages/HomePage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Star, Sparkles, Heart, ShoppingCart } from "lucide-react";
import useProductStore from "../store/useProductStore";
import useWishlistStore from "../store/useWishlistStore";
import useCartStore from "../store/useCartStore";
import useUIStore from "../store/useUIStore";
import { useNavigate } from "react-router-dom";
import ProductSkeleton from "../components/ProductSkeleton";
import bgVideo2 from "../assets/MidnightBloom.MP4";
import { isVideo, getOptimizedImageUrl } from "../utils/mediaHelpers";
import { API_BASE_URL, API_ENDPOINTS } from "../utils/apiHelpers";
import { transformProduct } from "../utils/api";
import heroBg from "/hero-bg.PNG";
import HeroCarousel from "../components/HeroCarousel";

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_RETRIES = 3;          // stop retrying after this many attempts
const RETRY_DELAY_MS = 5000;    // wait 5 s between retries (not 60 s)
const PRINT_YEARS = ["2025", "2025", "2024", "2023"];

// ─── Generic fetch-with-retry helper ──────────────────────────────────────────
// Returns { data, error }.  Respects an AbortSignal so unmounting cancels it.
async function fetchWithRetry(url, signal, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      // Don't retry if the caller aborted (component unmounted)
      if (err.name === "AbortError") return { data: null, error: "aborted" };
      // Don't retry on the last attempt
      if (attempt === retries) return { data: null, error: err.message };
      // Wait before next attempt
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
const HomePage = () => {
  // FIX 1: Destructure with useCallback-stable references where needed.
  // Most Zustand selectors are already stable, but we add `useCallback` for
  // fetchProducts to guarantee the effect doesn't re-fire on every render.
  const fetchProductsRaw = useProductStore((s) => s.fetchProducts);
  const fetchProducts = useCallback(fetchProductsRaw, []); // stable reference

  const { toggleWishlist, wishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { showCustomAlert: showAlert } = useUIStore();

  const [_selectedProduct, setSelectedProduct] = useState(null);
  const [prints, setPrints] = useState([]);
  const [printsLoading, setPrintsLoading] = useState(true);
  const [printsError, setPrintsError] = useState(null);

  const [bestSellers, setBestSellers] = useState([]);
  const [bestSellersLoading, setBestSellersLoading] = useState(true);
  const [bestSellersError, setBestSellersError] = useState(null);

  const [newInProducts, setNewInProducts] = useState([]);
  const [newInLoading, setNewInLoading] = useState(true);
  const [newInError, setNewInError] = useState(null);

  const [videoError, setVideoError] = useState(false);
  const navigate = useNavigate();

  // ── Effect 1: global product store (used elsewhere in the app) ─────────────
  // FIX 2: stable `fetchProducts` ref means this only runs once on mount.
  useEffect(() => {
    fetchProducts({ limit: 100 });
  }, [fetchProducts]);

  // ── Effect 2: Prints ────────────────────────────────────────────────────────
  // FIX 3: AbortController cancels in-flight requests on unmount, preventing
  // state updates after the component is gone (and the phantom re-render loop).
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setPrintsLoading(true);
      const { data, error } = await fetchWithRetry(
        `${API_BASE_URL}${API_ENDPOINTS.PRINTS}`,
        controller.signal
      );

      if (error === "aborted") return; // component unmounted – do nothing

      if (error) {
        setPrintsError(error);
      } else {
        const arr = Array.isArray(data) ? data : data?.data ?? data?.prints ?? [];
        setPrints(arr);
        setPrintsError(null);
      }
      setPrintsLoading(false);
    })();

    return () => controller.abort();
  }, []); // ← empty array: run exactly once on mount

  // ── Effect 3: Best sellers ──────────────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setBestSellersLoading(true);

      const { data, error } = await fetchWithRetry(
        `${API_BASE_URL}/products?bestSeller=true&limit=4`,
        controller.signal
      );

      if (error === "aborted") return;

      if (error) {
        setBestSellersError(error);
      } else {
        let sellers = (data?.data ?? []).map(transformProduct);

        if (sellers.length === 0) {
          const { data: fbData, error: fbError } = await fetchWithRetry(
            `${API_BASE_URL}/products?limit=4`,
            controller.signal
          );
          if (fbError === "aborted") return;
          sellers = fbError ? [] : (fbData?.data ?? []).map(transformProduct);
        }

        setBestSellers(sellers);
        setBestSellersError(null);
      }
      setBestSellersLoading(false);
    })();

    return () => controller.abort();
  }, []);

  // ── Effect 4: New-in products ───────────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setNewInLoading(true);

      const { data, error } = await fetchWithRetry(
        `${API_BASE_URL}/products?limit=6`,
        controller.signal
      );

      if (error === "aborted") return;

      if (error) {
        setNewInError(error);
      } else {
        const arr = (data?.data ?? []).map(transformProduct);
        setNewInProducts(arr);
        setNewInError(null);
      }
      setNewInLoading(false);
    })();

    return () => controller.abort();
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
  };

  const handleNavigateToProducts = () => navigate("/products");

  const handlePrintClick = (print) => {
    const printId = print._id || print.id;
    const collectionId = print.collection?._id || print.collection;
    if (collectionId) {
      navigate(`/products?collectionId=${collectionId}&printId=${printId}`);
    } else {
      navigate(`/products?printId=${printId}`);
    }
  };

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    const hasSizes =
      product.sizes?.length > 0 ||
      product.topSizes?.length > 0 ||
      product.bottomSizes?.length > 0;

    if (hasSizes) {
      handleProductClick(product);
    } else {
      addToCart(product);
      showAlert("Added to cart successfully!", "success");
    }
  };

  const quickAddLabel = (product) =>
    product.sizes?.length > 0 ||
      product.topSizes?.length > 0 ||
      product.bottomSizes?.length > 0
      ? "Select Size"
      : "Quick Add";

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in overflow-hidden">
      {/* ── Hero ── */}
      <HeroCarousel />

      {/* ── NEW IN ── */}
      <section className="relative py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-2 text-gray-900 tracking-wide">
              NEW IN
            </h2>
          </div>

          {newInLoading || newInError ? (
            <ProductSkeleton count={6} columns="3cols" />
          ) : newInProducts.length === 0 ? (
            <p className="text-center text-gray-500">No new arrivals available</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
              {newInProducts.map((product, index) => {
                const isInWishlist = wishlist.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative">
                      <div
                        className="relative aspect-[3/4] overflow-hidden bg-white cursor-pointer"
                        onClick={() => handleProductClick(product)}
                      >
                        {isVideo(product.image) ? (
                          <video
                            src={product.image}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={getOptimizedImageUrl(product.image)}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        className="absolute top-4 right-4 p-2 bg-white rounded-none shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart
                          className={`h-4 w-4 ${isInWishlist
                            ? "fill-gray-900 text-gray-900"
                            : "text-gray-600 hover:text-gray-900"
                            } transition-colors`}
                        />
                      </button>

                      {product.discount && (
                        <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                          SALE
                        </div>
                      )}

                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <button
                          onClick={(e) => handleQuickAdd(e, product)}
                          className="w-full bg-black text-white py-2 px-4 rounded-none font-medium flex items-center justify-center gap-2 hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
                        >

                          {quickAddLabel(product)}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-10">
            <button
              onClick={handleNavigateToProducts}
              className="text-gray-700 hover:text-black text-sm font-medium inline-flex items-center gap-2 group"
            >
              View All New In
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Video break ── */}
      <section className="w-full bg-black">
        <div className="relative w-full min-h-[70vh] md:min-h-[100vh] overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800">
          {!videoError && (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onError={() => setVideoError(true)}
            >
              <source src={bgVideo2} type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center px-4">
              <h3 className="text-4xl md:text-5xl font-serif text-white mb-4">
                Designed for Movement & Comfort
              </h3>
              <p className="text-lg md:text-xl text-gray-300">
                Experience the Cavoya Difference
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOP BY PRINTS ── */}
      <section className="relative py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-3 text-gray-900 tracking-wider">
              SHOP BY PRINTS
            </h2>
            <div className="w-16 h-[2px] bg-black mx-auto"></div>
          </div>

          {printsLoading || printsError ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[2/1] bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
              {prints.map((print, index) => {
                const year = PRINT_YEARS[index % PRINT_YEARS.length];
                return (
                  <div
                    key={print._id || print.id}
                    className="group relative cursor-pointer overflow-hidden aspect-[2/1] bg-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                    onClick={() => handlePrintClick(print)}
                  >
                    <img
                      src={getOptimizedImageUrl(print.image)}
                      alt={print.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                    />
                    {/* Dark gradient overlay on the left for maximum contrast and elegance */}
                    <div className="absolute inset-0 bg-black/10 bg-gradient-to-r from-black/55 via-black/15 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-center items-start p-6 sm:p-8 md:p-10 lg:p-12 z-10 text-white select-none">
                      {/* Year */}


                      {/* Print name formatted as spaced uppercase text */}
                      <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.3em] uppercase mb-4 md:mb-6 leading-none transition-transform duration-700 group-hover:translate-x-1">
                        {print.name}
                      </h3>

                      {/* Solid black rectangular SHOP NOW button */}
                      <div className="inline-block bg-[#111] text-white text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase px-5 py-2.5 sm:px-7 sm:py-3 transition-all duration-300 group-hover:bg-black group-hover:scale-[1.02] border border-transparent hover:border-white/20">
                        SHOP NOW
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section className="relative py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-2 text-gray-900 tracking-wide">
              BEST SELLERS
            </h2>
          </div>

          {bestSellersLoading || bestSellersError ? (
            <ProductSkeleton count={4} columns="4cols" />
          ) : bestSellers.length === 0 ? (
            <p className="text-center text-gray-500">No best sellers available</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {bestSellers.map((product, index) => (
                <div
                  key={product.id}
                  className="group animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className="cursor-pointer mb-4"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
                      {isVideo(product.image) ? (
                        <video
                          src={product.image}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={getOptimizedImageUrl(product.image)}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">₹{product.price}</p>
                  </div>
                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    className="w-full bg-black text-white py-2 px-4 rounded-none font-medium flex items-center justify-center gap-2 hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
                  >
                    {quickAddLabel(product)}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;