import { Alert, Button, Typography, message } from 'antd';
import { ApplicationUser, ApplicationUserListResponse, ApplicationUserServiceApi, ApplicationUserServiceGetListRequest } from '../../../openapi-generator';

import { AppPage } from '../../AppPage/AppPage';
import { ApplicationUserList } from './ApplicationUserList/ApplicationUserList';
import { GoogleSignInButton } from './GoogleSignInButton/GoogleSignInButton';
import MineApplicationUserContext from './MineApplicationUserContext/MineApplicationUserContext';
import React from 'react';
import { SignOutButton } from './SignOutButton/SignOutButton';

const { Paragraph } = Typography;

/**
 * A demonstration where the user can sign in to the application.
 *
 * @return {JSX.Element}
 */
export function AuthenticationAtomicDemo(): JSX.Element {
  const client = new ApplicationUserServiceApi();

  const [mineApplicationUserArr, setMineApplicationUserArr] =
    React.useState<ApplicationUser[]>([]);

  const [onLoadMineApplicationUserError, setOnLoadMineApplicationUserError] =
    React.useState<boolean>(false)

  React.useEffect(() => {
    if (!onLoadMineApplicationUserError) {
      onLoadMineApplicationUser();
    }
  }, [onLoadMineApplicationUserError]);

  async function onLoadMineApplicationUser(): Promise<void> {
    const request: ApplicationUserServiceGetListRequest = {
      maxResults: 1,
    };

    try {
      const res: ApplicationUserListResponse =
        await client.applicationUserServiceGetList(request);

      setMineApplicationUserArr(res.items || []);
    } catch (error) {
      setOnLoadMineApplicationUserError(Boolean(error));
    }
  }

  function onClickRetry() {
    setOnLoadMineApplicationUserError(false);
  }

  const isSignedIn: boolean = Boolean(mineApplicationUserArr.length);

  return (
    <MineApplicationUserContext.Provider value={mineApplicationUserArr}>
      {onLoadMineApplicationUserError &&
        <Alert
          message="The request for your account data was not successful"
          type="error"
          action={
            <Button size="small" danger onClick={onClickRetry}>retry</Button>
          }
        />
      }

      <AppPage pageTitle="Authentication Demo">
        <Typography className="max-cell-xs">
          <Paragraph>
            To use this demo service please sign in to Google and authorize this
            application to access your Google profile. The application will
            automatically create an account from the information in your Google
            profile. You can delete this account at anytime; this will not
            affect your Google profile.
          </Paragraph>
        </Typography>

        <AppPage pageTitle="Actions">
          {isSignedIn && <SignOutButton />}
          {!isSignedIn && <GoogleSignInButton />}
        </AppPage>

        <AppPage pageTitle="Accounts">
          <ApplicationUserList />
        </AppPage>
      </AppPage>
    </MineApplicationUserContext.Provider>
  );
}
