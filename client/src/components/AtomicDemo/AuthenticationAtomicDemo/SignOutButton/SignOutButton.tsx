import { Button } from 'antd';

import { AccountHttpContextSignOutRequest, BASE_PATH } from '../../../../openapi-generator';

/**
 * A button component used to sign out of the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function SignOutButton(props: { redirect?: string }): JSX.Element {
  const { redirect } = props;

  // const ACCOUNT_API: AccountApi = new AccountApi();

  /** The click event for this button. */
  function onClick(): void {
    const redirectUri: string = redirect || window.location.pathname;
    // ACCOUNT_API.accountHttpContextSignOut();

    const requestParameters: AccountHttpContextSignOutRequest = {
      returnUrl: redirectUri,
    };

    const searchParams: URLSearchParams = new URLSearchParams(
      requestParameters as URLSearchParams,
    );

    const authorizationCodeRequestUrl: string =
      BASE_PATH + '/api/Account/Logout' + '?' + searchParams.toString();
    window.location.assign(authorizationCodeRequestUrl);
  }

  return (
    <Button type="primary" onClick={onClick}>
      Sign Out
    </Button>
  );
}
