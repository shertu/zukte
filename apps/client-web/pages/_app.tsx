import '../styles/global.scss';

import {StylesProvider, ThemeProvider} from '@material-ui/core/styles';

import {AppProps} from 'next/app';
import {ApplicationUser} from '@entail/api-client';
import {CssBaseline} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {EntailAppBar} from '../components/entail-app-bar/entail-app-bar';
import {EntailCreateAccountDialog} from '../components/entail-create-account-dialog/entail-create-account-dialog';
import {EntailSignInDialog} from '../components/entail-sign-in-dialog/entail-sign-in-dialog';
import EntailTheme from '../styles/entail-mui-theme';
import Head from 'next/head';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import NProgress from 'nprogress';
import React from 'react';
import Router from 'next/router';

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
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Layout id="app-layout">
        <Switch>
          <Route exact path={AppRouteCollection.Home}>
            <LandingScreen />
          </Route>

          <Route>
            <Header style={{backgroundColor: 'transparent'}}>
              <Space className="max-height" align="center">
                <LocationBreadcrumb />
              </Space>
            </Header>
          </Route>
        </Switch>

        <Content>
          <div id="content-viewport" className="max-cell-md">
            <AppContentSwitch />
          </div>
        </Content>

        <Footer>
          <Space className="max-height" align="center">
            <Link to={AppRouteCollection.PrivacyPolicy}>
              <Button type="link">Privacy Policy</Button>
            </Link>
          </Space>
        </Footer>
      </Layout>
    </MuiPickersUtilsProvider>
  );
}

export default CustomApp;
