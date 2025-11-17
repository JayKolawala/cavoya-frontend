import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Star,
  Truck,
  RefreshCw,
  Shield,
  ChevronDown,
  ChevronUp,
  Play,
} from "lucide-react";
import { useAppContext } from "../contexts/AppContext";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
  </div>
);

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart, products, fetchProductById } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState(null);

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
          product.colors && product.colors.length > 0 ? product.colors[0] : ""
        );
        setSelectedSize(
          product.sizes && product.sizes.length > 0 ? product.sizes[0] : ""
        );
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
          className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
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
      type: selectedProduct.image.match(/\.(mp4|webm|ogg)$/i)
        ? "video"
        : "image",
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
          type: mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? "video" : "image",
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
          isOpen ? "max-h-[600px] pb-4" : "max-h-0"
        }`}
      >
        <div className="text-gray-600 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );

  const getColorClasses = (color) => {
    const colorMap = {
      red: "bg-red-400",
      blue: "bg-blue-400",
      green: "bg-green-400",
      yellow: "bg-yellow-400",
      pink: "bg-pink-400",
      purple: "bg-purple-400",
      black: "bg-black",
      white: "bg-white border-2",
      gray: "bg-gray-400",
      grey: "bg-gray-400",
      charcoal: "bg-gray-700",
      blush: "bg-pink-200",
      navy: "bg-blue-900",
      beige: "bg-amber-100",
      brown: "bg-amber-800",
      orange: "bg-orange-400",
    };

    const lowerColor = color.toLowerCase();
    return colorMap[lowerColor] || "bg-gray-300";
  };

  return (
    <section className="container mx-auto px-4 pt-24">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Media Gallery */}
        <div className="lg:w-1/2">
          <div className="w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
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
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            {productMedia.map((media, index) => (
              <div
                key={index}
                className={`relative w-full h-24 rounded-lg cursor-pointer transition-all ${
                  activeMediaIndex === index
                    ? "ring-2 ring-pink-500"
                    : "hover:opacity-80"
                }`}
                onClick={() => setActiveMediaIndex(index)}
              >
                {media.type === "video" ? (
                  <>
                    <video
                      src={media.url}
                      className="w-full h-full object-cover rounded-lg"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </>
                ) : (
                  <img
                    src={media.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2">
          <h1 className="text-4xl font-light mb-2">{selectedProduct.name}</h1>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(selectedProduct.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({selectedProduct.reviews || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold text-pink-500">
              ₹{selectedProduct.price}
            </span>
            {selectedProduct.originalPrice &&
              selectedProduct.originalPrice > selectedProduct.price && (
                <span className="text-xl text-gray-400 line-through">
                  ₹{selectedProduct.originalPrice}
                </span>
              )}
            {selectedProduct.isSale && (
              <span className="bg-red-500 text-white px-2 py-1 text-sm rounded">
                SALE
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            {selectedProduct.description || "No description available."}
          </p>

          {/* Stock Status */}
          <div className="mb-6">
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
          </div>

          {/* Color Selection */}
          {selectedProduct.colors && selectedProduct.colors.length > 0 && (
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
                    )} border-2 transition-all ${
                      selectedColor === color
                        ? "border-gray-800 scale-110 ring-2 ring-pink-300"
                        : "border-gray-300 hover:scale-105"
                    }`}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

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
                        ? "border-pink-500 bg-pink-50 text-pink-600"
                        : "border-gray-300 hover:border-pink-300"
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
                ? "bg-pink-500 text-white hover:scale-[1.01] hover:bg-pink-600"
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

          {/* Accordion Sections */}
          <div className="border-t border-gray-200 bg-white rounded-lg">
            <AccordionSection
              title="Product Details"
              isOpen={activeAccordion === "details"}
              onToggle={() => toggleAccordion("details")}
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-gray-800">Category:</p>
                    <p>{selectedProduct.category || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Stock:</p>
                    <p>{selectedProduct.inventory?.stock || 0} units</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Colors:</p>
                    <p>{selectedProduct.colors?.join(", ") || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Sizes:</p>
                    <p>{selectedProduct.sizes?.join(", ") || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Product ID:</p>
                  <p className="text-gray-500">
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
                <p>
                  {selectedProduct.description ||
                    "No detailed description available."}
                </p>

                {selectedProduct.isFeatured && (
                  <div className="bg-purple-50 p-3 rounded-md border-l-4 border-purple-300">
                    <p className="font-semibold text-purple-800 mb-1">
                      ⭐ Featured Product
                    </p>
                    <p className="text-purple-700">
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
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Truck className="h-5 w-5 text-pink-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Free Shipping</p>
                    <p className="text-sm">Free delivery on orders over ₹999</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <RefreshCw className="h-5 w-5 text-pink-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Easy Returns</p>
                    <p className="text-sm">
                      30-day return policy for unused items
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-pink-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Secure Payment
                    </p>
                    <p className="text-sm">
                      All transactions are encrypted and secure
                    </p>
                  </div>
                </div>
              </div>
            </AccordionSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
