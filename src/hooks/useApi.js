import { useState, useCallback } from 'react';

/**
 * Custom hook for making API calls with automatic state management
 * 
 * @param {string} baseURL - Base URL for API (optional, defaults to environment variable)
 * @returns {Object} API utilities and state
 * 
 * @example
 * const { data, loading, error, execute } = useApi();
 * 
 * // GET request
 * await execute('/products', { method: 'GET' });
 * 
 * // POST request with JSON body
 * await execute('/products', {
 *   method: 'POST',
 *   body: { name: 'Product', price: 100 }
 * });
 * 
 * // POST request with FormData
 * const formData = new FormData();
 * formData.append('name', 'Product');
 * await execute('/products', {
 *   method: 'POST',
 *   body: formData
 * });
 */
const useApi = (baseURL = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = baseURL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    /**
     * Execute an API request
     * 
     * @param {string} endpoint - API endpoint (e.g., '/products' or '/products/123')
     * @param {Object} options - Request options
     * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE, PATCH)
     * @param {Object|FormData} options.body - Request body (will be JSON stringified if not FormData)
     * @param {Object} options.headers - Additional headers
     * @param {boolean} options.skipLoading - Skip setting loading state (useful for background requests)
     * @param {Function} options.onSuccess - Success callback
     * @param {Function} options.onError - Error callback
     * @returns {Promise} Response data
     */
    const execute = useCallback(async (endpoint, options = {}) => {
        const {
            method = 'GET',
            body = null,
            headers = {},
            skipLoading = false,
            onSuccess,
            onError,
            ...restOptions
        } = options;

        if (!skipLoading) {
            setLoading(true);
        }
        setError(null);

        const url = `${API_BASE_URL}${endpoint}`;

        try {
            const config = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                ...restOptions,
            };

            // Handle request body
            if (body) {
                if (body instanceof FormData) {
                    // Remove Content-Type for FormData (browser sets it with boundary)
                    delete config.headers['Content-Type'];
                    config.body = body;
                } else {
                    // Stringify JSON body
                    config.body = JSON.stringify(body);
                }
            }

            const response = await fetch(url, config);
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || `HTTP Error: ${response.status}`);
            }

            setData(responseData);

            if (onSuccess) {
                onSuccess(responseData);
            }

            return responseData;
        } catch (err) {
            const errorMessage = err.message || 'An error occurred';
            setError(errorMessage);

            if (onError) {
                onError(err);
            } else {
                console.error('API Request Error:', err);
            }

            throw err;
        } finally {
            if (!skipLoading) {
                setLoading(false);
            }
        }
    }, [API_BASE_URL]);

    /**
     * Reset the hook state
     */
    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    /**
     * Convenience methods for different HTTP verbs
     */
    const get = useCallback((endpoint, options = {}) => {
        return execute(endpoint, { ...options, method: 'GET' });
    }, [execute]);

    const post = useCallback((endpoint, body, options = {}) => {
        return execute(endpoint, { ...options, method: 'POST', body });
    }, [execute]);

    const put = useCallback((endpoint, body, options = {}) => {
        return execute(endpoint, { ...options, method: 'PUT', body });
    }, [execute]);

    const patch = useCallback((endpoint, body, options = {}) => {
        return execute(endpoint, { ...options, method: 'PATCH', body });
    }, [execute]);

    const del = useCallback((endpoint, options = {}) => {
        return execute(endpoint, { ...options, method: 'DELETE' });
    }, [execute]);

    return {
        data,
        loading,
        error,
        execute,
        reset,
        // Convenience methods
        get,
        post,
        put,
        patch,
        delete: del,
    };
};

export default useApi;
