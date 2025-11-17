import React, { useState } from "react";
import {
  ShoppingCart,
  User,
  Minus,
  Plus,
  X,
  Search,
  Heart,
  Star,
  Filter,
  Menu,
  ChevronDown,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import { useAppContext } from "../contexts/AppContext";

// Product Card Component

// Product Filters Component

// Home Page Component

// Products Page Component

// Product Detail Page Component

// Cart Page Component

// Wishlist Page Component

// Checkout Page Component

// Login & Register Pages (simplified for brevity)

// About Page Component

// Custom Alert Component

// Main App Component
const EtherealThreads = () => {
  const { currentPage } = useAppContext();

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "products":
        return <ProductsPage />;
      case "product":
        return <ProductPage />;
      case "cart":
        return <CartPage />;
      case "wishlist":
        return <WishlistPage />;
      case "checkout":
        return <CheckoutPage />;
      case "login":
        return <LoginPage />;
      case "register":
        return <RegisterPage />;
      case "about":
        return <AboutPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-800">
      <Header />
      <main className="flex-grow">{renderPage()}</main>
      <Footer />
      <CustomAlert />
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .hero-section {
          background-attachment: fixed;
        }
      `}</style>
    </div>
  );
};

export default EtherealThreads;
