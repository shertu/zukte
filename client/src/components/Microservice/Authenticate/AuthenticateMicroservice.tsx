import { ApplicationUser, ApplicationUserListResponse, ApplicationUserServiceApi, ApplicationUserServiceGetListRequest } from '../../../openapi-generator';
import { Space, Typography } from 'antd';

import { AccountList } from './AccountList/AccountList';
import { AccountLoginButton } from './AccountLoginButton/AccountLoginButton';
import { AccountLogoutButton } from './AccountLogoutButton/AccountLogoutButton';
import { AppPage } from '../../AppPage/AppPage';
import { PaginationResponseInformation } from '../../../utilities/PaginationResponseInformation';
import React from 'react';

const { Paragraph } = Typography;

/**
 * A demonstration where the user can sign in to the application.
 *
 * @return {JSX.Element}
 */
export function AuthenticateMicroservice(): JSX.Element {
  const client = new ApplicationUserServiceApi();

  const [mineAccountInformation, setMineAccountInformation] =
    React.useState<PaginationResponseInformation<ApplicationUser>>(
      new PaginationResponseInformation<ApplicationUser>());

  const [errorOccur, setErrorOccur] =
    React.useState<boolean>(false);

  // console.log('AuthenticationAtomicDemo', {
  //   mineAccountInformation: mineAccountInformation,
  //   errorOccur: errorOccur,
  // });

  const isPotentialForMore: boolean =
    mineAccountInformation.isPotentialForMore();

  /** An automatic trigger to fetch additional items. */
  React.useEffect(() => {
    if (isPotentialForMore && !errorOccur) {
      onFetchAdditionalInformation(mineAccountInformation)
        .then((response) => setMineAccountInformation(response))
        .catch((error) => setErrorOccur(true));
    }
  }, [isPotentialForMore, errorOccur]);

  /**
   * An event to fetch an additional page of items.
   * @param {PaginationResponseInformation<ApplicationUser>} current
   * @return {Promise<PaginationResponseInformation<ApplicationUser>>}
   */
  async function onFetchAdditionalInformation(
    current: PaginationResponseInformation<ApplicationUser>,
  ): Promise<PaginationResponseInformation<ApplicationUser>> {
    const request: ApplicationUserServiceGetListRequest = {
      mine: true,
    };

    if (current.nextPageToken) {
      request.pageToken = current.nextPageToken;
    }

    const response: ApplicationUserListResponse =
      await client.applicationUserServiceGetList(request);

    const additionalItems: ApplicationUser[] = response.items || [];

    const nextInformation: PaginationResponseInformation<ApplicationUser> =
      new PaginationResponseInformation<ApplicationUser>();

    nextInformation.items = current.items.concat(additionalItems);
    nextInformation.nextPageToken = response.nextPageToken;
    nextInformation.hasMadeAtLeastOneFetch = true;

    return nextInformation;
  }

  const atLeastOneAccount: boolean =
    mineAccountInformation.length > 0 &&
    mineAccountInformation.hasMadeAtLeastOneFetch;

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

      <Space className="max-cell-xs" style={{ padding: '2em 24px' }}>
        {atLeastOneAccount && <AccountLogoutButton />}
        {!atLeastOneAccount && <AccountLoginButton />}
      </Space>

      <AppPage pageTitle="Accounts">
        <AccountList
          mineAccounts={mineAccountInformation.items}
        />
      </AppPage>
    </AppPage>
  );
}
