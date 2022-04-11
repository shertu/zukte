import {AccountApi, AccountHttpContextSignOutRequest} from '@zukte/api-client';

import {Button} from '@mui/material';
import React from 'react';
import {ZUKTE_CONFIGURATION} from 'business';

export interface AccountLogoutButtonP {
  redirectUri?: string;
}

/**
 * A {@link Button} component used to sign out of the application.
 */
export function AccountLogoutButton(props: AccountLogoutButtonP) {
  /**
   * The click event for this button.
   */
  function onClick() {
    const requestParameters: AccountHttpContextSignOutRequest = {
      returnUrl: props.redirectUri ?? window.location.href,
    };

    new AccountApi(ZUKTE_CONFIGURATION)
      .accountHttpContextSignOut(requestParameters)
      .then(() => {
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
