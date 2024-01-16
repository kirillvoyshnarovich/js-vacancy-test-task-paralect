import { 
  AppKoaContext, 
  Next, 
  AppRouter,
} from 'types';
import { orderService } from 'resources/order';
import { userService } from 'resources/user';
import { 
  analyticsService,
} from 'services';
import { z } from 'zod';
import { validateMiddleware } from 'middlewares';
import config from 'config';
import logger from 'logger';
import { ObjectId } from '@paralect/node-mongo';

const removeOrder = z.object({
  id: z.string(),
});

type ValidatedData = z.infer<typeof removeOrder>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;
  const isUserExists = await userService.exists({ _id: user._id });

  ctx.assertError(isUserExists, 'User not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const {
    id,
  } = ctx.validatedData;
  try {
    await orderService.atomic.updateOne(
      { userId: user._id, paymentСompleted: false }, 
      { $pull: { products: { _id: id } } },
    );
  } catch (e) {
    logger.error(`Order removed error: ${e}`);
  }

  if (analyticsService) {
    analyticsService.track('Order deleted', {
      email: user.email,
    });
  }
  
  ctx.body = config.IS_DEV ? { message: 'Order successfully deleted' } : { message: 'Order successfully deleted' };
}

export default (router: AppRouter) => {
  router.delete('/product/remove', validateMiddleware(removeOrder), validator, handler);
};