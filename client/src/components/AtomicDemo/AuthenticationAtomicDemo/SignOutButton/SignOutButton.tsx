import {Button, message} from 'antd';
import * as React from 'react';
import { AuthApi } from '../../../../openapi-generator';

const AUTH_API: AuthApi = new AuthApi();

/**
 * A button component used to sign out of the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function SignOutButton(props: {
  redirect?: string;
}): JSX.Element {
  const {redirect} = props;

  /** The click event for this button. */
  function onClick(): void {
    const redirectUri: string = redirect || window.location.pathname;

    AUTH_API.apiAuthSignOutGet()
        .then(() => window.location.assign(redirectUri))
        .catch((err: Response) => message.error('An unexpected error occurred while trying to sign out of the application.'));
  }

  return (
    <Button type="primary" onClick={onClick}>Sign Out</Button>
  );
}
