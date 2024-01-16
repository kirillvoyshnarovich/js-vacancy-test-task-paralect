import { 
  AppKoaContext,
  Next,
  AppRouter,
  Order,
} from 'types';
import { orderService } from 'resources/order';
import { userService } from 'resources/user';
import { 
  analyticsService,
} from 'services';
import { z } from 'zod';
import { validateMiddleware } from 'middlewares';
import logger from 'logger';
import config from 'config';

const DEFAULT_QUANTITY = 1;

const schema = z.object({
  productId: z.string(),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;
  const isUserExists = await userService.exists({ _id: user._id });

  ctx.assertError(isUserExists, 'User not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const {
    productId,
  } = ctx.validatedData;

  let order: Order | null = null;
  let newOrder: any = null;

  try {
    order = await orderService.findOne({ userId: user._id, paymentСompleted: false });
  } catch (e) {
    logger.error(`Error during order search: ${e}`);
  }

  const editedProduct = {
    _id: productId,
    quantity: DEFAULT_QUANTITY,
    title: null,
    price: null,
    statusSold: null,
    vendor: null,
    imageUrl: null,
    totalQuantity: null,
  };

  try {
    if (order) {
      const existProductInOrder = order?.products?.find((item) => {
        return item._id === productId;
      });

      if (existProductInOrder) {
        await orderService.atomic.updateOne(
          { _id: order._id, products: { $elemMatch: { _id: productId } } },
          { $inc: { 'products.$.quantity' : 1 } },
        );
      } else {
        await orderService.atomic.updateOne(
          { _id: order._id },
          { $push: { products: editedProduct } },
        );
      }
    } else {

      newOrder = await orderService.insertOne({
        products: [editedProduct],
        paymentСompleted: false,
        paymentMethod: 'creditCard',
        userId: user._id,
      });
    }
  } catch (e) {
    logger.error('Error adding a product or creating an order', e);
  }
  
  if (analyticsService) {
    analyticsService.track('Added new order', {
      email: user.email,
    });
  }
  
  ctx.body = config.IS_DEV ? newOrder : newOrder;
}

export default (router: AppRouter) => {
  router.post('/create', validateMiddleware(schema), validator, handler);
};