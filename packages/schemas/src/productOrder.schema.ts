import { z } from 'zod';

export const productOrder = z.object({
  _id: z.string(),
  title: z.string().nullable(),
  price: z.number().nullable(),
  statusSold: z.union([z.literal('onSale'), z.literal('sold')]).nullable(),
  vendor: z.string().nullable(),
  imageUrl: z.string().nullable(),
  totalQuantity: z.number().nullable(),
  quantity: z.number(),
});
