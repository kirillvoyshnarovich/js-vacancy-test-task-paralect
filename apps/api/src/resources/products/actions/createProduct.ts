import { AppKoaContext, Next, AppRouter, Product } from 'types';
import { productsService } from 'resources/products';
import { userService } from 'resources/user';
import { analyticsService, storageService } from 'services';
import logger from 'logger';
import { z } from 'zod';
import multer from '@koa/multer';
import config from 'config';

const DEFAULT_QUANTITY = 10;

const upload = multer();

const schema = z.object({
  title: z.string(),
  price: z.string(),
  file: z.any(),
});

interface ValidatedData extends z.infer<typeof schema> {
  product: Product;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;
  const isUserExists = await userService.exists({ _id: user._id });

  ctx.assertError(isUserExists, 'User not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { price, title } = ctx.request.body as any;

  const { file } = ctx.request;
  let imageUrl: string | undefined;
  let product: Product | null = null;

  if (file) {
    const fileName = `${user._id}-${Date.now()}-${file.originalname}`;
    imageUrl = await storageService.uploadImage(file, fileName);
  }
  try {
    product = await productsService.insertOne({
      title,
      price: Number(price),
      statusSold: 'onSale',
      vendor: user._id,
      imageUrl,
      totalQuantity: DEFAULT_QUANTITY,
    });
  } catch (e) {
    logger.error(`Create product Error: ${e}`);
  }

  if (analyticsService) {
    analyticsService.track('New product created', {
      email: user.email,
      title,
    });
  }
  
  ctx.body = config.IS_DEV ? product : product;
}

export default (router: AppRouter) => {
  router.post('/create', upload.single('file'), validator, handler);
};