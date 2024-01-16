import { z } from 'zod';
import dbSchema from './db.schema';

export const productSchema = dbSchema.extend({
  title: z.string(),
  price: z.number(),
  statusSold: z.union([z.literal('onSale'), z.literal('sold')]),
  vendor: z.string(),
  imageUrl: z.string().nullable(),
  totalQuantity: z.number().default(10),
}).strict();
