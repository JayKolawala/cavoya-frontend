import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiContext } from './ApiProvider';

export function useOrders(params = {}) {
    const { apiRequest } = useApiContext();

    return useQuery({
        queryKey: ['orders', params],
        queryFn: async () => {
            const queryParams = new URLSearchParams(
                Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
            ).toString();
            const endpoint = `/orders${queryParams ? `?${queryParams}` : ''}`;
            return apiRequest(endpoint);
        },
    });
}

export function useOrder(id) {
    const { apiRequest } = useApiContext();

    return useQuery({
        queryKey: ['order', id],
        queryFn: () => apiRequest(`/orders/${id}`),
        enabled: !!id,
    });
}

export function useCreateOrder() {
    const { apiRequest } = useApiContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => apiRequest('/orders', {
            method: 'POST',
            body: data,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
}

export function useUpdateOrderStatus() {
    const { apiRequest } = useApiContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }) => apiRequest(`/orders/${id}/status`, {
            method: 'PATCH',
            body: { status },
        }),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order', id] });
        },
    });
}
