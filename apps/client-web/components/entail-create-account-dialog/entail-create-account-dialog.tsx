import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Link,
  Typography,
} from '@material-ui/core';

import {EntailCreateAccountForm} from './entail-create-account-form/entail-create-account-form';
import React from 'react';

export type EntailCreateAccountDialogProps = DialogProps;

/** A container component for the the entail create account form. */
export function EntailCreateAccountDialog(
  props: EntailCreateAccountDialogProps
) {
  return (
    <Dialog {...props}>
      <DialogTitle>
        Sign Up
        <Typography>
          Already have an account?&nbsp;
          <Link href="https://en.wikipedia.org/wiki/Login">Log in</Link>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <EntailCreateAccountForm />
      </DialogContent>
    </Dialog>
  );
}

export default EntailCreateAccountDialog;
