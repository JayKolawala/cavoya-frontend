import React, { createContext, useContext, useReducer, useEffect } from "react";

const AppContext = createContext();

const initialState = {
  currentPage: "home",
  cartItems: [
    {
      id: 1,
      name: "Silk Cami Blouse",
      price: 6500,
      color: "Charcoal",
      size: "S",
      quantity: 1,
      image: "https://placehold.co/100x150/D9E3D3/5C5C5C?text=Blouse",
    },
    {
      id: 2,
      name: "Linen Midi Dress",
      price: 8999,
      color: "Blush",
      size: "M",
      quantity: 1,
      image: "https://placehold.co/100x150/F8E7E4/5C5C5C?text=Dress",
    },
  ],
  wishlist: [],
  user: null,
  showAlert: false,
  alertMessage: "",
  searchQuery: "",
  selectedCategory: "all",
  sortBy: "featured",
  showMobileMenu: false,
  products: [],
  productsLoading: false,
  productsError: null,
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
          item.size === action.payload.size
      );

      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
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
            : item
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

    case "RESET_CHECKOUT":
      return {
        ...state,
        shippingInfo: initialState.shippingInfo,
        paymentMethod: "card",
        orderConfirmed: false,
      };

    case "SET_PRODUCTS_LOADING":
      return { ...state, productsLoading: action.payload };

    case "SET_PRODUCTS_ERROR":
      return { ...state, productsError: action.payload };

    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload,
        productsLoading: false,
        productsError: null,
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
          product._id === action.payload._id ? action.payload : product
        ),
      };

    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter(
          (product) => product._id !== action.payload
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
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  // API request helper
  const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

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

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      dispatch({ type: "SET_PRODUCTS_LOADING", payload: true });
      const response = await apiRequest("/products");

      // Transform backend data to match frontend structure
      const transformedProducts = response.data.map((product) => ({
        id: product._id,
        _id: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        category: product.category,
        rating: product.rating || 4.5,
        reviews: product.reviews || 0,
        colors: product.colors || [],
        sizes: product.sizes || [],
        image: product.image,
        isNew: false,
        isSale: product.isSale || false,
        description: product.description,
        inventory: product.inventory,
        isFeatured: product.isFeatured || false,
      }));

      dispatch({ type: "SET_PRODUCTS", payload: transformedProducts });
    } catch (error) {
      dispatch({ type: "SET_PRODUCTS_ERROR", payload: error.message });
      console.error("Error fetching products:", error);
    }
  };

  // Add product - simplified to match API schema exactly
  const addProduct = async (productData) => {
    try {
      // Only send fields that API expects
      const apiPayload = {
        name: productData.name,
        description: productData.description || "",
        price: Number(productData.price),
        image: productData.image,
        colors: productData.colors || [],
        sizes: productData.sizes || [],
        category: productData.category || "Uncategorized",
        inventory: {
          stock: Number(productData.inventory?.stock) || 0,
          trackQuantity: true,
        },
      };

      // Only add optional fields if they have values
      if (productData.originalPrice) {
        apiPayload.originalPrice = Number(productData.originalPrice);
      }
      if (productData.isFeatured !== undefined) {
        apiPayload.isFeatured = productData.isFeatured;
      }

      console.log("Sending to API:", apiPayload);

      const response = await apiRequest("/products", {
        method: "POST",
        body: JSON.stringify(apiPayload),
      });

      // Transform the response to match frontend structure
      const newProduct = {
        id: response.data._id,
        _id: response.data._id,
        name: response.data.name,
        price: response.data.price,
        originalPrice: response.data.originalPrice || response.data.price,
        category: response.data.category,
        rating: response.data.rating || 4.5,
        reviews: response.data.reviews || 0,
        colors: response.data.colors,
        sizes: response.data.sizes,
        image: response.data.image,
        isNew: true,
        isSale: response.data.isSale || false,
        description: response.data.description,
        inventory: response.data.inventory,
        isFeatured: response.data.isFeatured || false,
      };

      dispatch({ type: "ADD_PRODUCT", payload: newProduct });
      showCustomAlert("Product added successfully!");
      return response;
    } catch (error) {
      showCustomAlert(`Error adding product: ${error.message}`);
      throw error;
    }
  };

  // Update product - simplified to match API schema
  const updateProduct = async (id, productData) => {
    try {
      // Only send fields that API expects
      const apiPayload = {
        name: productData.name,
        description: productData.description || "",
        price: Number(productData.price),
        image: productData.image,
        colors: productData.colors || [],
        sizes: productData.sizes || [],
        category: productData.category || "Uncategorized",
        inventory: {
          stock: Number(productData.inventory?.stock) || 0,
          trackQuantity: true,
        },
      };

      // Only add optional fields if they have values
      if (productData.originalPrice) {
        apiPayload.originalPrice = Number(productData.originalPrice);
      }
      if (productData.isFeatured !== undefined) {
        apiPayload.isFeatured = productData.isFeatured;
      }

      console.log("Updating product:", apiPayload);

      const response = await apiRequest(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(apiPayload),
      });

      // Transform the response to match frontend structure
      const updatedProduct = {
        id: response.data._id,
        _id: response.data._id,
        name: response.data.name,
        price: response.data.price,
        originalPrice: response.data.originalPrice || response.data.price,
        category: response.data.category,
        rating: response.data.rating || 4.5,
        reviews: response.data.reviews || 0,
        colors: response.data.colors,
        sizes: response.data.sizes,
        image: response.data.image,
        isNew: false,
        isSale: response.data.isSale || false,
        description: response.data.description,
        inventory: response.data.inventory,
        isFeatured: response.data.isFeatured || false,
      };

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
    const cartItem = {
      productId: product.id,
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
      isInWishlist ? "Removed from wishlist" : "Added to wishlist"
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
    const matchesCategory =
      state.selectedCategory === "all" ||
      product.category === state.selectedCategory;
    return matchesSearch && matchesCategory;
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

  const confirmOrder = () => {
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
    confirmOrder,
    resetCheckout,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setSearchQuery: (query) =>
      dispatch({ type: "SET_SEARCH_QUERY", payload: query }),
    setSelectedCategory: (category) =>
      dispatch({ type: "SET_CATEGORY", payload: category }),
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
