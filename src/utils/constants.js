// src/utils/constants.js

// Customer Status Configurations
export const CUSTOMER_STATUSES = [
    {
        value: "active",
        label: "Active",
        color: "bg-green-100 text-green-800",
    },
    {
        value: "inactive",
        label: "Inactive",
        color: "bg-gray-100 text-gray-800",
    },
    {
        value: "vip",
        label: "VIP",
        color: "bg-purple-100 text-purple-800",
    },
    {
        value: "blocked",
        label: "Blocked",
        color: "bg-red-100 text-red-800",
    },
];

// Order Status Configurations
export const ORDER_STATUSES = [
    {
        value: "pending",
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800",
    },
    {
        value: "processing",
        label: "Processing",
        color: "bg-blue-100 text-blue-800",
    },
    {
        value: "shipped",
        label: "Shipped",
        color: "bg-indigo-100 text-indigo-800",
    },
    {
        value: "delivered",
        label: "Delivered",
        color: "bg-green-100 text-green-800",
    },
    {
        value: "cancelled",
        label: "Cancelled",
        color: "bg-red-100 text-red-800",
    },
];

// Payment Status Configurations  
export const PAYMENT_STATUSES = [
    {
        value: "paid",
        label: "Paid",
        color: "bg-green-100 text-green-800",
    },
    {
        value: "pending",
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800",
    },
    {
        value: "failed",
        label: "Failed",
        color: "bg-red-100 text-red-800",
    },
];

// Payment Methods
export const PAYMENT_METHODS = [
    "UPI",
    "Credit Card",
    "Debit Card",
    "Net Banking",
    "Wallet",
    "Cash on Delivery",
];

// Address Types
export const ADDRESS_TYPES = [
    { value: "home", label: "Home" },
    { value: "office", label: "Office" },
    { value: "other", label: "Other" },
];

// Clothing Sizes
export const CLOTHING_SIZES = [
    "XS", "S", "M", "L", "XL", "XXL", "Free Size"
];

// Product Categories
export const PRODUCT_CATEGORIES = [
    "Ethnic Wear",
    "Western Wear",
    "Traditional Wear",
    "Sarees",
    "Casual Wear",
    "Bridal Wear",
    "Designer Collection",
    "Premium Sarees",
];

// Indian States
export const INDIAN_STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
];

// Table Pagination Options
export const PAGINATION_OPTIONS = [10, 25, 50, 100];

// Default Pagination
export const DEFAULT_PAGE_SIZE = 10;

// Date Formats
export const DATE_FORMATS = {
    DISPLAY: "MMM dd, yyyy",
    INPUT: "yyyy-MM-dd",
    FULL: "MMMM dd, yyyy hh:mm a",
};

// Currency Configuration
export const CURRENCY = {
    SYMBOL: "₹",
    CODE: "INR",
    LOCALE: "en-IN",
};