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
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 transition-opacity duration-500 ${isLoading ? "opacity-100" : "opacity-0"
        }`}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-gray-500/10 to-white/5 animate-pulse"></div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-400/5 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* Loader Content */}
      <div className="relative z-10 text-center px-4">
        <div className="mb-8 inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 animate-pulse">
          <Sparkles className="w-5 h-5 text-gray-300" />
          <span className="text-white text-lg font-light tracking-wider">
            Cavoya
          </span>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-gray-400 animate-spin"></div>
          </div>
        </div>

        <p className="mt-6 text-gray-400 text-sm font-light">
          Loading your fashion experience...
        </p>
      </div>
    </div>
  );
};

export default AppLoader;
