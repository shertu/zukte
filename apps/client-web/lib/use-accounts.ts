import {AccountsContext, EntailAccountState} from '@entail/business-logic';

import React from 'react';
import Router from 'next/router';
import {useEffect} from 'react';

/** React hook to fetch user accounts and redirect if required. */
export function useAccounts(
  redirectTo?: string,
  redirectIfFound?: boolean
): EntailAccountState {
  const [accounts, setAccounts] = React.useContext(AccountsContext);

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !accounts) return;

    const isLoggedIn = !!accounts.length;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && isLoggedIn)
    ) {
      Router.push(redirectTo);
    }
  }, [accounts, redirectIfFound, redirectTo]);

  return [accounts, setAccounts];
}
