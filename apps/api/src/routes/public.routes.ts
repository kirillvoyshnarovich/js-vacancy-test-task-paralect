import mount from 'koa-mount';

import { AppKoa, AppRouter } from 'types';

import { accountRoutes } from 'resources/account';
import { paymentRoutes } from 'resources/payment';
import { productsRoutes } from 'resources/products';

const healthCheckRouter = new AppRouter();
healthCheckRouter.get('/health', ctx => ctx.status = 200);

export default (app: AppKoa) => {
  app.use(healthCheckRouter.routes());
  app.use(mount('/account', accountRoutes.publicRoutes));
  app.use(mount('/webhook', paymentRoutes.publicRoutes));
  app.use(mount('/products', productsRoutes.publicRoutes));
};
