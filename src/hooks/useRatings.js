import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiContext } from './ApiProvider';

export function useRatings(productId) {
    const { apiRequest } = useApiContext();

    return useQuery({
        queryKey: ['ratings', productId],
        queryFn: () => apiRequest(`/ratings/product/${productId}`),
        enabled: !!productId,
    });
}

export function useCreateRating() {
    const { apiRequest } = useApiContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, ...data }) => apiRequest(`/ratings/product/${productId}`, {
            method: 'POST',
            body: data,
        }),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: ['ratings', productId] });
            queryClient.invalidateQueries({ queryKey: ['product', productId] });
        },
    });
}

export function useUpdateRating() {
    const { apiRequest } = useApiContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ ratingId, ...data }) => apiRequest(`/ratings/${ratingId}`, {
            method: 'PUT',
            body: data,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ratings'] });
        },
    });
}

export function useDeleteRating() {
    const { apiRequest } = useApiContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ratingId) => apiRequest(`/ratings/${ratingId}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ratings'] });
        },
    });
}
