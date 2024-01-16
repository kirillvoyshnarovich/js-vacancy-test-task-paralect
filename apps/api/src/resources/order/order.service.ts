import _ from 'lodash';

import { Order } from 'types';
import { orderSchema } from 'schemas';
import { DATABASE_DOCUMENTS } from 'app-constants';

import db from 'db';

const service = db.createService<Order>(DATABASE_DOCUMENTS.ORDER, {
  schemaValidator: (obj) => orderSchema.parseAsync(obj),
});

const getPublic = (product: Order | null) => _.omit(product);

export default Object.assign(service, {
  getPublic,
});
