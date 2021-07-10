import '../styles/global.scss';

import {Button, Container, CssBaseline} from '@material-ui/core';
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
          <div style={{backgroundColor: '#FFE7C7'}}>
            <Component {...pageProps} />

            <footer style={{backgroundColor: '#E1F8DC'}}>
              <Container fixed className="py-4">
                <NextLink href="/privacy-policy">
                  <Button variant="outlined">Privacy Policy</Button>
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
