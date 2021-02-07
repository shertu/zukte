import {ApplicationUser, ApplicationUserListResponse, ApplicationUserServiceApi, ApplicationUserServiceGetListRequest} from '../../../openapi-generator';
import {Space, Typography} from 'antd';

import {AppPage} from '../../AppPage/AppPage';
import {ApplicationUserList} from './ApplicationUserList/ApplicationUserList';
import {GoogleSignInButton} from './GoogleSignInButton/GoogleSignInButton';
import MineApplicationUserContext from './MineApplicationUserContext/MineApplicationUserContext';
import React from 'react';
import {SignOutButton} from './SignOutButton/SignOutButton';

const {Paragraph} = Typography;

/**
 * A demonstration where the user can sign in to the application.
 *
 * @return {JSX.Element}
 */
export function AuthenticationAtomicDemo(): JSX.Element {
  const client = new ApplicationUserServiceApi();

  const [mineApplicationUsers, setMineApplicationUsers] =
    React.useState<ApplicationUser[]>([]);

  const [onLoadMineApplicationUserError, setOnLoadMineApplicationUserError] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    if (!onLoadMineApplicationUserError) {
      onLoadMineApplicationUser();
    }
  }, [onLoadMineApplicationUserError]);

  async function onLoadMineApplicationUser(): Promise<void> {
    const request: ApplicationUserServiceGetListRequest = {
      mine: true,
      maxResults: 1, // can the user have more than one account?
    };

    try {
      const res: ApplicationUserListResponse =
        await client.applicationUserServiceGetList(request);

      setMineApplicationUsers(res.items || []);
    } catch (error) {
      setOnLoadMineApplicationUserError(Boolean(error));
    }
  }

  const isSignedIn: boolean = Boolean(mineApplicationUsers.length);

  return (
    <MineApplicationUserContext.Provider value={mineApplicationUsers}>
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
          {isSignedIn && <SignOutButton />}
          {!isSignedIn && <GoogleSignInButton />}
        </Space>

        <AppPage pageTitle="Accounts">
          <ApplicationUserList
            mineApplicationUsers={mineApplicationUsers}
          />
        </AppPage>
      </AppPage>
    </MineApplicationUserContext.Provider>
  );
}
