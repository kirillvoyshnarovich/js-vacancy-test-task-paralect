import { AppKoaContext, Next, AppRouter } from 'types';
import { orderService } from 'resources/order';
import { userService } from 'resources/user';
import { analyticsService } from 'services';
import config from 'config';

async function validator(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;
  const isUserExists = await userService.exists({ _id: user._id });

  ctx.assertError(isUserExists, 'User not found');

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  const orderList = await orderService.find({ paymentСompleted: true });

  if (analyticsService) {
    analyticsService.track('Any', {
      email: user.email,
    });
  }

  const body = {
    items: orderList.results,
    totalPages: orderList.pagesCount,
    count: orderList.count,
  };

  ctx.body = config.IS_DEV ? body : body;
}

export default (router: AppRouter) => {
  router.get('/history', validator, handler);
};