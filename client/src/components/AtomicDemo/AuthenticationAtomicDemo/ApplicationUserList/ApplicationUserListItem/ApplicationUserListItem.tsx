import { ApplicationUser, ApplicationUserServiceApi } from '../../../../../openapi-generator';
import { Avatar, Button, List, Typography } from 'antd';

import React from 'react';
import { UserDeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * A list of the application users or accounts stored in the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ApplicationUserListItem(props: {
  user: ApplicationUser;
}): JSX.Element {
  const { id, name, picture } = props.user;

  const client = new ApplicationUserServiceApi();

  /**
   * Executes a simple request to delete an application user.
   *
   * @param {string} id
   */
  function onDeleteApplicationUser(id?: string | null): void {
    const request: ApplicationUserServiceDeleteRequest = {
      id: id,
    };

    client.applicationUserServiceDelete(request)
      .catch((error) => message.error('operation failed'));
  }

  const isMineApplicationUser: boolean = false;

  let deleteUserAction: JSX.Element | undefined;
  if (isMineApplicationUser) {
    deleteUserAction = (
      <Button icon={<UserDeleteOutlined />}
        onClick={() => onDeleteApplicationUser(id)}
      >
        remove account from {window.location.hostname}
      </Button>
    );
  }

  const [errorOccurred, setErrorOccurred] =
    React.useState<boolean>(false);

  return (
    <List.Item
      key={id}
      actions={[deleteUserAction]}
    >
      <List.Item.Meta
        avatar={<Avatar src={picture} />}
        title={name}
        description={
          <Text style={{ fontFamily: 'monospace' }}>{id}</Text>
        }
      />

      {errorOccurred &&
        null
      }
    </List.Item>
  );
}
