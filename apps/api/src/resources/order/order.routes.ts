import { routeUtil } from 'utils';

import createOrder from './actions/createOrder';
import getOrder from './actions/getOrder';
import payOrder from './actions/payOrder';
import removeOrder from './actions/removeOrder';
import updateOrder from './actions/updateOrder';
import getOrderHistory from './actions/getOrderHistory';
import increseCoutProduct from './actions/increseCoutProduct';
import decreaseCoutProduct from './actions/decreaseCoutProduct';
import paymentStatus from './actions/paymentStatus';

const publicRoutes = routeUtil.getRoutes([

]);

const privateRoutes = routeUtil.getRoutes([
  createOrder,
  getOrder,
  payOrder,
  removeOrder,
  updateOrder,
  getOrderHistory,
  increseCoutProduct,
  decreaseCoutProduct,
  paymentStatus,
]);

export default {
  publicRoutes,
  privateRoutes,
};
