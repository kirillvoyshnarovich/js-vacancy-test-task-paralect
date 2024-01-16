import { 
  AppKoaContext, 
  Next, 
  AppRouter, 
  Order,
  Product,
  ProductOrder,
} from 'types';
import { orderService } from 'resources/order';
import { userService } from 'resources/user';
import { 
  analyticsService,
} from 'services';
import { z } from 'zod';
import { validateMiddleware } from 'middlewares';
import  logger from 'logger';
import config from 'config';
import productService from 'resources/products/product.service';

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
  
  let res: Order | null = null;

  const order: Order | null = await orderService.findOne({ userId: user._id, paymentСompleted: false });
  const product: Product | null = await productService.findOne({ _id: productId });
  const existProduct: ProductOrder | undefined = order?.products?.find((item) => {
    return item._id === productId;
  });
  const totalQuantity: number | null | undefined = product?.totalQuantity;
  const len = order?.products.length;

  try {

    if (
      existProduct && 
      totalQuantity === 1 && 
      len === 1
    ) {
  
      await orderService.deleteOne({ _id: order?._id });
  
    } else if (existProduct && totalQuantity && totalQuantity > 1) {
  
      await orderService.atomic.updateOne(
        { _id: order?._id, products: { $elemMatch: { _id: existProduct?._id } } },
        { $inc: { 'products.$.quantity' : -1 } },
      );
      res = await orderService.findOne({ _id: order?._id });
  
    } else if (existProduct) {
  
      await orderService.atomic.updateOne(
        { userId: user._id, paymentСompleted: false }, 
        { $pull: { products: { _id: productId } } },
      );
  
    }

  } catch (e) {
    logger.error(`Product quantity decrease error: ${e}`);
  }

  if (analyticsService) {
    analyticsService.track('The product was removed from the order', {
      email: user.email,
    });
  }
  
  ctx.body = config.IS_DEV ? res : res;
}

export default (router: AppRouter) => {
  router.post('/productRemove', validateMiddleware(schema), validator, handler);
};