import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiContext } from './ApiProvider';

export function useCollections() {
    const { apiRequest } = useApiContext();

    return useQuery({
        queryKey: ['collections'],
        queryFn: () => apiRequest('/collections'),
    });
}

export function useCollection(id) {
    const { apiRequest } = useApiContext();

    return useQuery({
        queryKey: ['collection', id],
        queryFn: () => apiRequest(`/collections/${id}`),
        enabled: !!id,
    });
}

export function useCreateCollection() {
    const { apiRequest } = useApiContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => apiRequest('/collections', {
            method: 'POST',
            body: data,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        },
    });
}

export function useUpdateCollection() {
    const { apiRequest } = useApiContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }) => apiRequest(`/collections/${id}`, {
            method: 'PUT',
            body: data,
        }),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            queryClient.invalidateQueries({ queryKey: ['collection', id] });
        },
    });
}

export function useDeleteCollection() {
    const { apiRequest } = useApiContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => apiRequest(`/collections/${id}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        },
    });
}
