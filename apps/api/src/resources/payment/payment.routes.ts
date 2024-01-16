import { routeUtil } from 'utils';

import checkPaymentStatus from './actions/payment';

const publicRoutes = routeUtil.getRoutes([
  checkPaymentStatus,
]);

export default {
  publicRoutes,
};
