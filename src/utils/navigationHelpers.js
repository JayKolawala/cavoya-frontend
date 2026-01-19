/**
 * Navigation helper functions for consistent routing and filter state management
 */

/**
 * Create navigation handler for products page with filters
 * @param {Object} params - Navigation parameters
 * @param {Function} params.navigate - React Router navigate function
 * @param {Function} params.setSelectedCategory - Category setter function
 * @param {Function} params.setSelectedCollection - Collection setter function
 * @param {Function} params.setSelectedNewArrivals - New arrivals setter function
 * @param {Function} params.setShowMobileMenu - Mobile menu setter function (optional)
 * @returns {Function} Navigation handler function
 */
export const createNavigationHandler = ({
    navigate,
    setSelectedCategory,
    setSelectedCollection,
    setSelectedNewArrivals,
    setShowMobileMenu,
}) => {
    return (category, collection, newArrivals, path) => {
        setSelectedCategory(category);
        setSelectedCollection(collection);
        setSelectedNewArrivals(newArrivals);
        if (setShowMobileMenu) {
            setShowMobileMenu(false);
        }
        navigate(path);
    };
};

/**
 * Navigate to products page with specific filters
 * @param {Object} params - Navigation parameters
 */
export const navigateToProducts = ({
    navigate,
    setSelectedCategory,
    setSelectedCollection,
    setSelectedNewArrivals,
    category = "all",
    collection = null,
    newArrivals = false,
    path = "/products",
}) => {
    setSelectedCategory(category);
    setSelectedCollection(collection);
    setSelectedNewArrivals(newArrivals);
    navigate(path);
};
