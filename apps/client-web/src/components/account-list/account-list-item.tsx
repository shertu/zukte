import {ApplicationUser, ApplicationUserServiceApi} from '@zukte/api-client';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemProps,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';

import {Delete} from '@mui/icons-material';
import {IconButton} from '@mui/material';
import {ListChildComponentProps} from 'react-window';
import React from 'react';
import {ZUKTE_CONFIGURATION} from 'business';
import {useRouter} from 'next/router';

export interface AccountListItemP extends ListItemProps {
  account: ApplicationUser;
  deleteSecondaryAction?: boolean;
}

/**
 * A {@link ListItem} view of an {@link ApplicationUser} with the option to delete it.
 */
export function AccountListItem(
  lccp: ListChildComponentProps<AccountListItemP[]>
) {
  /**
   * @see https://nextjs.org/docs/api-reference/next/router
   */
  const router = useRouter();

  const {index, style, data} = lccp;

  if (data.length === 0) {
    return null;
  }

  const props = data[index];
  const {account = {}, deleteSecondaryAction = false, ...other} = props;

  /**
   * Deletes the {@link ApplicationUser} and then reloads the page.
   */
  function onClickDeleteIcon() {
    new ApplicationUserServiceApi(ZUKTE_CONFIGURATION)
      .applicationUserServiceDelete({
        id: account.id,
      })
      .then(() => router.reload());
  }

  return (
    <ListItem
      key={index}
      style={style}
      disablePadding
      secondaryAction={
        deleteSecondaryAction && (
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={onClickDeleteIcon}
              size="large"
            >
              <Delete />
            </IconButton>
          </ListItemSecondaryAction>
        )
      }
      {...other}
    >
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src={account.picture ?? undefined} />
      </ListItemAvatar>
      <ListItemText
        primary={account.name}
        secondary={
          <Typography className="text-sm" fontFamily="monospace">
            {account.id}
          </Typography>
        }
      />
    </ListItem>
  );
}

export default AccountListItem;
