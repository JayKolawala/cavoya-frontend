// pages/ProductPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Truck, RefreshCw, Shield } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import LoadingSpinner from "../components/LoadingSpinner"; // Import your loading spinner

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart, products } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the product by ID from the URL
    const product = products.find((p) => p.id === parseInt(id));
    if (product) {
      setSelectedProduct(product);
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[1]);
    }
    setLoading(false);
  }, [id, products]);

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

  // Only define productImages after selectedProduct is confirmed to exist
  const productImages = [
    selectedProduct.image,
    `https://placehold.co/800x1200/E8D2C5/543C42?text=Detail+1`,
    `https://placehold.co/800x1200/F0E5D9/543C42?text=Detail+2`,
    `https://placehold.co/800x1200/E5E8F0/543C42?text=Detail+3`,
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/2">
          <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={productImages[activeImageIndex]}
              alt="Product Main Image"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {productImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product Detail ${index + 1}`}
                className={`w-full h-24 object-cover rounded-lg cursor-pointer transition-opacity ${
                  activeImageIndex === index
                    ? "ring-2 ring-pink-500"
                    : "hover:opacity-80"
                }`}
                onClick={() => setActiveImageIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="lg:w-1/2">
          <h1 className="text-4xl font-light mb-2">{selectedProduct.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(selectedProduct.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({selectedProduct.reviews} reviews)
            </span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold text-pink-500">
              ₹{selectedProduct.price}
            </span>
            {selectedProduct.isSale && (
              <span className="text-xl text-gray-400 line-through">
                ₹{selectedProduct.originalPrice}
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6">
            This elegant silk cami blouse is a timeless piece for any wardrobe.
            Made from 100% pure mulberry silk, it offers a luxurious feel and a
            beautiful drape. Perfect for both casual and formal occasions.
          </p>

          <div className="mb-6">
            <h4 className="font-medium text-lg mb-3">Color</h4>
            <div className="flex space-x-3">
              {selectedProduct.colors.map((color, index) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-full bg-${color}-300 border-2 transition-all ${
                    selectedColor === color
                      ? "border-gray-800 scale-110"
                      : "border-gray-300 hover:scale-105"
                  }`}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-medium text-lg mb-3">Size</h4>
            <div className="flex space-x-2">
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

          <button
            onClick={() =>
              addToCart(selectedProduct, selectedColor, selectedSize)
            }
            className="w-full py-4 bg-pink-500 text-white rounded-lg font-bold transition-transform transform hover:scale-[1.01] hover:bg-pink-600 mb-4"
          >
            Add to Cart
          </button>

          <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
            <div className="flex flex-col items-center">
              <Truck className="h-5 w-5 mb-1" />
              <span>Free Shipping</span>
            </div>
            <div className="flex flex-col items-center">
              <RefreshCw className="h-5 w-5 mb-1" />
              <span>Easy Returns</span>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-5 w-5 mb-1" />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
