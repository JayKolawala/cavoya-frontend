// src/utils/api.js

// Centralized API URL
const DEV_API_URL = 'http://localhost:5000/api';
const PROD_API_URL = 'https://cavoya-backend.onrender.com/api';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? DEV_API_URL : PROD_API_URL);

// Default timeout (15 seconds)
const DEFAULT_TIMEOUT = 15000;

/**
 * Fetch with timeout
 */
export const fetchWithTimeout = async (url, options = {}, timeout = DEFAULT_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeout / 1000}s. Please try again.`);
    }
    throw error;
  }
};

/**
 * API request wrapper with auth, timeout, and error handling
 */
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
    const response = await fetchWithTimeout(url, config);
    
    if (response.status === 204) {
      return { success: true };
    }

    const data = await response.json();

    if (!response.ok) {
      throw Object.assign(new Error(data.message || "Something went wrong"), {
        status: response.status,
        data,
      });
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
  material: product.material || '',
  fit: product.fit || '',
  modelHeight: product.modelHeight || '',
  modelIsWearing: product.modelIsWearing || '',
  isFeatured: product.isFeatured || false,
  bestSeller: product.bestSeller || false,
  collectionName: product.collectionName || product.print?.collectionId || null,
  printName: product.printName || product.print?.printId || null,
  collectionId: product.print?.collectionId || null,
  printId: product.print?.printId || null,
});
