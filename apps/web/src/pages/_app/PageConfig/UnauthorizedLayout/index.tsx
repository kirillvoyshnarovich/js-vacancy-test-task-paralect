import { FC, ReactElement } from 'react';

import { SimpleGrid, Image, Center } from '@mantine/core';

interface UnauthorizedLayoutProps {
  children: ReactElement;
}

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => (
  <SimpleGrid
    cols={{ base: 1, sm: 2 }}
    spacing="sm"
    h="100vh"
    style={{ maxWidth: '1440px', margin: '0 auto' }}
  >
    <Center px={32} w="100%" h="100vh" component="main">
      {children}
    </Center>
    <Image
      visibleFrom="sm"
      alt="App Info"
      src="/images/signInPage/signInBoard.png"
      p={32}
      h="100vh"
    />
  </SimpleGrid>
);

export default UnauthorizedLayout;
