import { create } from "zustand";
import { apiRequest } from "../utils/api";
import useUIStore from "./useUIStore";
import useCartStore from "./useCartStore";

const useCheckoutStore = create((set, get) => ({
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

  setShippingInfo: (info) =>
    set((state) => ({
      shippingInfo: { ...state.shippingInfo, ...info },
    })),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  createOrder: async (paymentInfo = null) => {
    try {
      const state = get();
      const cartStore = useCartStore.getState();
      
      const items = cartStore.cartItems.map((item) => {
        if (!item.productId) {
          console.error("Missing product ID for item:", item);
        }
        return {
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          color: item.color || "Default",
          size: item.size || "Default",
          subtotal: item.price * item.quantity,
        };
      });

      const invalidItems = items.filter((item) => !item.productId);
      if (invalidItems.length > 0) {
        throw new Error(`Cannot create order: ${invalidItems.length} items have missing product IDs`);
      }

      const subtotal = parseFloat(cartStore.getTotalPrice());
      const shippingCost = 0;
      const taxRate = 0.18;
      const tax = subtotal * taxRate;
      const total = subtotal + shippingCost + tax;

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
  },

  confirmOrder: (orderNumber = null) => {
    set((state) => ({
      orderNumber: orderNumber || state.orderNumber,
      orderConfirmed: true,
    }));
    useCartStore.getState().clearCart();
    setTimeout(() => useUIStore.getState().showCustomAlert("Order confirmed successfully!"), 0);
  },

  resetCheckout: () => {
    set({
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
    });
  },
}));

export default useCheckoutStore;
