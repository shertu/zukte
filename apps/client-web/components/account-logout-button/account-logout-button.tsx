import {AccountApi, AccountHttpContextSignOutRequest} from '@zukte/api-client';

import {Button} from '@material-ui/core';
import React from 'react';
import config from '../../lib/zukte-api-client-configuration/zukte-api-client-configuration';
import {useWindow} from '../../custom-hooks/use-window';

export interface AccountLogoutButtonProps {
  redirectUri?: string;
}

/**
 * A button component used to sign out of
 * the application.
 */
export function AccountLogoutButton(props: AccountLogoutButtonProps) {
  const [href, setHref] = React.useState<string>();
  useWindow(w => {
    setHref(w.location.href);
  });

  const {redirectUri = href} = props;

  const client = new AccountApi(config);

  /** The click event for this button. */
  function onClick() {
    const requestParameters: AccountHttpContextSignOutRequest = {
      returnUrl: redirectUri,
    };

    client.accountHttpContextSignOut(requestParameters).then(() => {
      if (requestParameters.returnUrl) {
        window.location.assign(requestParameters.returnUrl);
      }
    });
  }

  return (
    <Button variant="contained" color="primary" onClick={onClick}>
      Sign Out
    </Button>
  );
}

export default AccountLogoutButton;
