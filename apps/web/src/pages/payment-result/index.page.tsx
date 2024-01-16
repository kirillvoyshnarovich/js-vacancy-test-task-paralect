import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { InfoBlock } from 'components/index';
import { Flex } from '@mantine/core';

const PaymentResult: NextPage = () => {
  const router = useRouter();

  return (
    <Flex
      justify="center"
      align="center"
      pt="20"
    >
      {
        router.query.result === 'error' ? (
          <InfoBlock
            textHint={['Sorry, your payment failed.', 'Would you like to try again?']}
            textTitle="Payment Failed"
            textButton="Back to Cart"
            imageUrl="images/cardPage/failedPaymentIcon.svg"
            buttonLink="/cart"
          />
        ) : (
          <InfoBlock
            textHint={['Hooray, you have completed your payment!']}
            textTitle="Payment Successfull"
            textButton="Back to Cart"
            imageUrl="images/cardPage/successPaymentIcon.svg"
            buttonLink="/cart"
          />
        )
      }
    </Flex>
  );
};

export default PaymentResult;
