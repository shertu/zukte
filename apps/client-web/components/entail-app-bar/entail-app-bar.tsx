import {
  AppBar,
  AppBarProps,
  Avatar,
  Button,
  Container,
  IconButton,
  Toolbar,
} from '@material-ui/core';
import {BellIcon, PlusIcon, UserIcon} from '@iconicicons/react';
import {
  CreateAccountModalOpenContext,
  SignInModalOpenContext,
} from '@entail/business-logic';

import React from 'react';
import {useAccounts} from '../../lib/use-accounts';

export type EntailAppBarProps = AppBarProps;

/** The main header component for the entail application. */
export function EntailAppBar(props: EntailAppBarProps) {
  const setOpenSignIn = React.useContext(SignInModalOpenContext);
  const setOpenCreateAccount = React.useContext(CreateAccountModalOpenContext);

  const [accounts] = useAccounts();
  const isLoggedIn = !!accounts.length;

  return (
    <AppBar {...props} style={{backgroundColor: 'rgba(11, 11, 13, 0.5)'}}>
      <Container fixed>
        <Toolbar>
          {isLoggedIn ? (
            <>
              <div className="flex-grow flex justify-center">
                <IconButton color="inherit">
                  <img
                    src="/entail-logo.svg"
                    width="30"
                    height="34"
                    className="fill-current text-entail-yellow"
                  />
                </IconButton>
              </div>

              <IconButton color="inherit">
                <PlusIcon />
              </IconButton>
              <IconButton color="inherit">
                <BellIcon />
              </IconButton>
              <Button color="inherit">
                <Avatar variant="square">
                  <UserIcon />
                </Avatar>
              </Button>
            </>
          ) : (
            <>
              <div className="flex-grow flex justify-center">
                <img
                  src="/static/entail-logo-typography.svg"
                  width="115"
                  height="33"
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  className="bg-entail-cards-dark text-entail-text-dark"
                  variant="contained"
                  disableElevation
                  onClick={() => setOpenSignIn(true)}
                >
                  log in
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  disableElevation
                  onClick={() => setOpenCreateAccount(true)}
                >
                  sign up
                </Button>
              </div>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default EntailAppBar;
