import { Stack, Flex } from '@nelson-ui/react';
import React from 'react';
import { AtomDevTools, Devtools } from './devtools';
import { Footer } from './footer';
import { Header } from './header';
import { SafeSuspense, Loading } from './safe-suspense';
import { Head } from './head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export const Layout: React.FC = ({ children }) => {
  return (
    <Flex minHeight="100vh" flexDirection="column">
      <ToastContainer pauseOnFocusLoss position="bottom-right" autoClose={5000} draggable={false} />
      <Head />
      <Header />
      <Devtools />
      <Stack justifyContent={'center'} alignItems={'center'} textAlign={'center'} flexGrow="1">
        <Stack
          maxWidth={'960px'}
          width="100%"
          textAlign="left"
          spacing="$base-loose"
          pt="25px"
          pb="50px"
          alignItems="center"
        >
          <SafeSuspense fallback={<Loading />}>{children}</SafeSuspense>
          {/* <AtomDevTools>
            <SafeSuspense fallback={<Loading />}>{children}</SafeSuspense>
          </AtomDevTools> */}
        </Stack>
      </Stack>
      <Footer />
    </Flex>
  );
};
