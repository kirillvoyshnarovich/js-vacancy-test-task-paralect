import { AppKoaContext, Next, AppRouter } from 'types';
import { orderService } from 'resources/order';
import { StripeService, analyticsService } from 'services';
import { ProductOrder, Product } from 'types';
import logger from 'logger';
import config from 'config';
import database from 'db';
import { productsService } from 'resources/products';

const endpointSecret = config.STRIPE_ENDPOINT_KEY;

const updateQuantityProductsInOrder = (products: ProductOrder[], productsFromOrder: Product[]) => {
  const idQuantityObj: any = {};

  products.map((product: ProductOrder) => {
    idQuantityObj[product._id] = product.quantity;
  });

  return productsFromOrder.map((product: Product) => {
    const totalQuantity: number = product?.totalQuantity;

    const quantitySold: {
      totalQuantity: number | null,
      statusSold: string,
      quantity: number | null,
    } = {
      totalQuantity: null,
      statusSold: 'onSale',
      quantity: null,
    };
    
    const quantityValue = product.totalQuantity - idQuantityObj[product._id];

    if (totalQuantity > idQuantityObj[product._id]) {

      quantitySold.quantity = idQuantityObj[product._id];
      quantitySold.totalQuantity = quantityValue;
    } else if (totalQuantity <= idQuantityObj[product._id]) {

      quantitySold.quantity = idQuantityObj[product._id];
      quantitySold.totalQuantity = quantityValue;
      quantitySold.statusSold = !quantityValue ? 'Sold' : 'onSale';
    }

    return {
      ...product,
      ...quantitySold,
    };
  });
};

async function handler(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;
  const sign: string | string[] = ctx.headers['stripe-signature'] ?? [];

  let event: any;
  try {
    event = StripeService.app.webhooks.constructEvent(ctx.request.rawBody, sign, endpointSecret);
  } catch (e: any) {
    ctx.status = 202;
    ctx.body = `Webhook Error: ${ e.message }`;
  }

  if (event.type === 'checkout.session.completed') {

    const session: any = await StripeService.app.checkout.sessions.retrieve(event.data.object.id);
    const order: any = await orderService.findOne({ _id: session.client_reference_id });
    const productIds: string[] = order?.products?.map((item: ProductOrder) => item._id);
    const productsFromOrder: any = await productsService.find({ _id: { $in: productIds } });
    const updatedProducts: any = updateQuantityProductsInOrder(order?.products, productsFromOrder.results);

    const operations: any = [];
    
    updatedProducts.map((item: any) => {
      operations.push({
        updateOne: {
          filter: { _id: item._id },
          update: { $set: { totalQuantity: item.totalQuantity, statusSold: item.statusSold } },
          upsert: true,
        },
      });
      delete item.totalQuantity;
      return item;
    });

    const client: any = await database.database.getClient();
    const productsCollection: any = client?.db('api-development').collection('products');
    const dbSession: any = client?.startSession();

    try {
      if (!productsCollection || !dbSession) return;
      await dbSession.withTransaction(async () => {
        await productsCollection.bulkWrite(operations);

        await orderService.atomic.updateOne(
          { _id: session.client_reference_id },
          { $set: { paymentСompleted: true, products: updatedProducts } },
        );
      });
    } catch (e) {
      logger.error(`Server-side error contact technical support: ${e}`);
    } finally {
      await dbSession?.endSession();
    }
  }
  
  if (analyticsService) {
    analyticsService.track('Order successfully paid', {
      email: user.email,
    });
  }
  
  ctx.status = 202;
  next();
}

export default (router: AppRouter) => {
  router.post('/', handler);
};