import { AppKoaContext, Next, AppRouter, Product, ProductOrder } from 'types';
import { orderService } from 'resources/order';
import { productsService } from 'resources/products';
import { userService } from 'resources/user';
import { totalOrderCost } from 'utils';

async function validator(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;
  const isUserExists = await userService.exists({ _id: user._id });

  ctx.assertError(isUserExists, 'User not found');

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;
  const order = await orderService.findOne({ userId: user._id, paymentСompleted: false });
  let productIds: Array<string>;
  let products: any;
  let totalCost: number | null = null;
  let preparedProducts: any = null; 

  if (order) {
    productIds = order?.products.map((item) => item._id);
    products = await productsService.find({ _id: { $in: productIds } });

    preparedProducts = order?.products.map((item: ProductOrder) => {
      const product = products?.results.find((productItem: Product) => item._id === productItem._id);
      return {
        ...product,
        quantity: item.quantity,
      };
    });

    totalCost = order ? totalOrderCost(preparedProducts) : null;
  }

  ctx.body = order && totalCost ? {
    ...order,
    products: preparedProducts,
    totalCost,
  } : {};
}

export default (router: AppRouter) => {
  router.get('/', validator, handler);
};