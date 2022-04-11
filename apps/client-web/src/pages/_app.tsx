import 'tailwindcss/utilities.css';

import {Button, Container, CssBaseline} from '@mui/material';
import {ThemeProvider, StyledEngineProvider} from '@mui/material/styles';

import AppMuiTheme from 'styles/default-mui-theme';
import {AppProps} from 'next/app';
import Head from 'next/head';
import NProgress from 'nprogress';
import NextLink from 'next/link';
import React from 'react';
import Router from 'next/router';
import {useRouter} from 'next/router';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const PRIVACY_POLICY_PATH = '/privacy-policy/';

/**
 * A layout component used to describe general structure of
 * the application, e.g. main, header, footer, etc.
 *
 * https://nextjs.org/docs/advanced-features/custom-app.
 */
export default function CustomApp({Component, pageProps}: AppProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Jared Michael Blackman</title>

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={AppMuiTheme}>
          <CssBaseline />
          <Component {...pageProps} />

          <footer>
            <Container fixed className="py-4">
              {router.asPath !== PRIVACY_POLICY_PATH && (
                <NextLink href={PRIVACY_POLICY_PATH} passHref>
                  <Button variant="text">Privacy Policy</Button>
                </NextLink>
              )}
            </Container>
          </footer>
        </ThemeProvider>
      </StyledEngineProvider>
      {/* </StylesProvider> */}
    </>
  );
}
