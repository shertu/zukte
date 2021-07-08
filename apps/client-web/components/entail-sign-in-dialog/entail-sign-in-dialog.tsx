import {
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Link,
  Typography,
} from '@material-ui/core';

import {EntailSignInForm} from './entail-sign-in-form/entail-sign-in-form';
import React from 'react';

export type EntailSignInDialogProps = DialogProps;

/** A container component for the the entail sign in form. */
export function EntailSignInDialog(props: EntailSignInDialogProps) {
  return (
    <Dialog {...props}>
      <DialogTitle>
        Log In
        <Typography>
          New to Entail?&nbsp;
          <Link href="https://en.wikipedia.org/wiki/Login">Sign up here!</Link>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <EntailSignInForm />

        <div className="flex items-center pb-3 text-gray-500">
          <div className="flex-1">
            <hr />
          </div>
          <div className="flex-2 px-3">or</div>
          <div className="flex-1">
            <hr />
          </div>
        </div>

        <div className="flex text-center space-x-4">
          <Button variant="contained">Telegram</Button>
          <Button variant="contained">Twitter</Button>
          <Button variant="contained">Apple</Button>
          <Button variant="contained">Google</Button>
          <Button variant="contained">Facebook</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EntailSignInDialog;
