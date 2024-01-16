import { 
  AppKoaContext, 
  Next, 
  AppRouter, 
  Product, 
  Order, 
  ProductOrder,
} from 'types';
import { userService } from 'resources/user';
import { orderService } from 'resources/order';
import { productsService } from 'resources/products';
import { StripeService, analyticsService } from 'services';
import config from 'config';
import logger from 'logger';

const DEFAULT_QUANTITY = 1;

const domain = 'http://localhost:3002';

async function validator(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;
  const isUserExists = await userService.exists({ _id: user._id });

  ctx.assertError(isUserExists, 'User not found');

  await next();
}

async function handler(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;

  const order: Order | null = await orderService.findOne({ userId: user._id, paymentСompleted: false });
  
  const productIds = order?.products.map((item) => item._id);

  const products = await productsService.find({ _id: { $in: productIds } });

  const preparedProducts = order?.products.map((item: ProductOrder) => {
    const product = products?.results.find((productItem: Product) => item._id === productItem._id);
    return {
      ...product,
      quantity: item.quantity,
    };
  });

  let session = null;
  
  const prices: any = preparedProducts?.map((item: any) => {
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          images: [item.imageUrl],
        },
        unit_amount: Number(item.price) * 100,
      },
      quantity: item.quantity,
    };
  });

  if (!prices.length) {
    return;
  }

  try {
    session = await StripeService.app.checkout.sessions.create({
      client_reference_id: order?._id.toString(),
      line_items: prices,
      mode: 'payment',
      success_url: `${domain}/payment-result?result=success`,
      cancel_url: `${domain}/payment-result?result=cancel`,
    });
  } catch (e) {
    logger.error(`Payment error: ${e}`);
  }
  
  if (analyticsService) {
    analyticsService.track('Order successfully paid', {
      email: user.email,
    });
  }
  
  ctx.body = config.IS_DEV ? { redirectUrl: session?.url } : { redirectUrl: session?.url };
}

export default (router: AppRouter) => {
  router.post('/pay', validator, handler);
};