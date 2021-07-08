import '../styles/global.scss';

import {
  AccountsContext,
  CreateAccountModalOpenContext,
  SignInModalOpenContext,
} from '@entail/business-logic';
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

/** https://nextjs.org/docs/advanced-features/custom-app. */
function CustomApp({Component, pageProps}: AppProps) {
  const [accounts, setAccounts] = React.useState<ApplicationUser[]>([]);
  const [openSignIn, setOpenSignIn] = React.useState<boolean>(false);
  const [openCreateAccount, setOpenCreateAccount] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    /** @todo replace with fetch to backend */
    fetch('/api/accounts')
      .then(response => response.json())
      .then(data => setAccounts(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={EntailTheme}>
        <CssBaseline />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <AccountsContext.Provider value={[accounts, setAccounts]}>
            <SignInModalOpenContext.Provider value={setOpenSignIn}>
              <CreateAccountModalOpenContext.Provider
                value={setOpenCreateAccount}
              >
                <Head>
                  <title>Welcome to entail-dev!</title>
                  <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/entail-logo.svg"
                  />
                </Head>
                <EntailAppBar />
                <main>
                  <Component {...pageProps} />

                  <EntailSignInDialog
                    open={openSignIn}
                    onClose={() => setOpenSignIn(false)}
                  />

                  <EntailCreateAccountDialog
                    open={openCreateAccount}
                    onClose={() => setOpenCreateAccount(false)}
                  />
                </main>
              </CreateAccountModalOpenContext.Provider>
            </SignInModalOpenContext.Provider>
          </AccountsContext.Provider>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </StylesProvider>
  );
}

export default CustomApp;
