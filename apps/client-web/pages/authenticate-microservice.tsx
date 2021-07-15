import {AccountList} from '../components/account-list/account-list';
import {AccountLoginButton} from '../components/account-login-button/account-login-button';
import {AccountLogoutButton} from '../components/account-logout-button/account-logout-button';
import {AppHeader} from '../components/app-header/app-header';
import {AppPage} from '../components/app-page/app-page';
import React from 'react';
import {Typography} from '@material-ui/core';
import {useMineAccounts} from '../custom-hooks/use-mine-accounts';

/**
 * A demonstration where the user can sign in to the application.
 */
export function AuthenticateMicroservice() {
  const mineAccounts = useMineAccounts();

  const atLeastOneAccount: boolean | undefined =
    (mineAccounts.items?.length ?? 0) > 0 &&
    mineAccounts.hasMadeAtLeastOneFetch;

  return (
    <>
      <AppHeader />
      <AppPage pageTitle="Authentication Demo">
        <Typography>
          To use this demo service please sign in to Google and authorize this
          application to access your Google profile. The application will
          automatically create an account from the information in your Google
          profile. You can delete this account at anytime; this will not affect
          your Google profile.
        </Typography>

        <div style={{padding: '2em 24px'}}>
          {atLeastOneAccount && <AccountLogoutButton />}
          {!atLeastOneAccount && <AccountLoginButton />}
        </div>

        <AppPage pageTitle="Accounts">
          <AccountList mineAccounts={mineAccounts.items} />
        </AppPage>
      </AppPage>
    </>
  );
}

export default AuthenticateMicroservice;
