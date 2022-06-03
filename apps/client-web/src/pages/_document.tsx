import {Head, Html, Main, NextScript} from 'next/document';

import React from 'react';

/**
 * https://nextjs.org/docs/advanced-features/custom-document
 */
export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
