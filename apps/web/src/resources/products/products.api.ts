import { useMutation, useQuery } from 'react-query';

import { Product } from 'types';

import { apiService } from 'services';

import queryClient from 'query-client';

export function useCreateProduct<FormData>() {
  const createProduct = (data: FormData) => apiService.post('/products/create', data);

  return useMutation<Product, unknown, FormData>(createProduct, {
    onSuccess: (data) => {
      queryClient.setQueryData(['products'], data);
    },
  });
}

export function useProducts<T>(params: T) {
  const list = () => apiService.get('/products', params);

  interface ProductListResponse {
    count: number;
    items: Product[];
    totalPages: number;
  }

  return useQuery<ProductListResponse>(['products', params], list);
}

export function useMyProducts<T>(params: T) {
  const list = () => apiService.get('/products', params);

  interface ProductListResponse {
    count: number;
    items: Product[];
    totalPages: number;
  }

  return useQuery<ProductListResponse>(['my-products'], list);
}

export function useRemoveProduct<T>() {
  const removeProduct = (params: T) => apiService.delete('/products', params);

  return useMutation<Function, T, T>(removeProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });
}
