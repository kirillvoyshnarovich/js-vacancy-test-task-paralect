import { NextPage } from 'next';
import { MyProductCard, InfoBlock } from 'components/index';
import { Grid, SimpleGrid, Image, Text, Card, Loader } from '@mantine/core';
import { useQueryClient } from 'react-query';
import { productsApi } from 'resources/products';
import { RoutePath } from 'routes';
import Link from 'next/link';
import { notify, handleError } from 'utils';
import classes from './my-products.module.css';

const MyProducts: NextPage = () => {
  const queryClient = useQueryClient();
  const account = queryClient.getQueryData(['account']) as any;

  const { mutate: removeProduct } = productsApi.useRemoveProduct();

  const handleRemoveProduct = (id: string) => {
    removeProduct({ productId: id }, {
      onSuccess: () => {
        queryClient.invalidateQueries(['my-products']);
        notify('The product has been successfully removed');
      },
      onError: (e: any) => handleError(e),
    });
  };

  const {
    data: products,
    isLoading: isListLoading,
  } = productsApi.useMyProducts({
    userId: account?._id,
  });

  return (
    <>
      <div> </div>
      <Grid
        style={{ minHeight: 'calc(100vh - 105px)', height: 'auto' }}
      >
        <Grid.Col span={3} className={classes.filters}>
          <Link href={RoutePath.CreateProduct} style={{ all: 'unset' }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h={270} w={270} className={classes.card}>
              <Image
                src="/images/myProductsPage/Plus.svg"
                alt="Puls Icon"
                w={38}
              />
              <Text c="#2B77EB" pt="12px">New Product</Text>
            </Card>
          </Link>
        </Grid.Col>
        <Grid.Col span={9} className={classes.listProducts}>
          <SimpleGrid cols={3} spacing="lg" verticalSpacing="lg" className={classes.products__list}>
            {
              /* eslint no-nested-ternary: 0 */
              isListLoading
                ? (
                  <Loader
                    size={40}
                    classNames={{
                      root: classes.loader,
                    }}
                  />
                )
                : products?.items.length && !isListLoading
                  ? products?.items.map((item: any) => (
                    <MyProductCard
                      name={item.title}
                      price={item.price}
                      imageUrl={item.imageUrl}
                      badge={item.statusSold}
                      removeProduct={() => handleRemoveProduct(item._id)}
                    />
                  )) : (
                    <InfoBlock
                      textHint={['You can start creating your product by going to the "New product" section.']}
                      textTitle="You don't have any probucts created"
                      textButton={null}
                      imageUrl="/images/cardPage/balloon_empty_state.png"
                      alignmentStyles={{ marginLeft: '200px' }}
                      buttonLink="/"
                    />
                  )
            }
          </SimpleGrid>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default MyProducts;
