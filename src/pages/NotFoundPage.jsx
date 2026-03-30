import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <h1 className="text-7xl font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
