import React, { useEffect, useState } from "react";
import { Heart, X } from "lucide-react";
import useUIStore from "../store/useUIStore";
import { useNavigate } from "react-router-dom";

const WishlistToast = () => {
  const { wishlistToast, hideWishlistToast } = useUIStore();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  // Trigger slide-in animation when toast appears
  useEffect(() => {
    if (wishlistToast) {
      // Small delay so the element is mounted before the CSS transition fires
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [wishlistToast]);

  if (!wishlistToast) return null;

  const { message, added } = wishlistToast;

  return (
    <div
      className="fixed bottom-6 right-6 z-[200] pointer-events-none"
      style={{ perspective: "600px" }}
    >
      <div
        className="pointer-events-auto"
        style={{
          transform: visible
            ? "translateX(0) translateY(0) scale(1)"
            : "translateX(100%) scale(0.9)",
          opacity: visible ? 1 : 0,
          transition:
            "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
          willChange: "transform, opacity",
        }}
      >
        <div className="flex items-center gap-3 bg-white rounded-2xl shadow-2xl border border-gray-100 px-4 py-3 min-w-[260px] max-w-xs">
          {/* Heart icon pill */}
          <div
            className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl ${
              added
                ? "bg-red-50"
                : "bg-gray-100"
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                added
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-gray-400"
              }`}
              strokeWidth={added ? 0 : 2}
            />
          </div>

          {/* Text block */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {added ? "Added to Wishlist" : "Removed from Wishlist"}
            </p>
            <button
              onClick={() => {
                hideWishlistToast();
                navigate("/wishlist");
              }}
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors mt-0.5 underline underline-offset-2"
            >
              View Wishlist →
            </button>
          </div>

          {/* Dismiss button */}
          <button
            onClick={hideWishlistToast}
            className="flex-shrink-0 p-1 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-1.5 h-0.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${added ? "bg-red-400" : "bg-gray-400"}`}
            style={{
              animation: visible ? "toast-progress 3s linear forwards" : "none",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default WishlistToast;
