import { useCallback } from 'react';
import Head from 'next/head';
import router from 'next/router';
import { NextPage } from 'next';
import { Stack, Title, Text, Button } from '@mantine/core';

import { RoutePath } from 'routes';

const NoAuthorization: NextPage = () => {
  const handleClick = useCallback(() => {
    router.push(RoutePath.SignIn);
  }, []);

  return (
    <>
      <Head>
        <title>Not authorized</title>
      </Head>
      <Stack
        m="auto"
        w={328}
        h="100vh"
        justify="center"
        display="flex"
      >
        <Title order={2}>You are not authorized.</Title>

        <Text mx={0} mt={20} mb={24} c="gray.6">
          Complete the authorization and continue
          working with the application.
        </Text>

        <Button
          type="submit"
          onClick={handleClick}
        >
          Go to Sign In
        </Button>
      </Stack>
    </>
  );
};

export default NoAuthorization;
