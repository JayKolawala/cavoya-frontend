// pages/ProductPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Star,
  Truck,
  RefreshCw,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import LoadingSpinner from "../components/LoadingSpinner";

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart, products } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState(null);

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

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  // Data array for dynamic rendering
  const productDetails = {
    description: {
      text: "This elegant silk cami blouse is a timeless piece for any wardrobe. Made from 100% pure mulberry silk, it offers a luxurious feel and a beautiful drape. Perfect for both casual and formal occasions.",
      styleTip: {
        title: "Style Tip:",
        content:
          "Pair this shirt with fitted jeans for a casually cool look. Add sneakers for a laid-back vibe or dress it up with loafers for a touch of sophistication.",
      },
      features: [
        "Luxurious mulberry silk construction",
        "Versatile design for multiple occasions",
        "Natural temperature regulation",
        "Hypoallergenic and gentle on skin",
      ],
      additionalInfo:
        "The premium silk fabric ensures breathability and comfort throughout the day, while the elegant design makes it suitable for both professional and casual settings. The natural silk fibers provide excellent temperature regulation, keeping you cool in summer and warm in winter.",
    },
    details: {
      material: "100% Pure Mulberry Silk",
      care: "Dry clean only",
      fit: "Relaxed fit",
      origin: "Made in India",
      modelInfo: "The model is 5'7\" and wearing size M",
      skuPrefix: "SK-SILK-CAMI",
    },
    artist: {
      name: "Priya Sharma",
      title: "Senior Textile Designer",
      experience: "15+ years experience",
      collection: "Contemporary Silk Series 2024",
      philosophy:
        "Each garment is carefully crafted using traditional weaving techniques combined with modern design sensibilities. Priya believes in creating pieces that honor India's textile heritage while meeting contemporary style needs.",
      quote:
        "Fashion should be timeless, comfortable, and celebrate the beauty of craftsmanship.",
      initials: "PS",
    },
    services: [
      { icon: Truck, text: "Free Shipping" },
      { icon: RefreshCw, text: "Easy Returns" },
      { icon: Shield, text: "Secure Payment" },
    ],
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

  // Only define productImages after selectedProduct is confirmed to exist
  const productImages = [
    selectedProduct.image,
    `https://placehold.co/800x1200/E8D2C5/543C42?text=Detail+1`,
    `https://placehold.co/800x1200/F0E5D9/543C42?text=Detail+2`,
    `https://placehold.co/800x1200/E5E8F0/543C42?text=Detail+3`,
  ];

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
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        }`}
      >
        <div className="text-gray-600 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/2">
          <div className="w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden mb-4">
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
            {productDetails.description.text}
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
                    <p className="font-semibold text-gray-800">Material:</p>
                    <p>{productDetails.details.material}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Care:</p>
                    <p>{productDetails.details.care}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Fit:</p>
                    <p>{productDetails.details.fit}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Origin:</p>
                    <p>{productDetails.details.origin}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="font-semibold text-gray-800">
                    Model Information:
                  </p>
                  <p>{productDetails.details.modelInfo}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">SKU:</p>
                  <p className="text-gray-500">
                    {selectedProduct.id}
                    {productDetails.details.skuPrefix}
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
                <p>{productDetails.description.additionalInfo}</p>
                <div className="bg-pink-50 p-3 rounded-md border-l-4 border-pink-300">
                  <p className="font-semibold text-pink-800 mb-1">
                    {productDetails.description.styleTip.title}
                  </p>
                  <p className="text-pink-700">
                    {productDetails.description.styleTip.content}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-2">
                    Key Features:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {productDetails.description.features.map(
                      (feature, index) => (
                        <li key={index}>{feature}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection
              title="Artist's Details"
              isOpen={activeAccordion === "artist"}
              onToggle={() => toggleAccordion("artist")}
            >
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center">
                    <span className="text-pink-800 font-bold text-lg">
                      {productDetails.artist.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">
                      {productDetails.artist.name}
                    </p>
                    <p className="text-gray-600">
                      {productDetails.artist.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {productDetails.artist.experience}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-2">
                    Collection:
                  </p>
                  <p className="text-gray-700">
                    {productDetails.artist.collection}
                  </p>
                </div>

                <p className="text-gray-600">
                  {productDetails.artist.philosophy}
                </p>

                <div className="text-center pt-3">
                  <p className="text-xs text-gray-500 italic">
                    "{productDetails.artist.quote}"
                    <br />- {productDetails.artist.name}
                  </p>
                </div>
              </div>
            </AccordionSection>
          </div>

          {/* Services Section (commented out in original) */}
          {/* <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600 mt-4">
            {productDetails.services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="flex flex-col items-center">
                  <IconComponent className="h-5 w-5 mb-1" />
                  <span>{service.text}</span>
                </div>
              );
            })}
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
