import { NextPage } from 'next';
import { useState, useLayoutEffect, SyntheticEvent, useRef, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { ProductCard, InfoBlock } from 'components/index';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  IconX,
  IconArrowsSort,
  IconChevronDown,
  IconPlaystationX,
  IconSearch,
} from '@tabler/icons-react';
import {
  TextInput,
  Title,
  Stack,
  Flex,
  Grid,
  Pill,
  SimpleGrid,
  Pagination,
  Loader,
} from '@mantine/core';
import { useDebouncedValue, useInputState } from '@mantine/hooks';
import { productsApi } from 'resources/products';
import { orderApi } from 'resources/order';
import { generationPillsName, notify, handleError } from 'utils/index';
import { useQueryClient } from 'react-query';
import { ProductsListParams } from 'types/types';
import { Product, ProductOrder } from 'types';
import classes from './products.module.css';

const PER_PAGE = 9;

const schema = z.object({
  from: z.number().min(1, 'The maximum price value is 1000 000 $').max(1000000, 'The maximum price value is 1000 000 $').nullable(),
  to: z.number().min(1, 'The maximum price value is 1000 000 $').max(1000000, 'The maximum price value is 1000 000 $').nullable(),
});

const schemaSort = z.union([z.literal('asc'), z.literal('desc'), z.literal(null)]);

type PriceFilters = z.infer<typeof schema>;
type SortProps = z.infer<typeof schemaSort>;

const Products: NextPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useInputState('');
  const [sorting, setSorting] = useState<SortProps>(null);
  const [params, setParams] = useState<ProductsListParams>({});
  const [activePage, setActivePage] = useState<number>(1);
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const pills = generationPillsName(params);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    data: order,
  } = orderApi.useGetOrder('order');
  const orderProductsId = useMemo(() => {
    if (!order || !order?.products) {
      return [];
    }
    return order?.products?.map((item: ProductOrder) => item._id);
  }, [order]);

  const calculatePageNum = (): number => {
    const page = activePage > 1 ? 1 : activePage;
    setActivePage(page);
    return page;
  };

  const changePageNum = (value: number) => {
    setActivePage(value);
    setParams((prev) => ({
      ...prev,
      page: value,
    }));
  };

  const handleSort = () => {
    const value: SortProps = sorting === null
      ? 'asc'
      : sorting === 'desc'
        ? null
        : sorting === 'asc'
          ? 'desc'
          : null;
    setSorting(value);

    setParams((prev) => ({
      ...prev,
      page: calculatePageNum(),
      sort: value,
    }));
  };

  const handleFilter = (event: SyntheticEvent) => {
    const { name, value } = (event.target as HTMLInputElement);

    if (name) {
      setParams((prev) => ({
        ...prev,
        page: calculatePageNum(),
        price: {
          ...prev.price,
          [name]: value ? Number(value) : null,
        },
      }));
    }
  };

  const {
    mutate: create,
    isLoading: isCreateOrderLoading,
  } = orderApi.useCreateOrder();

  const createOrder = useCallback((product: Product) => {
    const body = {
      productId: product._id,
    };
    create(body, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['order']);
        notify('This product has been successfully added to your cart');
      },
      onError: (e: any) => handleError(e),
    });
  }, [queryClient, create]);

  useLayoutEffect(() => {
    setParams((prev) => ({ ...prev, page: 1, searchValue: debouncedSearch, perPage: PER_PAGE }));
  }, [debouncedSearch]);

  const {
    register,
    reset,
  } = useForm<PriceFilters>({ resolver: zodResolver(schema) });

  const resetForm = () => {
    reset();
    setParams((prev) => ({
      ...prev,
      page: calculatePageNum(),
      price: {
        from: null,
        to: null,
      },
    }));
  };

  const removePill = (key: string) => {
    setParams((prev) => ({
      ...prev,
      page: activePage > 1 ? 1 : activePage,
      [key]: key === 'searchValue' ? null : { from: null, to: null },
    }));
    if (key === 'price') {
      reset();
    } else if (key === 'searchValue') {
      setSearch('');
    }
  };

  const {
    data,
    isLoading: isListLoading,
    isRefetching,
  } = productsApi.useProducts(params);

  const loading = isCreateOrderLoading || isListLoading;

  return (
    <Grid
      className={classes.productWrapper}
      grow
    >
      <Grid.Col span={3} className={classes.filters}>
        <div className={classes.filterWrapper}>
          <Title order={3} className={classes.filterTitle}>
            Filters
            <button type="button" className={classes.filterTitle__resetButton} onClick={resetForm}>
              Reset All
              <IconX
                className={classes.xIcon}
              />
            </button>
          </Title>
          <Stack>
            <Title order={3}>Price</Title>
            <Flex
              justify="space-between"
              direction="row"
              className={classes.form}
            >
              <form
                className={classes.form}
              >
                <TextInput
                  {...register('from')}
                  leftSection={<span className={classes.inputMarker}>From: </span>}
                  classNames={{
                    section: classes.textInputFrom,
                    root: classes.rootInput,
                    input: classes.textInput,
                  }}
                  onChange={handleFilter}
                  type="number"
                />
                <TextInput
                  {...register('to')}
                  classNames={{
                    root: classes.rootInput,
                    input: classes.textInput,
                  }}
                  onChange={handleFilter}
                  leftSection={<span className={classes.inputMarker}>To: </span>}
                  type="number"
                />
              </form>
            </Flex>
          </Stack>
        </div>
      </Grid.Col>
      <Grid.Col span={9} className={classes.listProducts}>
        <div>
          <TextInput
            placeholder="Type to search..."
            leftSection={<IconSearch />}
            onChange={setSearch}
            value={search}
            ref={searchInputRef}
          />
        </div>
        <div className={classes.products__filterResult}>
          <Flex
            justify="space-between"
            py={15}
          >
            {
                data?.count
                  ? (
                    <span>
                      {data?.count}
                      &nbsp;
                      result
                      {
                        data?.count > 1
                          ? 's'
                          : ''
                      }
                    </span>
                  ) : null
              }
            <span
              role="button"
              tabIndex={0}
              onClick={() => handleSort()}
              onKeyDown={() => handleSort()}
              className={classes.products__filterSort}
            >
              <IconArrowsSort className={classes.arrowIcon} />
              Sort by newest
              <IconChevronDown
                className={classes.products__sortArrow}
                  /* eslint no-nested-ternary: 0 */
                style={
                  sorting === 'asc'
                    ? { marginLeft: 10, visibility: 'visible' }
                    : sorting === 'desc'
                      ? { marginLeft: 10, transform: 'rotate(180deg)', visibility: 'visible' }
                      : {}
                  }
              />
            </span>
          </Flex>
          <Flex style={{ minHeight: '30px', alignItems: 'center' }}>
            {pills.length ? (
              pills.map((item) => (
                <Pill
                  classNames={{
                    root: classes.products__pillRoot,
                    label: classes.products__pillLabel,
                  }}
                >
                  {item.value}
                  <IconPlaystationX
                    className={classes.playstationIcon}
                    onClick={() => removePill(item.key)}
                  />
                </Pill>
              ))
            )
              : null}
          </Flex>
        </div>
        <SimpleGrid cols={3} spacing="lg" verticalSpacing="lg" className={classes.products__list}>
          {
                data?.items.length
                  ? data.items.map((item: any) => (
                    <ProductCard
                      name={item.title}
                      price={item.price}
                      imageUrl={item.imageUrl}
                      addToCart={() => createOrder(item)}
                      productExistsСart={orderProductsId.includes(item._id)}
                    />
                  ))
                  : !data?.items.length && !isListLoading ? (
                    <InfoBlock
                      textHint={['Reset or change filters to display a complete list of products.']}
                      textTitle="No products matching the search criteria"
                      textButton={null}
                      imageUrl="/images/cardPage/balloon_empty_state.png"
                    />
                  ) : null
            }
        </SimpleGrid>
        { data?.totalPages && data?.totalPages > 1 ? (
          <div className={classes.products__pagination}>
            <Pagination
              total={data?.totalPages}
              value={activePage}
              onChange={(value) => changePageNum(value)}
            />
          </div>
        ) : null}
      </Grid.Col>
      {
        loading || isRefetching ? (
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

export default Products;
