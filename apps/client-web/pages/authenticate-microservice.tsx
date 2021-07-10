import {
  ApplicationUser,
  ApplicationUserServiceApi,
  ApplicationUserServiceGetListRequest,
} from '@zukte/api-client';

import {AccountList} from '../components/account-list/account-list';
import {AccountLoginButton} from '../components/account-login-button/account-login-button';
import {AccountLogoutButton} from '../components/account-logout-button/account-logout-button';
import {AppPage} from '../components/app-page/app-page';
import React from 'react';
import {Typography} from '@material-ui/core';

/**
 * A demonstration where the user can sign in to the application.
 */
export function AuthenticateMicroservice() {
  const client = new ApplicationUserServiceApi();

  const [mineAccounts, setMineAccounts] = React.useState<
    PageableListState<ApplicationUser>
  >(new PageableListState<ApplicationUser>());

  const [errorOccur, setErrorOccur] = React.useState<boolean>(false);

  const isPotentialForMore: boolean = mineAccounts.isPotentialForMore();

  /** An automatic trigger to fetch additional items. */
  React.useEffect(() => {
    if (isPotentialForMore && !errorOccur) {
      onFetchNextPageAsync(mineAccounts)
        .then(response => setMineAccounts(response))
        .catch(() => setErrorOccur(true));
    }
  }, [isPotentialForMore, errorOccur]);

  /**
   * Tigger to load the next page of data.
   */
  async function onFetchNextPageAsync(
    current: PageableListState<ApplicationUser>
  ) {
    const request: ApplicationUserServiceGetListRequest = {
      mine: true,
    };

    const nextPageToken = current.state.nextPageToken;
    if (nextPageToken) {
      request.pageToken = nextPageToken;
    }

    const response = await client.applicationUserServiceGetList(request);

    const currentItems: ApplicationUser[] = current.state.items || [];
    const additionalItems: ApplicationUser[] = response.items || [];

    const nextValue: IPageableListState<ApplicationUser> = {
      items: currentItems.concat(additionalItems),
      nextPageToken: response.nextPageToken,
      hasMadeAtLeastOneFetch: true,
    };

    return new PageableListState<ApplicationUser>(nextValue);
  }

  const atLeastOneAccount: boolean =
    mineAccounts.length > 0 && mineAccounts.state.hasMadeAtLeastOneFetch;

  return (
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
        <AccountList mineAccounts={mineAccounts.state.items} />
      </AppPage>
    </AppPage>
  );
}
