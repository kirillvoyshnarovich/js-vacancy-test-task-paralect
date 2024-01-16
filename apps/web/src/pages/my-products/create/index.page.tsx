import { NextPage } from 'next';
import { useState } from 'react';
import { Link } from 'components/index';
import {
  SimpleGrid,
  Image,
  Stack,
  TextInput,
  Button,
  Title,
  Flex,
  FileInput,
  Loader,
  Fieldset,
} from '@mantine/core';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from 'react-query';
import { handleError, notify } from 'utils';
import { productsApi } from 'resources/products';
import { IconChevronRight } from '@tabler/icons-react';
import { RoutePath } from 'routes';
import classes from './create-page.module.css';

const schema = z.object({
  title: z.string().nonempty('Title is a required field'),
  price: z.number().gt(0, 'Minimum price is 1 $').max(1000000, 'Max value for price 1 000 000 $'),
  file: z.any(),
});

type ProductParams = z.infer<typeof schema>;

const defaultImageSrc = '/images/createMyProductPage/coverForSpace.png';

const MyProducts: NextPage = () => {
  const queryClient = useQueryClient();
  const [fileImage, setFileImage] = useState<File | null>();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    reset: resetForm,
  } = useForm<ProductParams>({
    resolver: zodResolver(schema),
  });

  const {
    mutate: createProduct,
    isLoading: isUpdateLoading,
  } = productsApi.useCreateProduct<FormData>();

  const addFile = (file: File) => {
    setFileImage(file);
    clearErrors('file');
  };

  const onSubmit = (submitData: ProductParams) => {
    const body = new FormData();

    if (fileImage instanceof File) {
      const imageBlob = new Blob([fileImage], { type: fileImage.type });
      body.append('file', imageBlob, fileImage?.name);
    } else {
      setError('file', { type: 'manual', message: 'File is required' });
      return;
    }

    body.append('price', String(submitData.price));
    body.append('title', submitData.title as string);

    createProduct(body, {
      onSuccess: () => {
        queryClient.invalidateQueries(['products']);
        resetForm();
        setFileImage(null);
        notify('The product has been successfully created');
      },
      onError: (e: any) => handleError(e, setError),
    });
  };

  const imageUrl = fileImage instanceof File ? URL.createObjectURL(fileImage as File) : null;

  return (
    <>
      <div> </div>
      <SimpleGrid
        style={{ paddingTop: '20px' }}
        cols={2}
      >
        <Stack>
          <Title order={3}>Create new product</Title>
          <Flex
            align="center"
          >
            <div className={classes.imageFrame}>
              <Image
                src={imageUrl ?? defaultImageSrc}
                width="180px"
                height="auto"
                className={classes.image}
              />
            </div>
            <FileInput
              {...register('file')}
              placeholder="Upload Photo"
              pl="16px"
              onChange={(file: File) => {
                addFile(file);
              }}
              w={135}
              value={fileImage}
            />
          </Flex>
          <form
            onSubmit={handleSubmit(onSubmit)}
          >
            <Fieldset disabled={isUpdateLoading} variant="unstyled">
              <TextInput
                {...register('title')}
                label="Title of the product"
                placeholder="Enter title of the product..."
                pt={20}
                error={errors.title?.message}
              />
              <TextInput
                {...register('price', { valueAsNumber: true })}
                label="Price"
                placeholder="Enter title of the product..."
                pt={20}
                type="number"
                error={errors.price?.message}
              />
              <Button mt={28} className={classes.uploadButton} type="submit">Upload Product</Button>
            </Fieldset>
          </form>
        </Stack>
        <Stack>
          <Title order={4} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Link
              type="router"
              href={RoutePath.MyProduct}
              underline={false}
            >
              View my products
              <IconChevronRight />
            </Link>
          </Title>
        </Stack>
        {
          isUpdateLoading && (
            <Loader
              size={40}
              classNames={{
                root: classes.loader,
              }}
            />
          )
        }
      </SimpleGrid>
    </>
  );
};

export default MyProducts;
