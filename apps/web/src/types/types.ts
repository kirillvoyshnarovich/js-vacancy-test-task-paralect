export interface ProductsListParams {
  page?: number;
  perPage?: number;
  searchValue?: string;
  sort?: 'asc' | 'desc' | null,
  filter?: {
    createdOn?: {
      sinceDate: Date | null;
      dueDate: Date | null;
    };
  };
  price?: {
    from?: number | null;
    to?: number | null;
  }
  userId?: string
}

export interface ProductId {
  productId: string
}
