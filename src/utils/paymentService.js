/**
 * Payment Service - Razorpay Integration with Backend API
 * Handles payment processing for online orders (Card, UPI)
 */

import { API_BASE_URL } from './apiHelpers';

/**
 * Get authentication token from localStorage
 * @returns {string|null} Auth token
 */
const getAuthToken = () => {
    return localStorage.getItem('token');
};

/**
 * Create Razorpay order via backend API
 * @param {Object} orderData - Order data
 * @param {number} orderData.amount - Amount in paise (e.g., 50000 for ₹500)
 * @param {string} orderData.currency - Currency code (default: INR)
 * @param {string} orderData.receipt - Receipt ID
 * @returns {Promise<Object>} Razorpay order details
 */
export const createRazorpayOrder = async ({ amount, currency = 'INR', receipt }) => {
    try {
        const token = getAuthToken();

        const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: JSON.stringify({ amount, currency, receipt }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create order');
        }

        return data;
    } catch (error) {
        console.error('Create order error:', error);
        throw error;
    }
};

/**
 * Verify payment with backend API
 * @param {Object} paymentData - Payment verification data
 * @param {string} paymentData.razorpay_order_id - Razorpay order ID
 * @param {string} paymentData.razorpay_payment_id - Razorpay payment ID
 * @param {string} paymentData.razorpay_signature - Razorpay signature
 * @returns {Promise<Object>} Verification result
 */
export const verifyPayment = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    try {
        const token = getAuthToken();

        const response = await fetch(`${API_BASE_URL}/payment/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: JSON.stringify({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Payment verification failed');
        }

        return data;
    } catch (error) {
        console.error('Payment verification error:', error);
        throw error;
    }
};

/**
 * Load Razorpay SDK dynamically
 * @returns {Promise<boolean>} Returns true if script loaded successfully
 */
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        // Check if Razorpay is already loaded
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => {
            console.error('Failed to load Razorpay SDK');
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

/**
 * Calculate order pricing including tax and shipping
 * @param {number} subtotal - Cart subtotal
 * @returns {Object} Pricing breakdown
 */
export const calculateOrderPricing = (subtotal) => {
    const subtotalNum = parseFloat(subtotal);
    const shippingCost = 0; // Free shipping
    const tax = 0;
    const total = subtotalNum + shippingCost + tax;

    return {
        subtotal: parseFloat(subtotalNum.toFixed(2)),
        shippingCost: parseFloat(shippingCost.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        discount: 0,
        total: parseFloat(total.toFixed(2)),
    };
};

/**
 * Process Razorpay payment
 * @param {Object} options - Payment options
 * @param {string} options.orderId - Razorpay order ID from backend
 * @param {number} options.amount - Amount in paise
 * @param {string} options.currency - Currency code (default: INR)
 * @param {string} options.customerName - Customer name
 * @param {string} options.customerEmail - Customer email
 * @param {string} options.customerPhone - Customer phone
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onFailure - Failure callback
 * @returns {Promise<void>}
 */
export const processRazorpayPayment = async ({
    orderId,
    amount,
    currency = 'INR',
    customerName,
    customerEmail,
    customerPhone,
    onSuccess,
    onFailure,
}) => {
    try {
        // Load Razorpay SDK
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
        }

        // Get Razorpay key from environment
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

        // Razorpay options
        const options = {
            key: razorpayKey,
            amount: amount, // Already in paise from backend
            currency: currency,
            order_id: orderId, // Order ID from backend
            name: 'Cavoya',
            description: 'Order Payment',
            image: `${window.location.origin}/cavoya_logo.PNG`,
            prefill: {
                name: customerName,
                email: customerEmail,
                contact: customerPhone,
            },
            theme: {
                color: '#000000', // Black to match site theme
            },
            handler: function (response) {
                // Payment successful - webhook will handle order confirmation
                if (onSuccess) {
                    onSuccess(response);
                }
            },
            modal: {
                ondismiss: function () {
                    // Payment cancelled/failed
                    if (onFailure) {
                        onFailure(new Error('Payment cancelled by user'));
                    }
                },
            },
        };

        // Open Razorpay checkout
        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function (response) {
            console.error('Payment failed:', response.error);
            if (onFailure) {
                onFailure(new Error(response.error.description || 'Payment failed'));
            }
        });

        razorpay.open();
    } catch (error) {
        console.error('Razorpay payment error:', error);
        if (onFailure) {
            onFailure(error);
        }
    }
};

/**
 * Map payment method to API format
 * @param {string} method - Frontend payment method (card, upi, cod)
 * @returns {string} API payment method
 */
export const mapPaymentMethod = (method) => {
    const mapping = {
        card: 'card',
        upi: 'upi',
        cod: 'cod',
    };
    return mapping[method] || 'cod';
};
