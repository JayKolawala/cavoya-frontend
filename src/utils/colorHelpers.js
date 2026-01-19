/**
 * Color utility functions for product color swatches
 */

/**
 * Get Tailwind CSS classes for a color name
 * @param {string} color - Color name
 * @returns {string} Tailwind CSS classes
 */
export const getColorClasses = (color) => {
    const colorMap = {
        red: "bg-red-400",
        blue: "bg-blue-400",
        green: "bg-green-400",
        yellow: "bg-yellow-400",
        pink: "bg-pink-400",
        purple: "bg-purple-400",
        black: "bg-black",
        white: "bg-white border-2",
        gray: "bg-gray-400",
        grey: "bg-gray-400",
        charcoal: "bg-gray-700",
        blush: "bg-pink-200",
        navy: "bg-blue-900",
        beige: "bg-amber-100",
        brown: "bg-amber-800",
        orange: "bg-orange-400",
    };

    const lowerColor = color.toLowerCase();
    return colorMap[lowerColor] || "bg-gray-300";
};
