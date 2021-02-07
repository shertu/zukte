import {AccountGoogleOpenIdConnectChallengeRequest, BASE_PATH} from '../../../../openapi-generator';

import GoogleButton from 'react-google-button';
import React from 'react';

/**
 * A button component used to sign in to the application via the Google Auth API.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function GoogleSignInButton(props: {
  redirect?: string;
}): JSX.Element {
  const {redirect} = props;
  // const ACCOUNT_API: AccountApi = new AccountApi();

  /** The click event for this button. */
  function onClick(): void {
    const redirectUri: string = redirect || window.location.pathname;

    // ACCOUNT_API.accountGoogleOpenIdConnectChallenge();

    const requestParameters: AccountGoogleOpenIdConnectChallengeRequest = {
      returnUrl: redirectUri,
    };

    const searchParams: URLSearchParams = new URLSearchParams(
      requestParameters as URLSearchParams,
    );

    const authorizationCodeRequestUrl: string =
      BASE_PATH + '/api/Account/Login' + '?' + searchParams.toString();
    window.location.assign(authorizationCodeRequestUrl);
  }

  return <GoogleButton type="light" onClick={onClick} />;
}
