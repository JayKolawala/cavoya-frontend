import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, createContext, useContext } from 'react';

const ApiContext = createContext(null);

export const useApiContext = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useApiContext must be used within an ApiProvider');
    }
    return context;
};

const createQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5,
                gcTime: 1000 * 60 * 10,
                retry: 1,
                refetchOnWindowFocus: false,
            },
            mutations: {
                retry: 0,
            },
        },
    });

export function ApiProvider({ children }) {
    const [queryClient] = useState(createQueryClient);

    const apiRequest = async (endpoint, options = {}) => {
        const url = `${import.meta.env.VITE_API_BASE_URL || 'https://cavoya-backend.onrender.com/api'}${endpoint}`;
        const token = localStorage.getItem('token');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            signal: controller.signal,
            ...options,
        };

        if (options.body instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        try {
            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            if (response.status === 204) {
                return { success: true };
            }

            const data = await response.json();

            if (!response.ok) {
                throw Object.assign(new Error(data.message || 'Something went wrong'), {
                    status: response.status,
                    data,
                });
            }

            return data;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please try again.');
            }
            throw error;
        }
    };

    const apiValue = { apiRequest };

    return (
        <ApiContext.Provider value={apiValue}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ApiContext.Provider>
    );
}
