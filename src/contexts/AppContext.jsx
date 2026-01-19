import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";

const AppContext = createContext();

const initialState = {
  currentPage: "home",
  cartItems: [],
  wishlist: [],
  user: null,
  showAlert: false,
  alertMessage: "",
  searchQuery: "",
  selectedCategory: "all",
  selectedCollection: null,
  selectedNewArrivals: false,
  sortBy: "featured",
  showMobileMenu: false,
  products: [],
  productsLoading: false,
  productsError: null,
  // Pagination state
  nextCursor: null,
  hasMore: true,
  productsLimit: 12,
  shippingInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  },
  paymentMethod: "card",
  orderConfirmed: false,
  orderNumber: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, currentPage: action.payload, showMobileMenu: false };

    case "ADD_TO_CART":
      const existingItem = state.cartItems.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.color === action.payload.color &&
          item.size === action.payload.size,
      );

      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [
            ...state.cartItems,
            { ...action.payload, id: Date.now() },
          ],
        };
      }

    case "UPDATE_CART_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: Math.max(1, item.quantity + action.payload.change),
              }
            : item,
        ),
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
      };

    case "TOGGLE_WISHLIST":
      const productId = action.payload;
      return {
        ...state,
        wishlist: state.wishlist.includes(productId)
          ? state.wishlist.filter((id) => id !== productId)
          : [...state.wishlist, productId],
      };

    case "SET_USER":
      return { ...state, user: action.payload };

    case "SHOW_ALERT":
      return { ...state, showAlert: true, alertMessage: action.payload };

    case "HIDE_ALERT":
      return { ...state, showAlert: false, alertMessage: "" };

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };

    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.payload };

    case "SET_COLLECTION":
      return { ...state, selectedCollection: action.payload };

    case "SET_NEW_ARRIVALS":
      return { ...state, selectedNewArrivals: action.payload };

    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload };

    case "TOGGLE_MOBILE_MENU":
      return { ...state, showMobileMenu: !state.showMobileMenu };

    case "SET_MOBILE_MENU":
      return { ...state, showMobileMenu: action.payload };

    case "SET_SHIPPING_INFO":
      return {
        ...state,
        shippingInfo: { ...state.shippingInfo, ...action.payload },
      };

    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.payload };

    case "CONFIRM_ORDER":
      return {
        ...state,
        orderConfirmed: true,
        cartItems: [],
      };

    case "SET_ORDER_NUMBER":
      return { ...state, orderNumber: action.payload };

    case "RESET_CHECKOUT":
      return {
        ...state,
        shippingInfo: initialState.shippingInfo,
        paymentMethod: "card",
        orderConfirmed: false,
        orderNumber: null,
      };

    case "SET_PRODUCTS_LOADING":
      return { ...state, productsLoading: action.payload };

    case "SET_PRODUCTS_ERROR":
      return { ...state, productsError: action.payload };

    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload.products,
        nextCursor: action.payload.nextCursor || null,
        hasMore:
          action.payload.hasMore !== undefined ? action.payload.hasMore : false,
        productsLoading: false,
        productsError: null,
      };

    case "LOAD_MORE_PRODUCTS":
      return {
        ...state,
        products: [...state.products, ...action.payload.products],
        nextCursor: action.payload.nextCursor || null,
        hasMore:
          action.payload.hasMore !== undefined ? action.payload.hasMore : false,
        productsLoading: false,
      };

    case "RESET_PRODUCTS":
      return {
        ...state,
        products: [],
        nextCursor: null,
        hasMore: true,
        productsLoading: true,
      };

    case "SET_PAGINATION":
      return {
        ...state,
        nextCursor: action.payload.nextCursor || null,
        hasMore:
          action.payload.hasMore !== undefined ? action.payload.hasMore : false,
      };

    case "ADD_PRODUCT":
      return {
        ...state,
        products: [...state.products, action.payload],
      };

    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product,
        ),
      };

    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter(
          (product) => product._id !== action.payload,
        ),
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // API Base URL
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://cavoya-backend.onrender.com/api";

  // API request helper
  const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get authentication token from localStorage
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // Add auth token if available
        ...options.headers,
      },
      ...options,
    };

    // Remove Content-Type header for FormData (browser will set it automatically with boundary)
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

  // Helper function to transform product data
  const transformProduct = (product) => ({
    id: product._id || product.id,
    _id: product._id || product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice || product.price,
    category: product.category,
    rating: product.rating || 4.5,
    reviews: product.reviews || 0,
    colors: product.colors || [],
    sizes: product.sizes || [],
    image: product.image,
    images: product.images || [], // Add images array from API
    isNew: false,
    isSale: product.isSale || false,
    description: product.description,
    inventory: product.inventory,
    isFeatured: product.isFeatured || false,
    bestSeller: product.bestSeller || false,
  });

  // Fetch products from API with pagination support
  const fetchProducts = async (options = {}) => {
    try {
      const {
        limit = state.productsLimit,
        cursor = null,
        category = null,
        isFeatured = null,
        append = false,
      } = options;

      dispatch({ type: "SET_PRODUCTS_LOADING", payload: true });

      // Build query string
      const queryParams = new URLSearchParams();
      queryParams.append("limit", limit);

      if (cursor) {
        queryParams.append("cursor", cursor);
      }
      if (category && category !== "all") {
        queryParams.append("category", category);
      }
      if (isFeatured !== null) {
        queryParams.append("isFeatured", isFeatured);
      }

      const response = await apiRequest(`/products?${queryParams.toString()}`);

      // Transform backend data to match frontend structure
      const transformedProducts = response.data.map(transformProduct);

      // Handle pagination response
      const paginationData = {
        products: transformedProducts,
        nextCursor: response.pagination?.nextCursor || null,
        hasMore: response.pagination?.hasMore || false,
      };

      // Dispatch appropriate action based on append flag
      if (append) {
        dispatch({ type: "LOAD_MORE_PRODUCTS", payload: paginationData });
      } else {
        dispatch({ type: "SET_PRODUCTS", payload: paginationData });
      }
    } catch (error) {
      dispatch({ type: "SET_PRODUCTS_ERROR", payload: error.message });
      console.error("Error fetching products:", error);
    }
  };

  // Fetch single product by ID from API
  const fetchProductById = async (productId) => {
    try {
      const response = await apiRequest(`/products/${productId}`);
      if (response.success && response.data) {
        return transformProduct(response.data);
      }
      return null;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };

  // Load more products for infinite scroll
  const loadMoreProducts = async () => {
    if (!state.hasMore || state.productsLoading) {
      return;
    }

    await fetchProducts({
      cursor: state.nextCursor,
      category:
        state.selectedCategory !== "all" ? state.selectedCategory : null,
      append: true,
    });
  };

  // Reset and fetch products (used when filters change)
  const resetAndFetchProducts = async () => {
    dispatch({ type: "RESET_PRODUCTS" });
    await fetchProducts({
      category:
        state.selectedCategory !== "all" ? state.selectedCategory : null,
    });
  };

  // Add product - using FormData for file uploads with multiple images/videos
  const addProduct = async (productData) => {
    try {
      const formData = new FormData();

      // Add text fields
      formData.append("name", productData.name);
      formData.append("description", productData.description || "");
      formData.append("price", Number(productData.price));
      formData.append("category", productData.category || "Uncategorized");

      // Add colors and sizes as JSON strings
      formData.append("colors", JSON.stringify(productData.colors || []));
      formData.append("sizes", JSON.stringify(productData.sizes || []));

      // Add inventory as JSON string
      formData.append(
        "inventory",
        JSON.stringify({
          stock: Number(productData.inventory?.stock) || 0,
          trackQuantity: true,
        }),
      );

      // Add optional fields
      if (productData.originalPrice) {
        formData.append("originalPrice", Number(productData.originalPrice));
      }
      if (productData.isFeatured !== undefined) {
        formData.append("isFeatured", productData.isFeatured);
      }
      if (productData.bestSeller !== undefined) {
        formData.append("bestSeller", productData.bestSeller);
      }

      // Add multiple image/video files
      if (productData.imageFiles && productData.imageFiles.length > 0) {
        // First file is the main image
        formData.append("image", productData.imageFiles[0]);

        // Additional files as additionalImages
        for (let i = 1; i < productData.imageFiles.length; i++) {
          formData.append("additionalImages", productData.imageFiles[i]);
        }
      } else if (productData.image && productData.image.trim()) {
        // If no files but there's an image URL
        formData.append("imageUrl", productData.image);
      }

      const response = await apiRequest("/products", {
        method: "POST",
        body: formData,
      });

      // Transform the response to match frontend structure
      const newProduct = {
        ...transformProduct(response.data),
        isNew: true,
      };

      dispatch({ type: "ADD_PRODUCT", payload: newProduct });
      showCustomAlert("Product added successfully!");
      return response;
    } catch (error) {
      showCustomAlert(`Error adding product: ${error.message}`);
      throw error;
    }
  };

  // Update product - using FormData for file uploads with multiple images/videos
  const updateProduct = async (id, productData) => {
    try {
      const formData = new FormData();

      // Add text fields
      formData.append("name", productData.name);
      formData.append("description", productData.description || "");
      formData.append("price", Number(productData.price));
      formData.append("category", productData.category || "Uncategorized");

      // Add colors and sizes as JSON strings
      formData.append("colors", JSON.stringify(productData.colors || []));
      formData.append("sizes", JSON.stringify(productData.sizes || []));

      // Add inventory as JSON string
      formData.append(
        "inventory",
        JSON.stringify({
          stock: Number(productData.inventory?.stock) || 0,
          trackQuantity: true,
        }),
      );

      // Add optional fields
      if (productData.originalPrice) {
        formData.append("originalPrice", Number(productData.originalPrice));
      }
      if (productData.isFeatured !== undefined) {
        formData.append("isFeatured", productData.isFeatured);
      }
      if (productData.bestSeller !== undefined) {
        formData.append("bestSeller", productData.bestSeller);
      }

      // Handle images - if new files uploaded, they replace existing ones
      if (productData.imageFiles && productData.imageFiles.length > 0) {
        // First file is the main image
        formData.append("image", productData.imageFiles[0]);

        // Additional files as additionalImages
        for (let i = 1; i < productData.imageFiles.length; i++) {
          formData.append("additionalImages", productData.imageFiles[i]);
        }
      } else {
        // No new files - keep existing images
        if (productData.image && productData.image.trim()) {
          formData.append("imageUrl", productData.image);
        }

        // Keep existing additional images
        if (
          productData.existingImages &&
          productData.existingImages.length > 0
        ) {
          formData.append(
            "existingImages",
            JSON.stringify(productData.existingImages),
          );
        }
      }

      const response = await apiRequest(`/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      // Transform the response to match frontend structure
      const updatedProduct = transformProduct(response.data);

      dispatch({ type: "UPDATE_PRODUCT", payload: updatedProduct });
      showCustomAlert("Product updated successfully!");
      return response;
    } catch (error) {
      showCustomAlert(`Error updating product: ${error.message}`);
      throw error;
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await apiRequest(`/products/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "DELETE_PRODUCT", payload: id });
      showCustomAlert("Product deleted successfully!");
    } catch (error) {
      showCustomAlert(`Error deleting product: ${error.message}`);
      throw error;
    }
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Track if component has mounted (to prevent filter useEffect from running on initial render)
  const hasMountedRef = useRef(false);

  // Reset pagination when filters change (but not on initial mount)
  useEffect(() => {
    if (hasMountedRef.current) {
      // Only reset if filters have changed after initial mount
      resetAndFetchProducts();
    } else {
      // Mark as mounted after initial render
      hasMountedRef.current = true;
    }
  }, [state.selectedCategory, state.sortBy]);

  const showCustomAlert = (message, callback) => {
    dispatch({ type: "SHOW_ALERT", payload: message });
    if (callback) {
      setTimeout(() => {
        dispatch({ type: "HIDE_ALERT" });
        callback();
      }, 2000);
    } else {
      setTimeout(() => {
        dispatch({ type: "HIDE_ALERT" });
      }, 3000);
    }
  };

  const addToCart = (product, selectedColor, selectedSize) => {
    if (!product.id && !product._id) {
      console.error("Cannot add to cart: Product ID is missing", product);
      showCustomAlert("Error: Product data is incomplete");
      return;
    }

    const cartItem = {
      productId: product.id || product._id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
      image: product.image,
    };
    dispatch({ type: "ADD_TO_CART", payload: cartItem });
    showCustomAlert("Item added to cart successfully!");
  };

  const updateCartQuantity = (id, change) => {
    dispatch({ type: "UPDATE_CART_QUANTITY", payload: { id, change } });
  };

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
    showCustomAlert("Item removed from cart");
  };

  const toggleWishlist = (productId) => {
    dispatch({ type: "TOGGLE_WISHLIST", payload: productId });
    const isInWishlist = state.wishlist.includes(productId);
    showCustomAlert(
      isInWishlist ? "Removed from wishlist" : "Added to wishlist",
    );
  };

  const getTotalPrice = () => {
    return state.cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const getCartItemsCount = () => {
    return state.cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredProducts = state.products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(state.searchQuery.toLowerCase());

    // Case-insensitive category matching - normalize both values to lowercase for comparison
    const matchesCategory =
      state.selectedCategory === "all" ||
      product.category?.toLowerCase().trim() ===
        state.selectedCategory?.toLowerCase().trim();

    // Collection filtering - check category field since collection field doesn't exist in API
    // "Solset" is actually stored as a category in the database
    const matchesCollection =
      !state.selectedCollection ||
      product.category?.toLowerCase().trim() ===
        state.selectedCollection?.toLowerCase().trim();

    // New arrivals - use isFeatured since isNew field doesn't exist in API
    const matchesNewArrivals =
      !state.selectedNewArrivals || product.isFeatured === true;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesCollection &&
      matchesNewArrivals
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (state.sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.isNew - a.isNew;
      default:
        return 0;
    }
  });

  const setShippingInfo = (info) => {
    dispatch({ type: "SET_SHIPPING_INFO", payload: info });
  };

  const setPaymentMethod = (method) => {
    dispatch({ type: "SET_PAYMENT_METHOD", payload: method });
  };

  // Create order via API
  const createOrder = async (paymentInfo = null) => {
    try {
      // Transform cart items to API format
      const items = state.cartItems.map((item) => {
        if (!item.productId) {
          console.error("Missing product ID for item:", item);
        }
        return {
          productId: item.productId, // Changed from product to productId based on user request
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          color: item.color || "Default",
          size: item.size || "Default",
          subtotal: item.price * item.quantity,
        };
      });

      // Validate items
      const invalidItems = items.filter((item) => !item.productId);
      if (invalidItems.length > 0) {
        throw new Error(
          `Cannot create order: ${invalidItems.length} items have missing product IDs`,
        );
      }

      // Calculate pricing
      const subtotal = parseFloat(getTotalPrice());
      const shippingCost = 0; // Free shipping
      const taxRate = 0.18; // 18% GST
      const tax = subtotal * taxRate;
      const total = subtotal + shippingCost + tax;

      // Prepare order data
      const orderData = {
        customer: {
          name: `${state.shippingInfo.firstName} ${state.shippingInfo.lastName}`,
          email: state.shippingInfo.email,
          phone: state.shippingInfo.phone,
        },
        shippingAddress: {
          street: state.shippingInfo.address2
            ? `${state.shippingInfo.address1}, ${state.shippingInfo.address2}`
            : state.shippingInfo.address1,
          city: state.shippingInfo.city,
          state: state.shippingInfo.state,
          postalCode: state.shippingInfo.zipCode,
          country: state.shippingInfo.country || "India",
        },
        items,
        payment: {
          method: state.paymentMethod,
          status: paymentInfo ? "paid" : "pending",
          ...(paymentInfo && { transactionId: paymentInfo.paymentId }),
        },
        pricing: {
          subtotal: parseFloat(subtotal.toFixed(2)),
          shippingCost: parseFloat(shippingCost.toFixed(2)),
          tax: parseFloat(tax.toFixed(2)),
          discount: 0,
          total: parseFloat(total.toFixed(2)),
        },
      };

      const response = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      });

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error("Failed to create order");
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const confirmOrder = (orderNumber = null) => {
    if (orderNumber) {
      dispatch({ type: "SET_ORDER_NUMBER", payload: orderNumber });
    }
    dispatch({ type: "CONFIRM_ORDER" });
    showCustomAlert("Order confirmed successfully!");
  };

  const resetCheckout = () => {
    dispatch({ type: "RESET_CHECKOUT" });
  };

  const value = {
    ...state,
    dispatch,
    showCustomAlert,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    toggleWishlist,
    getTotalPrice,
    getCartItemsCount,
    sortedProducts,
    setShippingInfo,
    setPaymentMethod,
    createOrder,
    confirmOrder,
    resetCheckout,
    fetchProducts,
    fetchProductById,
    loadMoreProducts,
    resetAndFetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setSearchQuery: (query) =>
      dispatch({ type: "SET_SEARCH_QUERY", payload: query }),
    setSelectedCategory: (category) =>
      dispatch({ type: "SET_CATEGORY", payload: category }),
    setSelectedCollection: (collection) =>
      dispatch({ type: "SET_COLLECTION", payload: collection }),
    setSelectedNewArrivals: (isNew) =>
      dispatch({ type: "SET_NEW_ARRIVALS", payload: isNew }),
    setSortBy: (sortBy) => dispatch({ type: "SET_SORT_BY", payload: sortBy }),
    setShowMobileMenu: (show) =>
      dispatch({ type: "SET_MOBILE_MENU", payload: show }),
    setUser: (user) => dispatch({ type: "SET_USER", payload: user }),
    setShowAlert: (show) =>
      dispatch({ type: show ? "SHOW_ALERT" : "HIDE_ALERT", payload: show }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
