import {
  ApplicationUser,
  ApplicationUserServiceApi,
  ApplicationUserServiceDeleteRequest,
} from '@zukte/api-client';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@material-ui/core';
import {Button, IconButton} from '@material-ui/core';

import {Delete} from '@material-ui/icons';
import React from 'react';
import {Rfc7807Alert} from '../../rfc-7807-alert/rfc-7807-alert';
import config from '../../../lib/zukte-api-client-configuration/zukte-api-client-configuration';

/**
 * A list of the application users or accounts stored in the application.
 */
export function AccountListItem(props: {
  user: ApplicationUser;
  mineAccounts?: ApplicationUser[];
}) {
  const {mineAccounts = []} = props;
  const {id, name, picture} = props.user;

  const client = new ApplicationUserServiceApi(config);

  const [errorOccur, setErrorOccur] = React.useState<boolean>(false);

  const isMineApplicationUser = Boolean(
    mineAccounts.find(elem => elem.id && elem.id === id)
  );

  /**
   * Executes a simple request to delete an application user.
   */
  function onDeleteApplicationUser(id?: string | null) {
    const request: ApplicationUserServiceDeleteRequest = {
      id: id,
    };

    client
      .applicationUserServiceDelete(request)
      .then(() => window.location.reload())
      .catch(() => setErrorOccur(true));
  }

  let deleteApplicationUserAction: JSX.Element | undefined;
  if (isMineApplicationUser) {
    deleteApplicationUserAction = (
      <Button variant="contained" startIcon={<Delete />}>
        remove account
      </Button>
    );
  }

  // <List dense={dense}>

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src={picture ?? undefined} />
      </ListItemAvatar>
      <ListItemText
        primary={name}
        secondary={
          <Typography style={{fontFamily: 'monospace'}}>{id}</Typography>
        }
      />
      {isMineApplicationUser && (
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete">
            <Delete />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>

    //   {errorOccur && (
    //     <Rfc7807Alert title="The request to delete your account was unsuccessful." />
    //   )}
    // </div>
  );
}
