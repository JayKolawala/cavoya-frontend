import { create } from "zustand";
import useUIStore from "./useUIStore";

const useWishlistStore = create((set, get) => ({
  wishlist: [],
  toggleWishlist: (productId) => {
    set((state) => {
      const isInWishlist = state.wishlist.includes(productId);
      const newWishlist = isInWishlist
        ? state.wishlist.filter((id) => id !== productId)
        : [...state.wishlist, productId];
      
      // Update UI toast outside set loop to avoid strict mode issues
      setTimeout(() => {
        useUIStore.getState().showWishlistToast(
          isInWishlist ? "Removed from wishlist" : "Added to wishlist",
          !isInWishlist
        );
      }, 0);
      
      return { wishlist: newWishlist };
    });
  },
}));

export default useWishlistStore;
