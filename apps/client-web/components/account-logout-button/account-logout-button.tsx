import {AccountApi, AccountHttpContextSignOutRequest} from '@zukte/api-client';

import {Button} from '@material-ui/core';
import React from 'react';
import config from '../../lib/zukte-api-client-configuration/zukte-api-client-configuration';

/**
 * A button component used to sign out of
 * the application.
 */
export function AccountLogoutButton(props: {redirect?: string}) {
  const {redirect} = props;

  const client = new AccountApi(config);

  // const [open, setOpen] = React.useState(false);

  /** The click event for this button. */
  function onClick() {
    const redirectUri: string = redirect || window.location.toString();

    const requestParameters: AccountHttpContextSignOutRequest = {
      returnUrl: redirectUri,
    };

    client
      .accountHttpContextSignOut(requestParameters)
      .then(() => window.location.assign(redirectUri));
    // .catch(() => setOpen(true));
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={onClick}>
        Sign Out
      </Button>
      {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        an unexpected error occurred while attempting to sign out
      </Snackbar> */}
    </>
  );
}
