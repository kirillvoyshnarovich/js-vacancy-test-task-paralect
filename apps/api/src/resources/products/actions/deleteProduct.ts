import { AppKoaContext, Next, AppRouter, Product } from 'types';
import { productsService } from 'resources/products';
import { userService } from 'resources/user';
import { validateMiddleware } from 'middlewares';
import { analyticsService, storageService } from 'services';
import { z } from 'zod';
import config from 'config';

const schema = z.object({
  productId: z.string(),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: Product;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;
  const isUserExists = await userService.exists({ _id: user._id });

  ctx.assertError(isUserExists, 'User not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { productId } = ctx.validatedData;
  const { user } = ctx.state;

  const product: Product | null = await productsService.findOne({
    _id: productId,
  });

  try {
    const resDeletion = await storageService.removeImage(product?.imageUrl as string);
  } catch (err) {
    logger.error(`Error when deleting an image ${err}`);
  }

  const res = await productsService.deleteOne({
    _id: productId,
  });

  if (analyticsService) {
    analyticsService.track('Removing a product', {
      email: user.email,
    });
  }
  
  ctx.body = config.IS_DEV ? 'The product was successfully removed' : 'The product was successfully removed';
}

export default (router: AppRouter) => {
  router.delete('/', validateMiddleware(schema), validator, handler);
};