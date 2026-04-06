import { create } from "zustand";
import { apiRequest, transformProduct } from "../utils/api";
import useUIStore from "./useUIStore";

const useProductStore = create((set, get) => ({
  products: [],
  productsLoading: true,
  productsError: null,
  isRefetching: false,
  searchQuery: "",
  selectedCategory: "all",
  selectedCollection: null,
  selectedPrint: null,
  selectedNewArrivals: false,
  sortBy: "featured",
  nextCursor: null,
  hasMore: true,
  productsLimit: 12,
  collections: [],

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedCollection: (collection) => set({ selectedCollection: collection }),
  setSelectedPrint: (print) => set({ selectedPrint: print }),
  setSelectedNewArrivals: (isNew) => set({ selectedNewArrivals: isNew }),
  setSortBy: (sortBy) => set({ sortBy: sortBy }),

  fetchProducts: async (options = {}) => {
    const state = get();
    try {
      const {
        limit = state.productsLimit,
        cursor = null,
        category = null,
        collectionId = null,
        printId = null,
        isFeatured = null,
        newArrivals = null,
        append = false,
      } = options;

      if (!append) {
        set({ productsLoading: true });
      }

      const queryParams = new URLSearchParams();
      queryParams.append("limit", limit);

      if (cursor) queryParams.append("cursor", cursor);
      if (category && category !== "all") queryParams.append("category", category);
      if (collectionId) queryParams.append("collectionId", collectionId);
      if (printId) queryParams.append("printId", printId);
      if (isFeatured !== null) queryParams.append("isFeatured", isFeatured);
      if (newArrivals) queryParams.append("newArrivals", newArrivals);

      const response = await apiRequest(`/products?${queryParams.toString()}`);
      const transformedProducts = response.data.map(transformProduct);
      
      const paginationData = {
        nextCursor: response.pagination?.nextCursor || null,
        hasMore: response.pagination?.hasMore || false,
        productsLoading: false,
        isRefetching: false,
        productsError: null,
      };

      set((curr) => {
        // Resolve duplicate IDs when appending, which causes React's Virtual DOM to drastically unmount/remount
        // and creates the flickering infinite-scroll behavior.
        const newProducts = append 
          ? [...curr.products, ...transformedProducts.filter(p => !curr.products.some(cp => cp.id === p.id))]
          : transformedProducts;

        return {
          ...paginationData,
          products: newProducts,
        };
      });
    } catch (error) {
      set({ productsError: error.message, productsLoading: false, isRefetching: false });
      console.error("Error fetching products:", error);
    }
  },

  fetchProductById: async (productId) => {
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
  },

  loadMoreProducts: async () => {
    const state = get();
    if (!state.hasMore || state.productsLoading) return;

    await get().fetchProducts({
      cursor: state.nextCursor,
      category: state.selectedCategory !== "all" ? state.selectedCategory : null,
      collectionId: state.selectedCollection || null,
      printId: state.selectedPrint || null,
      newArrivals: state.selectedNewArrivals || null,
      append: true,
    });
  },

  resetAndFetchProducts: async (filters = {}) => {
    const state = get();
    const {
      category = state.selectedCategory,
      collection = state.selectedCollection,
      printId = state.selectedPrint,
      newArrivals = state.selectedNewArrivals,
    } = filters;

    set({
      nextCursor: null,
      hasMore: true,
      productsLoading: true,
      isRefetching: true,
    });

    await get().fetchProducts({
      category: category !== "all" ? category : null,
      collectionId: collection || null,
      printId: printId || null,
      newArrivals: newArrivals || null,
    });
  },

  addProduct: async (productData) => {
    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description || "");
      formData.append("material", productData.material || "");
      formData.append("fit", productData.fit || "");
      formData.append("modelHeight", productData.modelHeight || "");
      formData.append("modelIsWearing", productData.modelIsWearing || "");
      formData.append("price", Number(productData.price));
      formData.append("category", productData.category || "Uncategorized");
      formData.append("colors", JSON.stringify(productData.colors || []));
      formData.append("sizes", JSON.stringify(productData.sizes || []));
      
      if (productData.originalPrice) formData.append("originalPrice", Number(productData.originalPrice));
      if (productData.isFeatured !== undefined) formData.append("isFeatured", productData.isFeatured);
      if (productData.bestSeller !== undefined) formData.append("bestSeller", productData.bestSeller);
      if (productData.printCollectionId) formData.append("printCollectionId", productData.printCollectionId);
      if (productData.printId) formData.append("printId", productData.printId);

      if (productData.imageFiles && productData.imageFiles.length > 0) {
        formData.append("image", productData.imageFiles[0]);
        for (let i = 1; i < productData.imageFiles.length; i++) {
          formData.append("additionalImages", productData.imageFiles[i]);
        }
      } else if (productData.image && productData.image.trim()) {
        formData.append("imageUrl", productData.image);
      }

      const response = await apiRequest("/products", { method: "POST", body: formData });
      const newProduct = { ...transformProduct(response.data), isNew: true };

      set((state) => ({ products: [...state.products, newProduct] }));
      setTimeout(() => useUIStore.getState().showCustomAlert("Product added successfully!"), 0);
      return response;
    } catch (error) {
      setTimeout(() => useUIStore.getState().showCustomAlert(`Error adding product: ${error.message}`, "error"), 0);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description || "");
      formData.append("material", productData.material || "");
      formData.append("fit", productData.fit || "");
      formData.append("modelHeight", productData.modelHeight || "");
      formData.append("modelIsWearing", productData.modelIsWearing || "");
      formData.append("price", Number(productData.price));
      formData.append("category", productData.category || "Uncategorized");
      formData.append("colors", JSON.stringify(productData.colors || []));
      formData.append("sizes", JSON.stringify(productData.sizes || []));
      
      if (productData.originalPrice) formData.append("originalPrice", Number(productData.originalPrice));
      if (productData.isFeatured !== undefined) formData.append("isFeatured", productData.isFeatured);
      if (productData.bestSeller !== undefined) formData.append("bestSeller", productData.bestSeller);
      if (productData.printCollectionId) formData.append("printCollectionId", productData.printCollectionId);
      if (productData.printId) formData.append("printId", productData.printId);

      if (productData.imageFiles && productData.imageFiles.length > 0) {
        formData.append("image", productData.imageFiles[0]);
        for (let i = 1; i < productData.imageFiles.length; i++) {
          formData.append("additionalImages", productData.imageFiles[i]);
        }
      } else {
        if (productData.image && productData.image.trim()) formData.append("imageUrl", productData.image);
        if (productData.existingImages && productData.existingImages.length > 0) {
          formData.append("existingImages", JSON.stringify(productData.existingImages));
        }
      }

      const response = await apiRequest(`/products/${id}`, { method: "PUT", body: formData });
      const updatedProduct = transformProduct(response.data);

      set((state) => ({
        products: state.products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)),
      }));
      setTimeout(() => useUIStore.getState().showCustomAlert("Product updated successfully!"), 0);
      return response;
    } catch (error) {
      setTimeout(() => useUIStore.getState().showCustomAlert(`Error updating product: ${error.message}`, "error"), 0);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      await apiRequest(`/products/${id}`, { method: "DELETE" });
      set((state) => ({ products: state.products.filter((p) => p._id !== id) }));
      setTimeout(() => useUIStore.getState().showCustomAlert("Product deleted successfully!"), 0);
    } catch (error) {
      setTimeout(() => useUIStore.getState().showCustomAlert(`Error deleting product: ${error.message}`, "error"), 0);
      throw error;
    }
  },

  fetchCollections: async () => {
    try {
      const response = await apiRequest("/collections");
      const arr = Array.isArray(response) ? response : response.data ?? response.collections ?? [];
      set({ collections: arr });
      return arr;
    } catch (error) {
      console.error("Error fetching collections:", error);
      return [];
    }
  },
}));

export default useProductStore;
