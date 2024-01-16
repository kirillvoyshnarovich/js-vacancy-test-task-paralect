import { z } from 'zod';
import dbSchema from './db.schema';
import { productOrder } from './productOrder.schema';

const paymentMethods = {
  creditCard: 'creditCard',
  cash: 'cash',
};

export const orderSchema = dbSchema.extend({
  products: z.array(productOrder),
  paymentСompleted: z.boolean(),
  paymentMethod: z.union([z.literal(paymentMethods.creditCard), z.literal(paymentMethods.cash)]),
  userId: z.string(),
  totalCost: z.number().optional(),
}).strict();
