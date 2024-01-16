import { z } from 'zod';
import { AppKoaContext, Next, AppRouter, Product } from 'types';
import { userService } from 'resources/user';
import { productsService } from 'resources/products';
import { validateMiddleware } from 'middlewares';
import { storageService } from 'services';

const schema = z.object({
  page: z.string().transform(Number).default('1'),
  perPage: z.string().transform(Number).default('10'),
  sort: z.enum(['asc', 'desc']).default('desc'),
  searchValue: z.string().default(''),
  price: z.object({
    from: z.string().default('1').optional(),
    to: z.string().default('1000000').optional(),
  }).nullable().default(null),
  userId: z.string().optional(),
});

type ValidatedData  = z.infer<typeof schema>; 

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    perPage, page, sort, searchValue, price, userId,
  } = ctx.validatedData;

  const {
    user,
  } = ctx.state;

  const validatedSearch = searchValue.split('\\').join('\\\\').split('.').join('\\.');
  const regExp = new RegExp(validatedSearch, 'gi');

  let products: any = [];
  
  const filters = user 
    ? { title: { $regex: regExp }, vendor: { $ne: user._id } }
    : { title: { $regex: regExp } };
  
  const fromPrice = Number(price?.from);
  const toPrice = Number(price?.to);

  if (userId) {
    products = await productsService.find({ vendor: userId });
  } else {
    products = await productsService.find(
      {
        $and: [
          filters,
          fromPrice && toPrice 
            ? { price: { $gte: fromPrice, $lte: toPrice } } 
            : fromPrice && !toPrice
              ? { price: { $gte: fromPrice } }
              : !fromPrice && toPrice
                ? { price: { $lte: toPrice } }
                : {},
        ],
      },
      { page, perPage },
      { sort: {
        createdOn: sort === 'asc' ? -1 : 1,
      } },
    );
  }

  const placeholderImage = await storageService.getPlaceholderImage();

  ctx.body = {
    items: products.results.map((item: Product) => {
      item.imageUrl = item.imageUrl ?? placeholderImage;
      return item;
    }),
    totalPages: products.pagesCount,
    count: products.count,
  };
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), handler);
};