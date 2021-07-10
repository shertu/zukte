import {AccountApi, AccountHttpContextSignOutRequest} from '@zukte/api-client';
import {Button, Snackbar} from '@material-ui/core';

import React from 'react';

// import {Button, message} from 'antd';

const errorMessage =
  'an unexpected error occurred while attempting to sign out';

/**
 * A button component used to sign out of
 * the application.
 */
export function AccountLogoutButton(props: {redirect?: string}) {
  const {redirect} = props;

  const client = new AccountApi();

  const [open, setOpen] = React.useState(false);

  /**  */
  function handleClose(event?: React.SyntheticEvent, reason?: string) {
    setOpen(false);
  }

  /** The click event for this button. */
  function onClick() {
    const redirectUri: string = redirect || window.location.toString();

    const requestParameters: AccountHttpContextSignOutRequest = {
      redirectUrl: redirectUri,
    };

    client
      .accountHttpContextSignOut(requestParameters)
      .then(() => window.location.assign(redirectUri))
      .catch(() => setOpen(true));
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={onClick}>
        Sign Out
      </Button>
      {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        {errorMessage}
      </Snackbar> */}
    </>
  );
}
