import { create } from "zustand";

const useUIStore = create((set) => ({
  currentPage: "home",
  showAlert: false,
  alertMessage: "",
  alertType: "success", // 'success' | 'error'
  showMobileMenu: false,

  // ── Wishlist toast (non-blocking corner notification) ──────────────────────
  wishlistToast: null, // null | { message: string; added: boolean }

  showWishlistToast: (message, added = true) => {
    set({ wishlistToast: { message, added } });
    setTimeout(() => set({ wishlistToast: null }), 3000);
  },
  hideWishlistToast: () => set({ wishlistToast: null }),
  // ──────────────────────────────────────────────────────────────────────────

  setPage: (page) => set({ currentPage: page, showMobileMenu: false }),
  setShowMobileMenu: (show) => set({ showMobileMenu: show }),
  toggleMobileMenu: () =>
    set((state) => ({ showMobileMenu: !state.showMobileMenu })),

  setShowAlert: (show) => set({ showAlert: show, alertMessage: "", alertType: "success" }),
  // type: 'success' | 'error'
  showCustomAlert: (message, type = "success", callback) => {
    set({ showAlert: true, alertMessage: message, alertType: type });
    const cb = typeof type === "function" ? type : callback; // backwards compat
    if (cb && typeof cb === "function") {
      setTimeout(() => {
        set({ showAlert: false, alertMessage: "", alertType: "success" });
        cb();
      }, 2000);
    } else {
      setTimeout(() => {
        set({ showAlert: false, alertMessage: "", alertType: "success" });
      }, 3000);
    }
  },
  hideAlert: () => set({ showAlert: false, alertMessage: "", alertType: "success" }),
}));

export default useUIStore;
