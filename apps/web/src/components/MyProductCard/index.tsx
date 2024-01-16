import { FC } from 'react';
import { Card, Image, Text, Group, Flex, Badge } from '@mantine/core';
import { formatePrice } from 'utils';
import classes from './MyProductCard.module.css';

interface ProductProps {
  name: string;
  price: number;
  imageUrl: string;
  badge: string;
  removeProduct: Function,
}
// Изменить тип !!!
interface TrashButtonProps {
  removeProduct: Function;
}

const TrashButton: FC<TrashButtonProps> = ({ removeProduct }) => (
  <Flex
    w="40"
    h="40"
    style={{
      position: 'absolute',
      top: '10px',
      right: '0px',
      cursor: 'pointer',
    }}
    onClick={() => removeProduct()}
  >
    <Image
      src="/images/myProductCard/trash-icon.svg"
      height={30}
      alt="Trash Icon"
    />
  </Flex>
);

const MyProductCard: FC<ProductProps> = ({ name, price, imageUrl, badge, removeProduct }) => (
  <Card shadow="sm" padding="sm" radius="md" withBorder className={classes.productCard}>
    <Card.Section
      className={classes.section}
    >
      <Image
        src={imageUrl}
        alt="My product Image"
        styles={{
          root: {
            minWidth: 'auto',
            minHeight: '100%',
            flexShrink: 0,
          } }}
      />
      <TrashButton removeProduct={removeProduct} />
      <Badge
        classNames={{
          root: classes.badge,
        }}
        style={
          badge === 'Sold'
            ? { color: '#17B26A', backgroundColor: '#E8F7F0' }
            : { color: '#F79009', backgroundColor: '#FEF4E6' }
        }
      >
        { badge === 'onSale' ? 'On Sale' : 'Sold' }
      </Badge>
    </Card.Section>
    <Group justify="space-between" mt="md" mb="xs">
      <Text size="lg" c="black" fw="700">{name}</Text>
    </Group>
    <Flex
      justify="space-between"
    >
      <span>Price: </span>
      <Text size="lg" c="black" fw="700">
        $
        {formatePrice(price)}
      </Text>
    </Flex>
  </Card>
);

export default MyProductCard;
