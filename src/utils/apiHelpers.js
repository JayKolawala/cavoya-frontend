/**
 * API Configuration and Helper Utilities
 */

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// API Endpoints (centralized endpoint management)
export const API_ENDPOINTS = {
    // Products
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id) => `/products/${id}`,

    // Orders (example)
    ORDERS: '/orders',
    ORDER_BY_ID: (id) => `/orders/${id}`,

    // Customers (example)
    CUSTOMERS: '/customers',
    CUSTOMER_BY_ID: (id) => `/customers/${id}`,

    // Auth (example)
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
};

/**
 * Transform product data from backend to frontend format
 */
export const transformProduct = (product) => ({
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
});

/**
 * Create FormData from product object for API requests
 */
export const createProductFormData = (productData) => {
    const formData = new FormData();

    // Add text fields
    formData.append('name', productData.name);
    formData.append('description', productData.description || '');
    formData.append('price', Number(productData.price));
    formData.append('category', productData.category || 'Uncategorized');

    // Add colors and sizes as JSON strings
    formData.append('colors', JSON.stringify(productData.colors || []));
    formData.append('sizes', JSON.stringify(productData.sizes || []));

    // Add inventory as JSON string
    formData.append(
        'inventory',
        JSON.stringify({
            stock: Number(productData.inventory?.stock) || 0,
            trackQuantity: true,
        })
    );

    // Add optional fields
    if (productData.originalPrice) {
        formData.append('originalPrice', Number(productData.originalPrice));
    }
    if (productData.isFeatured !== undefined) {
        formData.append('isFeatured', productData.isFeatured);
    }

    // Add image files
    if (productData.imageFiles && productData.imageFiles.length > 0) {
        formData.append('image', productData.imageFiles[0]);
        for (let i = 1; i < productData.imageFiles.length; i++) {
            formData.append('additionalImages', productData.imageFiles[i]);
        }
    } else if (productData.image && productData.image.trim()) {
        formData.append('imageUrl', productData.image);
    }

    // Keep existing additional images for updates
    if (productData.existingImages && productData.existingImages.length > 0) {
        formData.append('existingImages', JSON.stringify(productData.existingImages));
    }

    return formData;
};

/**
 * Handle API errors consistently
 */
export const handleApiError = (error, showAlert) => {
    const errorMessage = error.message || 'An error occurred';
    console.error('API Error:', error);

    if (showAlert) {
        showAlert(errorMessage);
    }

    return errorMessage;
};
