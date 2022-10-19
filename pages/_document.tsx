import React from 'react';
import type { DocumentContext } from 'next/document';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { darkMode, allCss } from '../common/theme';

export default class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await NextDocument.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style id="stitches" dangerouslySetInnerHTML={{ __html: allCss() }} />
        </>
      ),
    };
  }
  render() {
    return (
      <Html lang="en" className={darkMode}>
        <Head>
          <style id="stitches" dangerouslySetInnerHTML={{ __html: allCss() }} />
          <style
            dangerouslySetInnerHTML={{
              __html: `
            html.dark-mode {
              background-color: var(--colors-background);
            }
          `,
            }}
          ></style>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap"
            rel="stylesheet"
          />
          <link
            rel="preload"
            href="/fonts/OpenSauce/OpenSauceSans-Medium.ttf"
            as="font"
            crossOrigin=""
          />
          <meta property="og:image" content="/og-image.png" />
          <meta
            property="og:description"
            content="Magic is a protocol for atomic swaps between BTC and xBTC on the Stacks blockchain."
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
