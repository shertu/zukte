import {
  AccountGoogleOpenIdConnectChallengeRequest,
  BASE_PATH,
} from '@zukte/api-client';

import GoogleButton from 'react-google-button';
import React from 'react';

/**
 * A button component used to sign in to
 * the application via the Google Auth API.
 */
export function AccountLoginButton(props: {redirect?: string}) {
  const {redirect} = props;

  /** The click event for this button. */
  function onClick() {
    const redirectUri: string = redirect || window.location.pathname;

    const requestParameters: AccountGoogleOpenIdConnectChallengeRequest = {
      returnUrl: redirectUri,
    };

    const searchParams: URLSearchParams = new URLSearchParams(
      requestParameters as URLSearchParams
    );

    const authorizationCodeRequestUrl: string =
      BASE_PATH + '/api/Account/Login' + '?' + searchParams.toString();

    window.location.assign(authorizationCodeRequestUrl);
  }

  return <GoogleButton type="light" onClick={onClick} />;
}
