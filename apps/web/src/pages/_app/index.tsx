import { FC } from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { MantineProvider, Container } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/core/styles.css';
import queryClient from 'query-client';
import mainTheme from 'theme/main-theme';
import classes from './styles.module.css';
import PageConfig from './PageConfig';

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Ship</title>
    </Head>
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={mainTheme}
      >
        <Container fluid className={classes.container} size="1440px">
          <ModalsProvider>
            <Notifications autoClose={10000} className={classes.notification} />

            <PageConfig>
              <Component {...pageProps} />
            </PageConfig>
          </ModalsProvider>
          <ReactQueryDevtools position="bottom-right" />
        </Container>
      </MantineProvider>
    </QueryClientProvider>
  </>
);

export default App;
