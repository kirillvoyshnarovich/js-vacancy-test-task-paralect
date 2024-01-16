import { Order } from 'types';
import { apiService } from 'services';
import queryClient from 'query-client';
import { useMutation, useQuery } from 'react-query';

export function useOrderPay() {
  const responsePay = () => apiService.post('/order/pay');

  interface ResponsePay {

  }

  return useMutation<ResponsePay>(responsePay, {
    onSuccess: (data: any) => {
      const link = document.createElement('a');
      link.href = data.redirectUrl;
      link.target = '_blank';
      link.click();
    },
    onError: () => {

    },
  });
}

export function useOrderHistory() {
  const list = () => apiService.get('/order/history');

  interface ProductListResponse {
    count: number;
    items: Order[];
    totalPages: number;
  }

  return useQuery<ProductListResponse>(['order'], list);
}

export function useRemoveProductsOrder<T>() {
  const removeOrder = (params: T) => apiService.delete('/order/product/remove', params);

  return useMutation<Function, T, T>(removeOrder, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['order']);
    },
  });
}

export function useCreateOrder<T>() {
  const createOrder = (order: T) => apiService.post('/order/create', order);
  return useMutation<Order, unknown, T>(createOrder, {
    onSuccess: () => {
      // queryClient.invalidateQueries(['order']);
    },
  });
}

export function useAddOrderProduct<T>() {
  const removeProduct = (params: T) => apiService.post('/order/productAdd', params);

  return useMutation<Function, T, T>(removeProduct, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['order']);
    },
  });
}

export function useRemoveOrderProduct<T>() {
  const removeProduct = (params: T) => apiService.post('/order/productRemove', params);

  return useMutation<Function, T, T>(removeProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(['order']);
    },
  });
}

export function useGetOrder(section: string) {
  const list = () => apiService.get('/order');

  return useQuery<Order>(['order'], list, { enabled: section === 'order' });
}

export function useGetHistory(section: string) {
  const list = () => apiService.get('/order/history');

  interface HistoryListResponse {
    count: number;
    items: Order[];
    totalPages: number;
  }

  return useQuery<HistoryListResponse>(['history'], list, { enabled: section === 'history' });
}
