import { routeUtil } from 'utils';

import getProduct from './actions/getProduct';
import getProducts from './actions/getProducts';
import createProduct from './actions/createProduct';
import editProduct from './actions/editProduct';
import deleteProduct from './actions/deleteProduct';

const publicRoutes = routeUtil.getRoutes([
  getProducts,
]);

const privateRoutes = routeUtil.getRoutes([
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
]);

export default {
  publicRoutes,
  privateRoutes,
};
