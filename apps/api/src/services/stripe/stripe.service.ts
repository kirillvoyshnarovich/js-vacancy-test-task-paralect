import config from 'config';
import Stripe from 'stripe';
import { z } from 'zod';

const stripeConfig = {
  secretKey: config.STRIPE_SECRET_KEY,
};

const stripeConfigSchema = z.object({
  secretKey: z.string(),
});

type StripeConfigType = z.infer<typeof stripeConfigSchema>;

class StripeService {
  app: Stripe;

  constructor(conf: StripeConfigType) {
    this.app = new Stripe(conf.secretKey);
  }

  listen = () => {

  };
}

export default new StripeService(stripeConfig);