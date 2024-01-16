import { NextPage } from 'next';
import { useCallback, useMemo, useState } from 'react';
import { InfoBlock } from 'components/index';
import { Grid, Stack, Title, Flex, Divider, Tabs, Button, Table, Image, Text, Loader } from '@mantine/core';
import { useQueryClient } from 'react-query';
import { handleError, notify, formatePrice, formateDate } from 'utils';
import { Order, ProductOrder } from 'types';
import { orderApi } from 'resources/order';
import { IconX } from '@tabler/icons-react';
import classes from './cart.module.css';

const Cart: NextPage = () => {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<string>('order');
  const isAuthorized = true;

  const {
    data: order,
    isLoading: isListLoading,
    isRefetching: refetchingOrder,
  } = orderApi.useGetOrder(activeTab);

  const {
    data: history,
    isLoading: isHistoryLoading,
    isRefetching: refetchingHistory,
  } = orderApi.useGetHistory(activeTab);

  const {
    mutate: removeProductOrder,
    isLoading: isRemoveLoading,
  } = orderApi.useRemoveOrderProduct();

  const {
    mutate: addProductOrder,
    isLoading: isCreateLoading,
  } = orderApi.useAddOrderProduct();

  const {
    mutate: removeProducts,
    isLoading: isRemoveOrder,
  } = orderApi.useRemoveProductsOrder();

  const {
    mutate: pay,
    isLoading: isOrderPay,
  } = orderApi.useOrderPay();

  /* eslint no-param-reassign: 0 */
  const changeQuantity = useCallback((el: ProductOrder, inc: string) => {
    const body = {
      productId: el._id,
    };

    if (inc === 'plus') {
      addProductOrder(body, {
        onSuccess: async (fun: Function, variables: any, res: any) => {
          await queryClient.invalidateQueries(['order']);
          const message = res.message ? res.message : 'This product has been successfully added to your cart';
          notify(message, 'info');
        },
        onError: (e: any) => handleError(e),
      });
    } else if (el.quantity > 0) {
      removeProductOrder(body, {
        onSuccess: async () => {
          await queryClient.invalidateQueries(['order']);
          notify('This product has been successfully removed from your cart');
        },
        onError: (e: any) => handleError(e),
      });
    }
  }, [addProductOrder, removeProductOrder, queryClient]);

  const removeProductsOrderHandler = useCallback((el: ProductOrder) => {
    if (!el) {
      return;
    }

    removeProducts({ id: el._id }, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['order']);
        notify('Products removed successfully');
      },
      onError: (e: any) => handleError(e),
    });
  }, [removeProducts, queryClient]);

  const rows = useMemo(() => {
    if (activeTab === 'order' && order?.products?.length) {
      return order?.products.map((element: any) => (
        <Table.Tr
          key={element.title}
          classNames={{
            tr: classes.tr,
          }}
        >
          <Table.Td className={classes.td} style={{ height: '30px', paddingLeft: 0 }}>
            <div className={`${classes.td__wrapper} ${classes.td__wrapper_center}`}>
              <div className={classes.imageWrapper}>
                <Image
                  src={element.imageUrl}
                  height={80}
                  width={80}
                  alt="Product Image"
                  className={classes.image}
                />
              </div>
              <Text ml={25} fw={600}>
                {element.title}
              </Text>
            </div>
          </Table.Td>
          <Table.Td className={classes.td}>
            <span className={classes.td__wrapper}>
              $
              {formatePrice(element?.price)}
            </span>
          </Table.Td>
          <Table.Td className={classes.counter}>
            <span className={classes.td__wrapper}>
              <span
                className={classes.counter__control}
                role="button"
                tabIndex={0}
                onClick={() => changeQuantity(element, 'minus')}
                onKeyDown={() => changeQuantity(element, 'minus')}
              >
                -
              </span>
              <span className={classes.counter__quantity}>{element.quantity}</span>
              <span
                className={classes.counter__control}
                role="button"
                tabIndex={0}
                onClick={() => changeQuantity(element, 'plus')}
                onKeyDown={() => changeQuantity(element, 'plus')}
              >
                +
              </span>
            </span>
          </Table.Td>
          <Table.Td className={classes.td}>
            <button type="button" className={classes.removeButton} onClick={() => removeProductsOrderHandler(element)}>
              <IconX
                className={classes.iconX}
              />
              Remove
            </button>
          </Table.Td>
        </Table.Tr>
      ));
    }

    if (activeTab === 'history' && history?.items?.length) {
      const preparedRows: any = [];
      history?.items.map((item: Order) => {
        preparedRows.push(
          <Table.Tr
            w={100}
            style={{ height: '30px', colspan: 3 }}
          >
            <Table.Td style={{ paddingLeft: 0 }}>
              <div className={classes.orderNumber}>
                <span className={classes.orderNumber__title}>Order number:</span>
                <span className={classes.orderNumber__num}>
                  {item._id}
                </span>
              </div>
            </Table.Td>
          </Table.Tr>,
        );
        item?.products.map((element: any) => {
          preparedRows.push(
            <Table.Tr
              key={element._id}
              classNames={{
                tr: classes.tr,
              }}
            >
              <Table.Td
                className={classes.td}
                style={{ height: '30px', paddingLeft: 0 }}
              >
                <span className={`${classes.td__wrapper} ${classes.td__wrapper_center}`}>
                  <div className={classes.imageWrapper}>
                    <Image
                      src={element.imageUrl}
                      height={80}
                      width={80}
                      alt="Product Image"
                      className={classes.image}
                    />
                  </div>
                  <Text ml={25} fw={700}>
                    {element.title}
                  </Text>
                </span>
              </Table.Td>
              <Table.Td
                className={classes.td}
                style={{ height: '30px' }}
                fw={500}
              >
                <span className={classes.td__wrapper}>
                  $
                  {formatePrice(element?.price)}
                </span>
              </Table.Td>
              <Table.Td
                className={classes.date}
                style={{ height: '30px' }}
                fw={500}
              >
                {formateDate(element?.createdOn)}
              </Table.Td>
            </Table.Tr>,
          );
          return element;
        });
        return order;
      });
      return preparedRows;
    }

    return [];
  }, [activeTab, order, history, changeQuantity, removeProductsOrderHandler]) ?? [];

  const rowsHeader = useMemo(() => {
    if (activeTab === 'order') {
      return (
        <Table.Tr
          classNames={{
            tr: classes.tr,
          }}
          style={{ borderTop: 0 }}
        >
          <Table.Th classNames={{ th: classes.th }} style={{ paddingLeft: 0, textAlign: 'left' }}>
            Item
          </Table.Th>
          <Table.Th classNames={{
            th: classes.th,
          }}
          >
            Unit Price
          </Table.Th>
          <Table.Th classNames={{
            th: classes.th,
          }}
          >
            Quantity
          </Table.Th>
          <Table.Th> </Table.Th>
        </Table.Tr>
      );
    }

    if (activeTab === 'history') {
      return (
        <Table.Tr
          classNames={{
            tr: classes.tr,
          }}
          style={{ borderTop: 0 }}
        >
          <Table.Th classNames={{ th: classes.th }} style={{ paddingLeft: 0, textAlign: 'left' }}>
            Item
          </Table.Th>
          <Table.Th
            classNames={{
              th: classes.th,
            }}
          >
            Unit Price
          </Table.Th>
          <Table.Th
            classNames={{
              th: classes.th,
            }}
          >
            Date
          </Table.Th>
        </Table.Tr>
      );
    }

    return [];
  }, [activeTab]);

  const loading = isListLoading
    || isRemoveLoading
    || isCreateLoading
    || isRemoveOrder
    || isOrderPay
    || isHistoryLoading
    || refetchingOrder
    || refetchingHistory;

  return (
    <Grid
      grow
      className={classes.wrapper}
    >
      <Grid.Col
        span={rows.length ? 9 : 12}
        style={rows.length ? { paddingRight: '70px', height: '100%' } : { paddingRight: 0, height: '100%' }}
      >
        <Tabs
          variant="unstyled"
          defaultValue="order"
          classNames={classes}
          value={activeTab}
          onChange={(tab) => setActiveTab(tab as string)}
        >
          <Tabs.List>
            <Tabs.Tab
              classNames={{
                tab: classes.tab,
              }}
              value="order"
              onClick={() => {}}
            >
              My cart
            </Tabs.Tab>
            {
              isAuthorized ? (
                <Tabs.Tab value="history" onClick={() => {}}>
                  History
                </Tabs.Tab>
              ) : null
            }
          </Tabs.List>

          <Tabs.Panel value="order">
            {
              activeTab === 'order' && rows.length ? (
                <Table>
                  <Table.Thead>
                    {rowsHeader}
                  </Table.Thead>
                  <Table.Tbody>
                    {rows}
                  </Table.Tbody>
                </Table>
              ) : (
                <InfoBlock
                  textHint={['You haven`t made any purchases yet.', 'Go to the marketplace and make purchases.']}
                  textTitle="Oops, there`s nothing here yet!"
                  textButton="Go to Marketplace"
                  imageUrl="/images/cardPage/balloon_empty_state.png"
                  buttonLink="/"
                />
              )
            }
          </Tabs.Panel>

          <Tabs.Panel value="history">
            {
              activeTab === 'history' && rows.length ? (
                <Table>
                  <Table.Thead>
                    {rowsHeader}
                  </Table.Thead>
                  <Table.Tbody>
                    {rows}
                  </Table.Tbody>
                </Table>
              ) : (
                <InfoBlock
                  textHint={['You haven`t made any purchases yet.', 'Go to the marketplace and make purchases.']}
                  textTitle="Oops, there`s nothing here yet!"
                  textButton="Go to Marketplace"
                  imageUrl="/images/cardPage/balloon_empty_state.png"
                  buttonLink="/"
                />
              )
            }
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
      {
        rows.length && isAuthorized && (
          <Grid.Col span={3} className={classes.columnSummary}>
            {
              activeTab === 'order' && (
              <div className={classes.summaryWrapper}>
                <Title order={3} className={classes.summaryTitle}>
                  Summary
                </Title>
                <Divider my="md" />
                <Stack>
                  <Flex className={classes.summaryInfo}>
                    <Text>Total price</Text>
                    <Text fw={700}>
                      $
                      {formatePrice(order?.totalCost as any)}
                    </Text>
                  </Flex>
                  <Button
                    color="blue"
                    fullWidth
                    mt="md"
                    radius="md"
                    classNames={{
                      label: classes.ckeckoutButton,
                    }}
                    onClick={() => pay()}
                  >
                    Proceed to Ckeckout
                  </Button>
                </Stack>
              </div>
              )
            }
          </Grid.Col>
        )
      }
      {
        loading ? (
          <Loader
            size={40}
            classNames={{
              root: classes.loader,
            }}
          />
        ) : null
      }
    </Grid>
  );
};

export default Cart;
