import type { AppProps } from 'next/app';
import 'modern-normalize/modern-normalize.css';
import '../public/fonts.css';
import '../public/nprogress.css';
import { useRouter } from 'next/router';
import nProgress from 'nprogress';
import { useEffect } from 'react';

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
