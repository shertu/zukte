import {message, Typography} from 'antd';
import * as React from 'react';
import {ApplicationUser, MineApplicationUserApi} from '../../../../generated-sources/openapi';
import {AppPage} from '../../AppPage/AppPage';
import {AutoColumnRow, AutoColumnRowGutterDefault} from '../../AutoColumnRow/AutoColumnRow';
import {ApplicationUserList} from './ApplicationUserList/ApplicationUserList';
import {GoogleSignInButton} from './GoogleSignInButton/GoogleSignInButton';
import {SignOutButton} from './SignOutButton/SignOutButton';

const {Paragraph} = Typography;

const MINE_APPLICATION_USER_API: MineApplicationUserApi = new MineApplicationUserApi();

/**
 * A demonstration where the user can sign in to the application.
 *
 * @return {JSX.Element}
 */
export function AuthenticationAtomicDemo(): JSX.Element {
  const [mineApplicationUser, setMineApplicationUser] = React.useState<ApplicationUser>(null);

  /** The initial data fetch. */
  React.useEffect(() => {
    onLoadMineApplicationUser();
  }, []);

  /** Fetches the user's application user account from the server. */
  function onLoadMineApplicationUser(): void {
    MINE_APPLICATION_USER_API.apiMineApplicationUserGet()
        .then((res: ApplicationUser) => setMineApplicationUser(res))
        .catch((err: Response) => {
          if (err.status != 401) {
            message.error('An unexpected error occured while trying to load your account.');
          }
        });
  }

  /** Deletes the user's application user account from the server. */
  function onDeleteMineApplicationUser(): void {
    MINE_APPLICATION_USER_API.apiMineApplicationUserDelete()
        .then((res: ApplicationUser) => setMineApplicationUser(null))
        .catch((err: Response) =>
          message.error('An unexpected error occured while trying to delete your account.'),
        );
  }

  return (
    <AppPage pageTitle="Authentication Demo">
      <AutoColumnRow align="middle" gutter={[AutoColumnRowGutterDefault, AutoColumnRowGutterDefault]}>
        <Typography className="max-cell-xs">
          <Paragraph>
            To use this demo service please sign in to Google and authorize this application to access your Google profile.
            The application will automatically create an account from the info in your Google profile.
            You can delete this account at anytime; this will not affect your Google profile.
          </Paragraph>
        </Typography>

        {mineApplicationUser &&
          <SignOutButton />
        }

        {!mineApplicationUser &&
          <GoogleSignInButton />
        }
      </AutoColumnRow>

      <AppPage pageTitle="Accounts">
        <ApplicationUserList
          mineApplicationUser={mineApplicationUser}
          onRemoveMineApplicationUserHook={onDeleteMineApplicationUser}
        />
      </AppPage>
    </AppPage>
  );
}
