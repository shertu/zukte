import '../styles/global.scss';

import {Container, CssBaseline, Link} from '@material-ui/core';
import {StylesProvider, ThemeProvider} from '@material-ui/core/styles';

import {AppProps} from 'next/app';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import NProgress from 'nprogress';
import NextLink from 'next/link';
import React from 'react';
import Router from 'next/router';
import ZukteTheme from '../styles/zukte-mui-theme';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());
/**
 * A layout component used to describe general structure of
 * the application, e.g. main, header, footer, etc.
 *
 * https://nextjs.org/docs/advanced-features/custom-app.
 */
function CustomApp({Component, pageProps}: AppProps) {
  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={ZukteTheme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <CssBaseline />
          <div style={{backgroundColor: 'green'}}>
            <Component {...pageProps} />

            <footer style={{backgroundColor: 'blue'}}>
              <Container fixed>
                <NextLink href="/privacy-policy">
                  <Link>Privacy Policy</Link>
                </NextLink>
              </Container>
            </footer>
          </div>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </StylesProvider>
  );
}

export default CustomApp;
