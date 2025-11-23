/**
 * Payment Service - Razorpay Integration
 * Handles payment processing for online orders (Card, UPI)
 */

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
    const taxRate = 0.18; // 18% GST
    const tax = subtotalNum * taxRate;
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
 * @param {number} options.amount - Amount in INR (will be converted to paise)
 * @param {string} options.customerName - Customer name
 * @param {string} options.customerEmail - Customer email
 * @param {string} options.customerPhone - Customer phone
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onFailure - Failure callback
 * @returns {Promise<void>}
 */
export const processRazorpayPayment = async ({
    amount,
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
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxxxx';

        // Convert amount to paise (Razorpay expects amount in smallest currency unit)
        const amountInPaise = Math.round(amount * 100);

        // Razorpay options
        const options = {
            key: razorpayKey,
            amount: amountInPaise,
            currency: 'INR',
            name: 'Cavoya',
            description: 'Order Payment',
            image: '/logo.png', // Optional: Add your logo
            prefill: {
                name: customerName,
                email: customerEmail,
                contact: customerPhone,
            },
            theme: {
                color: '#ec4899', // Pink-500 to match site theme
            },
            handler: function (response) {
                // Payment successful
                console.log('Payment successful:', response);
                if (onSuccess) {
                    onSuccess({
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        signature: response.razorpay_signature,
                    });
                }
            },
            modal: {
                ondismiss: function () {
                    // Payment cancelled/failed
                    console.log('Payment cancelled by user');
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
