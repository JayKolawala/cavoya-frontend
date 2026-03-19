// src/utils/api.js
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://cavoya-backend.onrender.com/api";

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

export const transformProduct = (product) => ({
  id: product._id || product.id,
  _id: product._id || product.id,
  name: product.name,
  price: product.price,
  originalPrice: product.originalPrice || product.price,
  category: product.category,
  avgRating: product.avgRating || 0,
  totalRatings: product.totalRatings || 0,
  rating: product.avgRating || 0,
  reviews: product.totalRatings || 0,
  colors: product.colors || [],
  sizes: product.sizes || [],
  image: product.image,
  images: product.images || [],
  isNew: false,
  isSale: product.isSale || false,
  description: product.description,
  inventory: product.inventory,
  isFeatured: product.isFeatured || false,
  bestSeller: product.bestSeller || false,
  collectionName: product.collectionName || product.print?.collectionId || null,
  printName: product.printName || product.print?.printId || null,
  collectionId: product.print?.collectionId || null,
  printId: product.print?.printId || null,
});
