// components/LoadingSpinner.jsx
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-16 w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
      <p className="ml-2 text-gray-600">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
