/**
 * Category mapping utilities for consistent navigation and filtering
 */

import { PRODUCT_CATEGORIES } from "./constants";

/**
 * Get the category map: URL slug -> Database category name
 * This ensures we use exact category names from the database (including hidden characters)
 * @returns {Object} Category mapping object
 */
export const getCategoryMap = () => {
    return {
        dresses: PRODUCT_CATEGORIES[0], // "Dresses"
        "coord-sets": PRODUCT_CATEGORIES[1], // "Co-ord Sets⁠" (with hidden character U+2060)
        tops: PRODUCT_CATEGORIES[2], // "Tops"
        bottomwear: PRODUCT_CATEGORIES[3], // "Bottomwear"
        jumpsuits: PRODUCT_CATEGORIES[4], // "Jumpsuits"
        solset: PRODUCT_CATEGORIES[5], // "Solset"
    };
};

/**
 * Get category slug from database category name
 * @param {string} categoryName - Database category name
 * @returns {string} URL slug for the category
 */
export const getCategorySlug = (categoryName) => {
    const categoryMap = getCategoryMap();
    const entry = Object.entries(categoryMap).find(
        ([_, dbName]) => dbName === categoryName
    );
    return entry ? entry[0] : categoryName.toLowerCase().replace(/\s+/g, "-");
};
