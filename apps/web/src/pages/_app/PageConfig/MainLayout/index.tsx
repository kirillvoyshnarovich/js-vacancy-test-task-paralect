import { FC, ReactElement } from 'react';
import { AppShell } from '@mantine/core';

// import Header from './Header';
// import Footer from './Footer';
import Header from 'components/Header';

import classes from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactElement;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => (
  <AppShell
    header={{ height: 72 }}
    footer={{ height: 40 }}
    classNames={{
      root: classes.root,
      main: classes.main,
    }}
  >
    <Header />

    <AppShell.Main className={classes.appShell}>
      {children}
    </AppShell.Main>

    {/* <Footer /> */}
  </AppShell>
);

export default MainLayout;
