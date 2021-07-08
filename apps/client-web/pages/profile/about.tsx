import React from 'react';
import {ToolbarOffset} from '../../components/toolbar-offset/toolbar-offset';
import {useAccounts} from '../../lib/use-accounts';

/** The user's about page. */
export function About() {
  // This hook will automatically redirect the user to the home page if no accounts are found.
  const [accounts] = useAccounts('/');

  const isLoggedIn = !!accounts.length;

  return (
    <>
      <ToolbarOffset />
      <h1>Your Entail accounts</h1>

      {!isLoggedIn && <p>You are not logged in!</p>}

      {accounts.map(account => (
        <p key={account.id}>
          {account.id}
          <img src={account.picture}></img>
        </p>
      ))}
    </>
  );
}

export default About;
