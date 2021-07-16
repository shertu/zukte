import {
  AccountGoogleOpenIdConnectChallengeRequest,
  BASE_PATH,
} from '@zukte/api-client';

import GoogleButton from 'react-google-button';
import React from 'react';

export interface AccountLoginButtonProps {
  redirectUri?: string;
}

/**
 * A button component used to sign in to
 * the application via the Google Auth API.
 */
export function AccountLoginButton(props: AccountLoginButtonProps) {
  const {redirectUri = window.location.href} = props;

  /** The click event for this button. */
  function onClick() {
    const requestParameters: AccountGoogleOpenIdConnectChallengeRequest = {
      returnUrl: redirectUri,
    };

    const url = new URL('/api/Account/Login', BASE_PATH);

    if (requestParameters.returnUrl) {
      url.searchParams.append('returnUrl', requestParameters.returnUrl);
    }

    window.location.assign(url.href);
  }

  return <GoogleButton type="light" onClick={onClick} />;
}

export default AccountLoginButton;
