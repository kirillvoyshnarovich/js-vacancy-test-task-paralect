import { z } from 'zod';

import { orderSchema, productOrder } from 'schemas';

export type Order = z.infer<typeof orderSchema>;
export type ProductOrder = z.infer<typeof productOrder>;
