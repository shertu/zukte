import {
  ApplicationUser,
  ApplicationUserServiceApi,
  ApplicationUserServiceDeleteRequest,
} from '@zukte/api-client';
import {Button, IconButton} from '@material-ui/core';

import {DeleteForever} from '@material-ui/icons';
import React from 'react';
import {Rfc7807Alert} from '../../rfc-7807-alert/rfc-7807-alert';

/**
 * A list of the application users or accounts stored in the application.
 */
export function AccountListItem(props: {
  user: ApplicationUser;
  mineAccounts?: ApplicationUser[];
}) {
  const {mineAccounts = []} = props;
  const {id, name, picture} = props.user;

  const client = new ApplicationUserServiceApi();

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
      <Button variant="contained" startIcon={<DeleteForever />}>
        remove account
      </Button>
    );
  }

  return (
    <List.Item key={id} actions={[deleteApplicationUserAction]}>
      <List.Item.Meta
        avatar={<Avatar src={picture} />}
        title={name}
        description={<Text style={{fontFamily: 'monospace'}}>{id}</Text>}
      />

      {errorOccur && (
        <Rfc7807Alert title="The request to delete your account was unsuccessful." />
      )}
    </List.Item>
  );
}
