// src/utils/formatters.js
import { CURRENCY } from './constants';

/**
 * Format date to localized string
 * @param {string|Date} dateString - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
    if (!dateString) return 'N/A';

    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options
    };

    try {
        return new Date(dateString).toLocaleDateString('en-IN', defaultOptions);
    } catch (error) {
        console.error('Date formatting error:', error);
        return 'Invalid Date';
    }
};

/**
 * Format date with time
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (dateString) => {
    return formatDate(dateString, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, options = {}) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return `${CURRENCY.SYMBOL}0`;
    }

    const defaultOptions = {
        style: 'currency',
        currency: CURRENCY.CODE,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options
    };

    try {
        return amount.toLocaleString(CURRENCY.LOCALE, defaultOptions);
    } catch (error) {
        // Fallback formatting
        return `${CURRENCY.SYMBOL}${amount.toLocaleString()}`;
    }
};

/**
 * Format large numbers with K/M suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
    if (typeof num !== 'number' || isNaN(num)) return '0';

    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
};

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
    if (typeof value !== 'number' || isNaN(value)) return '0%';
    return `${value.toFixed(decimals)}%`;
};

/**
 * Format phone number for display
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';

    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Indian phone number formatting
    if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
        return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }

    return phoneNumber; // Return original if doesn't match expected format
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text || '';
    return `${text.substring(0, maxLength)}...`;
};

/**
 * Format address for display
 * @param {Object} address - Address object
 * @returns {string} Formatted address string
 */
export const formatAddress = (address) => {
    if (!address) return '';

    const parts = [
        address.street,
        address.city,
        address.state,
        address.pincode,
        address.country
    ].filter(Boolean);

    return parts.join(', ');
};

/**
 * Format order ID for display
 * @param {string} orderId - Order ID to format
 * @returns {string} Formatted order ID
 */
export const formatOrderId = (orderId) => {
    if (!orderId) return '';
    return orderId.toUpperCase();
};

/**
 * Format customer ID for display
 * @param {string} customerId - Customer ID to format
 * @returns {string} Formatted customer ID
 */
export const formatCustomerId = (customerId) => {
    if (!customerId) return '';
    return customerId.toUpperCase();
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
    if (!name) return '';

    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};