import { AccountApi, AccountHttpContextSignOutRequest, BASE_PATH } from '../../../../openapi-generator';
import { Button, message } from 'antd';

import React from 'react';

/**
 * A button component used to sign out of the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function AccountLogoutButton(props: { redirect?: string }): JSX.Element {
  const { redirect } = props;

  const client: AccountApi = new AccountApi();

  /** The click event for this button. */
  function onClick(): void {
    const redirectUri: string = redirect || window.location.pathname;

    const requestParameters: AccountHttpContextSignOutRequest = {
      returnUrl: redirectUri,
    };

    client.accountHttpContextSignOut(requestParameters)
      .then(() => window.location.assign(redirectUri))
      .catch(() => message.error('an unexpected error occurred while attempting to sign out'));
  }

  return (
    <Button type="primary" onClick={onClick}>
      Sign Out
    </Button>
  );
}
