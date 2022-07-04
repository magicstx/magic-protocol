import React from 'react';
import type { AppProps } from 'next/app';
import 'modern-normalize/modern-normalize.css';
import '../public/fonts.css';
import '../public/nprogress.css';
import { useRouter } from 'next/router';
import nProgress from 'nprogress';
import { useEffect } from 'react';
import whyDidYouRender from '@welldone-software/why-did-you-render';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    router.events.on('routeChangeStart', () => nProgress.start());
    router.events.on('routeChangeComplete', () => nProgress.done());
    router.events.on('routeChangeError', () => nProgress.done());
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
