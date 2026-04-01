import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiContext } from './ApiProvider';

export function useProducts(params = {}) {
    const { apiRequest } = useApiContext();

    return useQuery({
        queryKey: ['products', params],
        queryFn: async () => {
            const queryParams = new URLSearchParams(
                Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
            ).toString();
            const endpoint = `/products${queryParams ? `?${queryParams}` : ''}`;
            return apiRequest(endpoint);
        },
    });
}

export function useProduct(id) {
    const { apiRequest } = useApiContext();

    return useQuery({
        queryKey: ['product', id],
        queryFn: () => apiRequest(`/products/${id}`),
        enabled: !!id,
    });
}

export function useProductPrintDetails(id) {
    const { apiRequest } = useApiContext();

    return useQuery({
        queryKey: ['productPrintDetails', id],
        queryFn: () => apiRequest(`/products/${id}/print-details`),
        enabled: !!id,
    });
}

export function useCreateProduct() {
    const { apiRequest } = useApiContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData) => apiRequest('/products', {
            method: 'POST',
            body: formData,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}

export function useUpdateProduct() {
    const { apiRequest } = useApiContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...formData }) => apiRequest(`/products/${id}`, {
            method: 'PUT',
            body: formData,
        }),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', id] });
        },
    });
}

export function useDeleteProduct() {
    const { apiRequest } = useApiContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}
