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

import {Delete} from '@material-ui/icons';
import {IconButton} from '@material-ui/core';
import React from 'react';
import config from '../../../lib/zukte-api-client-configuration/zukte-api-client-configuration';
import {useRouter} from 'next/router';

export interface AccountListItemProps {
  account: ApplicationUser;
  mineAccounts?: ApplicationUser[];
}

/**
 * A list of the application users or accounts stored in the application.
 */
export function AccountListItem(props: AccountListItemProps) {
  const {mineAccounts = []} = props;
  const {id, name, picture} = props.account;

  const client = new ApplicationUserServiceApi(config);

  const router = useRouter();

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

    client.applicationUserServiceDelete(request).then(() => router.reload());
  }

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
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => onDeleteApplicationUser(id)}
          >
            <Delete />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}

export default AccountListItem;
