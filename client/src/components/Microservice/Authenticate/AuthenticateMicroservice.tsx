import {ApplicationUser, ApplicationUserServiceApi, ApplicationUserServiceGetListRequest} from '../../../openapi-generator';
import {IPageableListState, PageableListState} from '../../PageableList/PageableListState';
import {Space, Typography} from 'antd';

import {AccountList} from './AccountList/AccountList';
import {AccountLoginButton} from './AccountLoginButton/AccountLoginButton';
import {AccountLogoutButton} from './AccountLogoutButton/AccountLogoutButton';
import {AppPage} from '../../AppPage/AppPage';
import React from 'react';

const {Paragraph} = Typography;

/**
 * A demonstration where the user can sign in to the application.
 *
 * @return {JSX.Element}
 */
export function AuthenticateMicroservice(): JSX.Element {
  const client = new ApplicationUserServiceApi();

  const [mineAccounts, setMineAccounts] =
    React.useState<PageableListState<ApplicationUser>>(
        new PageableListState<ApplicationUser>());

  const [errorOccur, setErrorOccur] =
    React.useState<boolean>(false);

  const isPotentialForMore: boolean = mineAccounts.isPotentialForMore();

  /** An automatic trigger to fetch additional items. */
  React.useEffect(() => {
    if (isPotentialForMore && !errorOccur) {
      onFetchNextPageAsync(mineAccounts)
          .then((response) => setMineAccounts(response))
          .catch((err) => setErrorOccur(true));
    }
  }, [isPotentialForMore, errorOccur]);

  /**
   * Tigger to load the next page of data.
   *
   * @param {PageableListState<ApplicationUser>} current
   * @return {Promise<PageableListState<ApplicationUser>>}
   */
  async function onFetchNextPageAsync(
      current: PageableListState<ApplicationUser>,
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
    mineAccounts.length > 0 &&
    mineAccounts.state.hasMadeAtLeastOneFetch;

  return (
    <AppPage pageTitle="Authentication Demo">
      <Typography>
        <Paragraph>
          To use this demo service please sign in to Google and authorize this
          application to access your Google profile. The application will
          automatically create an account from the information in your Google
          profile. You can delete this account at anytime; this will not
          affect your Google profile.
        </Paragraph>
      </Typography>

      <Space className="max-cell-xs" style={{padding: '2em 24px'}}>
        {atLeastOneAccount && <AccountLogoutButton />}
        {!atLeastOneAccount && <AccountLoginButton />}
      </Space>

      <AppPage pageTitle="Accounts">
        <AccountList
          mineAccounts={mineAccounts.state.items}
        />
      </AppPage>
    </AppPage>
  );
}
