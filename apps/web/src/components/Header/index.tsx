import { FC, memo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Image, Tabs, Badge, Button } from '@mantine/core';
import { accountApi } from 'resources/account';
import { LogOutIcon, ShoppingCartIcon } from 'public/images';
import { RoutePath } from 'routes';
import { orderApi } from 'resources/order';
import classes from './Header.module.css';

const Header: FC<any> = () => {
  const router = useRouter();
  const changeSection = (section: string | null) => {
    if (!section) return;
    router.push(section);
  };

  const {
    data,
    isLoading: isOrderLoading,
  } = orderApi.useGetOrder('order');

  const { mutate: signOut } = accountApi.useSignOut();
  const isAuthorized = true;

  const countProducts = data?.products?.length;

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <Image
          visibleFrom="sm"
          alt="Logo"
          src="/images/logo_shopy.svg"
        />
        {
          isAuthorized ? (
            <Tabs
              variant="unstyled"
              defaultValue="marketplace"
              classNames={classes}
              value={
                router.pathname?.includes('/my-products')
                  ? '/my-products'
                  : '/'
              }
              onChange={(value) => changeSection(value)}
            >
              <Tabs.List>
                <Tabs.Tab value="/">
                  Marketplace
                </Tabs.Tab>
                <Tabs.Tab value="/my-products">
                  Your Products
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
          ) : null
        }
        <div className={classes.icons}>
          <Link href={RoutePath.Cart} style={{ all: 'unset' }}>
            <span className={classes.iconWrapper}>
              <ShoppingCartIcon />
              {
              (!isOrderLoading && countProducts) && (
                <Badge classNames={{ root: classes.badgeRoot }}>
                  {countProducts}
                </Badge>
              )
              }
            </span>
          </Link>
          <Button onClick={() => signOut()} style={{ all: 'unset' }}>
            <span className={classes.iconWrapper}>
              <LogOutIcon />
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
