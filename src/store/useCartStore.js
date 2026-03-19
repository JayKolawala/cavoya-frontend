import { create } from "zustand";
import useUIStore from "./useUIStore";

const useCartStore = create((set, get) => ({
  cartItems: [],
  
  addToCart: (product, selectedColor, selectedSize) => {
    if (!product.id && !product._id) {
      console.error("Cannot add to cart: Product ID is missing", product);
      setTimeout(() => useUIStore.getState().showCustomAlert("Error: Product data is incomplete"), 0);
      return;
    }

    set((state) => {
      const existingItem = state.cartItems.find(
        (item) =>
          item.productId === (product.id || product._id) &&
          item.color === selectedColor &&
          item.size === selectedSize
      );

      let newItems;
      if (existingItem) {
        newItems = state.cartItems.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [
          ...state.cartItems,
          {
            id: Date.now(),
            productId: product.id || product._id,
            name: product.name,
            price: product.price,
            color: selectedColor,
            size: selectedSize,
            quantity: 1,
            image: product.image,
          },
        ];
      }
      
      setTimeout(() => useUIStore.getState().showCustomAlert("Item added to cart successfully!"), 0);
      return { cartItems: newItems };
    });
  },

  updateCartQuantity: (id, change) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + change),
            }
          : item
      ),
    }));
  },

  removeFromCart: (id) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    }));
    setTimeout(() => useUIStore.getState().showCustomAlert("Item removed from cart"), 0);
  },

  getTotalPrice: () => {
    return get()
      .cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  },

  getCartItemsCount: () => {
    return get().cartItems.reduce((total, item) => total + item.quantity, 0);
  },
  
  clearCart: () => set({ cartItems: [] }),
}));

export default useCartStore;
