import { create } from "zustand";

const useUIStore = create((set) => ({
  currentPage: "home",
  showAlert: false,
  alertMessage: "",
  showMobileMenu: false,

  setPage: (page) => set({ currentPage: page, showMobileMenu: false }),
  setShowMobileMenu: (show) => set({ showMobileMenu: show }),
  toggleMobileMenu: () =>
    set((state) => ({ showMobileMenu: !state.showMobileMenu })),
  
  setShowAlert: (show) => set({ showAlert: show, alertMessage: "" }),
  showCustomAlert: (message, callback) => {
    set({ showAlert: true, alertMessage: message });
    if (callback && typeof callback === 'function') {
      setTimeout(() => {
        set({ showAlert: false, alertMessage: "" });
        callback();
      }, 2000);
    } else {
      setTimeout(() => {
        set({ showAlert: false, alertMessage: "" });
      }, 3000);
    }
  },
  hideAlert: () => set({ showAlert: false, alertMessage: "" }),
}));

export default useUIStore;
