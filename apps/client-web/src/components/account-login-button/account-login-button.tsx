import {
  AccountGoogleOpenIdConnectChallengeRequest,
  BASE_PATH,
} from '@zukte/api-client';

import GoogleButton from 'react-google-button';
import React from 'react';

export interface AccountLoginButtonP {
  redirectUri?: string;
}

/**
 * A {@link GoogleButton} component used to sign in to
 * the application via the Google Auth API.
 */
export function AccountLoginButton(props: AccountLoginButtonP) {
  /**
   * The click event for this button.
   */
  function onClick() {
    const requestParameters: AccountGoogleOpenIdConnectChallengeRequest = {
      returnUrl: props.redirectUri ?? window.location.href,
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
