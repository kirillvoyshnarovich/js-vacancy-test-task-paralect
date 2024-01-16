export enum ScopeType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum LayoutType {
  MAIN = 'MAIN',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export enum RoutePath {
  // Private paths
  Profile = '/profile',

  // Auth paths
  Product = '/',
  SignIn = '/sign-in',
  SignUp = '/sign-up',
  ForgotPassword = '/forgot-password',
  ResetPassword = '/reset-password',
  ExpireToken = '/expire-token',
  MyProduct = '/my-products',
  CreateProduct = '/my-products/create',
  Cart = '/cart',
  NotFound = '/404',
  NoAuthorization = '/401',
  PaymentResult = '/payment-result',
}

type RoutesConfiguration = {
  [routePath in RoutePath]: {
    scope?: ScopeType;
    layout?: LayoutType;
  };
};

export const routesConfiguration: RoutesConfiguration = {
  // Private routes
  [RoutePath.Profile]: {
    scope: ScopeType.PRIVATE,
    layout: LayoutType.MAIN,
  },
  [RoutePath.MyProduct]: {
    scope: ScopeType.PRIVATE,
    layout: LayoutType.MAIN,
  },
  [RoutePath.CreateProduct]: {
    scope: ScopeType.PRIVATE,
    layout: LayoutType.MAIN,
  },
  [RoutePath.Cart]: {
    scope: ScopeType.PRIVATE,
    layout: LayoutType.MAIN,
  },
  // Auth routes
  [RoutePath.Product]: {
    scope: ScopeType.PRIVATE,
    layout: LayoutType.MAIN,
  },
  [RoutePath.SignIn]: {
    scope: ScopeType.PUBLIC,
    layout: LayoutType.UNAUTHORIZED,
  },
  [RoutePath.SignUp]: {
    scope: ScopeType.PUBLIC,
    layout: LayoutType.UNAUTHORIZED,
  },
  [RoutePath.ForgotPassword]: {
    scope: ScopeType.PUBLIC,
    layout: LayoutType.UNAUTHORIZED,
  },
  [RoutePath.ResetPassword]: {
    scope: ScopeType.PUBLIC,
    layout: LayoutType.UNAUTHORIZED,
  },
  [RoutePath.ExpireToken]: {
    scope: ScopeType.PUBLIC,
    layout: LayoutType.UNAUTHORIZED,
  },
  [RoutePath.PaymentResult]: {
    scope: ScopeType.PRIVATE,
    layout: LayoutType.MAIN,
  },
  [RoutePath.NoAuthorization]: {
    scope: ScopeType.PUBLIC,
    layout: LayoutType.MAIN,
  },
  [RoutePath.NotFound]: {},
};
