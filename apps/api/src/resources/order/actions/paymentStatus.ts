import { AppKoaContext, Next, AppRouter, Product, Order } from 'types';
import { productsService } from 'resources/products';
import { userService } from 'resources/user';
import { orderService } from 'resources/order';
import { validateMiddleware } from 'middlewares';
import { StripeService, analyticsService } from 'services';
import { arrayOutputType, z } from 'zod';
import logger from 'logger';
import config from 'config';
import consoleLogger from 'logger';

const domain = 'http://localhost:3002';

async function validator(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;
  const isUserExists = await userService.exists({ _id: user._id });

  ctx.assertError(isUserExists, 'User not found');

  await next();
}

async function handler(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;
  const { body } = ctx.request;
  
  try {

  } catch (e) {
    logger.error(`Payment error: ${e}`);
  }
  
  if (analyticsService) {
    analyticsService.track('Order successfully paid', {
      email: user.email,
    });
  }
  
  ctx.body = config.IS_DEV ? { } : { };
}

export default (router: AppRouter) => {
  router.post('/', validator, handler);
};