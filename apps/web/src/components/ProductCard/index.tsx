import { FC } from 'react';
import { Card, Image, Text, Button, Group, Flex } from '@mantine/core';
import { formatePrice } from 'utils';
import classes from './ProductCard.module.css';

interface ProductProps {
  name: string;
  price: number;
  imageUrl: string;
  addToCart: Function,
  productExistsСart: boolean,
}

const ProductCard: FC<ProductProps> = ({ name, price, imageUrl, addToCart, productExistsСart }) => (
  <Card shadow="sm" padding="sm" radius="md" withBorder className={classes.productCard}>
    <Card.Section className={classes.section}>
      <Image
        src={imageUrl}
        alt="Product Image"
        classNames={{
          root: classes.image,
        }}
      />
    </Card.Section>
    <Group justify="space-between" mt="md" mb="xs">
      <Text fw={500}>{name}</Text>
    </Group>
    <Flex
      justify="space-between"
    >
      <span>Price: </span>
      <Text size="xl" c="black" fw={700}>
        $
        {formatePrice(price)}
      </Text>
    </Flex>
    <Button
      style={
        { backgroundColor: productExistsСart ? '#DCE4F5' : '#2c78eb' }
      }
      disabled={productExistsСart}
      color="blue"
      fullWidth
      mt="md"
      radius="md"
      onClick={() => addToCart()}
    >
      {productExistsСart ? 'Product in cart' : 'Add to Cart' }
    </Button>
  </Card>
);

export default ProductCard;
