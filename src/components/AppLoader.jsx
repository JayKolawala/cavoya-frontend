import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const AppLoader = ({ onLoadComplete }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate minimum loading time for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        onLoadComplete();
      }, 500); // Wait for fade-out animation to complete
    }, 1500);

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#4a1942] transition-opacity duration-500 ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-tangerine-500/10 via-blush-500/15 to-sea-500/10 animate-pulse"></div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-tangerine-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blush-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* Loader Content */}
      <div className="relative z-10 text-center px-4">
        <div className="mb-8 inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 animate-pulse">
          <Sparkles className="w-5 h-5 text-butter-300" />
          <span className="text-white text-lg font-light tracking-wider">
            Cavoya
          </span>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-tangerine-500 border-r-blush-500 animate-spin"></div>
          </div>
        </div>

        <p className="mt-6 text-gray-300 text-sm font-light">
          Loading your fashion experience...
        </p>
      </div>
    </div>
  );
};

export default AppLoader;
