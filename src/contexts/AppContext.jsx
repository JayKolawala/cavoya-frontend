import React, { createContext, useContext, useReducer } from "react";

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
  products: [
    {
      id: 1,
      name: "Linen Midi Dress",
      price: 8999,
      originalPrice: 11999,
      category: "dresses",
      rating: 4.8,
      reviews: 124,
      colors: ["blush", "navy", "sage"],
      sizes: ["XS", "S", "M", "L", "XL"],
      image: "https://placehold.co/600x800/F8E7E4/5C5C5C?text=Linen+Dress",
      isNew: true,
      isSale: true,
    },
    {
      id: 2,
      name: "Silk Cami Blouse",
      price: 6500,
      originalPrice: 6500,
      category: "tops",
      rating: 4.9,
      reviews: 89,
      colors: ["pink", "charcoal", "sage"],
      sizes: ["XS", "S", "M", "L"],
      image: "https://placehold.co/600x800/D9E3D3/5C5C5C?text=Silk+Blouse",
      isNew: false,
      isSale: false,
    },
    {
      id: 3,
      name: "Wide Leg Trousers",
      price: 7550,
      originalPrice: 7550,
      category: "bottoms",
      rating: 4.6,
      reviews: 67,
      colors: ["black", "navy", "cream"],
      sizes: ["XS", "S", "M", "L", "XL"],
      image: "https://placehold.co/600x800/E5E8F0/5C5C5C?text=Wide+Leg+Pants",
      isNew: false,
      isSale: false,
    },
    {
      id: 4,
      name: "Chunky Knit Sweater",
      price: 9500,
      originalPrice: 12000,
      category: "tops",
      rating: 4.7,
      reviews: 156,
      colors: ["cream", "camel", "forest"],
      sizes: ["S", "M", "L", "XL"],
      image: "https://placehold.co/600x800/F0E5D9/5C5C5C?text=Knitted+Sweater",
      isNew: true,
      isSale: true,
    },
  ],
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

      case 'SET_SHIPPING_INFO':
  return { ...state, shippingInfo: { ...state.shippingInfo, ...action.payload } };
  
case 'SET_PAYMENT_METHOD':
  return { ...state, paymentMethod: action.payload };
  
case 'CONFIRM_ORDER':
  return { 
    ...state, 
    orderConfirmed: true,
    cartItems: [],
    // You might want to save the order to an orders array
  };
  
case 'RESET_CHECKOUT':
  return { 
    ...state, 
    shippingInfo: initialState.shippingInfo,
    paymentMethod: "card",
    orderConfirmed: false 
  };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const showCustomAlert = (message, callback) => {
    dispatch({ type: "SHOW_ALERT", payload: message });
    if (callback) {
      setTimeout(() => {
        dispatch({ type: "HIDE_ALERT" });
        callback();
      }, 2000);
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
  dispatch({ type: 'SET_SHIPPING_INFO', payload: info });
};

const setPaymentMethod = (method) => {
  dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
};

const confirmOrder = () => {
  dispatch({ type: 'CONFIRM_ORDER' });
  showCustomAlert('Order confirmed successfully!');
};

const resetCheckout = () => {
  dispatch({ type: 'RESET_CHECKOUT' });
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
