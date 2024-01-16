import { 
  AppKoaContext, 
  Next, 
  AppRouter, 
  ProductOrder,
} from 'types';
import { orderService } from 'resources/order';
import { userService } from 'resources/user';
import { productsService } from 'resources/products';
import { 
  analyticsService,
} from 'services';
import { z } from 'zod';
import { validateMiddleware } from 'middlewares';
import logger from 'logger';
import config from 'config';

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

async function handler(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;
  const {
    productId,
  } = ctx.validatedData;
  
  let res: any | null = null;
  const order = await orderService.findOne({ userId: user._id, paymentСompleted: false });
  const product = await productsService.findOne({ _id: productId });
  const totalQuantity = product?.totalQuantity as number;
  const productInOrder: ProductOrder | null | undefined = order?.products?.find((item: ProductOrder) => {
    return item._id === productId;
  });

  let noProduct = false;
  if (productInOrder) {
    noProduct = totalQuantity < productInOrder?.quantity + 1;
  }


  try {
    if (!noProduct) {
      await orderService.atomic.updateOne(
        { _id: order?._id, products: { $elemMatch: { _id: productInOrder?._id } } },
        {  $inc: { 'products.$.quantity': 1 } },
      );

      res = await orderService.findOne({ _id: order?._id });
    } if (noProduct) {
      res = { message: 'This product is no longer in stock' };
    }
  } catch (e) {
    logger.error(`Product quantity increse error: ${e}`);
  }

  if (analyticsService) {
    analyticsService.track('Added nproduct to order', {
      email: user.email,
    });
  }
  
  ctx.body = config.IS_DEV ? res : res;
}

export default (router: AppRouter) => {
  router.post('/productAdd', validateMiddleware(schema), validator, handler);
};