import { Typography } from 'antd';

import { AppPage } from '../../AppPage/AppPage';
import { ApplicationUserList } from './ApplicationUserList/ApplicationUserList';
import { GoogleSignInButton } from './GoogleSignInButton/GoogleSignInButton';
import { SignOutButton } from './SignOutButton/SignOutButton';

const { Paragraph } = Typography;

/**
 * A demonstration where the user can sign in to the application.
 *
 * @return {JSX.Element}
 */
export function AuthenticationAtomicDemo(): JSX.Element {
  const mineApplicationUsers: boolean = false;

  return (
    <AppPage pageTitle="Authentication Demo">
      <div>
        <Typography className="max-cell-xs">
          <Paragraph>
            To use this demo service please sign in to Google and authorize this
            application to access your Google profile. The application will
            automatically create an account from the info in your Google
            profile. You can delete this account at anytime; this will not
            affect your Google profile.
          </Paragraph>
        </Typography>

        {mineApplicationUsers && <SignOutButton />}

        {!mineApplicationUsers && <GoogleSignInButton />}
      </div>

      <AppPage pageTitle="Accounts">
        <ApplicationUserList

        />
      </AppPage>
    </AppPage>
  );
}
