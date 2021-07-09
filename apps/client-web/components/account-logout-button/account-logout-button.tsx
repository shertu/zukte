import {
  AccountApi,
  AccountHttpContextSignOutRequest,
} from '../../../../openapi-generator';
import {Button, message} from 'antd';

import React from 'react';

const errorMessage =
  'an unexpected error occurred while attempting to sign out';

/**
 * A button component used to sign out of
 * the application.
 */
export function AccountLogoutButton(props: {redirect?: string}): JSX.Element {
  const {redirect} = props;

  const client = new AccountApi();

  /** The click event for this button. */
  function onClick(): void {
    const redirectUri: string = redirect || window.location.pathname;

    const requestParameters: AccountHttpContextSignOutRequest = {
      returnUrl: redirectUri,
    };

    client
      .accountHttpContextSignOut(requestParameters)
      .then(() => window.location.assign(redirectUri))
      .catch(() => message.error(errorMessage));
  }

  return (
    <Button type="primary" onClick={onClick}>
      Sign Out
    </Button>
  );
}
