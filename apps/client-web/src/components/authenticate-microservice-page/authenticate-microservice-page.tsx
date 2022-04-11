import {
  AccountList,
  AccountLoginButton,
  AccountLogoutButton,
  AppPage,
} from 'components';
import {Divider, Typography} from '@mui/material';

import React from 'react';
import {ApplicationUser} from '@zukte/api-client';
import {useMineAccounts} from 'hooks';

/**
 * An {@link AppPage} where the user can upload and share images with others.
 */
export function AuthenticateMicroservicePage() {
  const accounts: ApplicationUser[] = useMineAccounts();
  const alphaF: boolean = accounts.length > 0;

  return (
    <AppPage>
      <Typography>
        To use this service please sign in to Google and authorize this
        application to access your Google profile. The application will
        automatically create an account from the information in your Google
        profile. You can delete this account at anytime; this will not affect
        your Google profile.
      </Typography>

      <div className="p-5">
        {alphaF ? <AccountLogoutButton /> : <AccountLoginButton />}
      </div>

      <Divider className="my-5" />

      <Typography variant="h4" component="h2">
        Accounts
      </Typography>

      <AccountList mine={accounts} />
    </AppPage>
  );
}

export default AuthenticateMicroservicePage;
