import { ApplicationUser, ApplicationUserServiceApi, ApplicationUserServiceDeleteRequest } from '../../../../../openapi-generator';
import { Avatar, Button, List, Typography } from 'antd';

import React from 'react';
import { Rfc7807Alert } from '../../../../Rfc7807Alert/Rfc7807Alert';
import { UserDeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * A list of the application users or accounts stored in the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ListItem(props: {
  user: ApplicationUser;
  mineAccounts?: ApplicationUser[];
}): JSX.Element {
  const { mineAccounts = [] } = props;

  const { id, name, picture } = props.user;

  const client = new ApplicationUserServiceApi();

  const [errOccur, setErrOccur] =
    React.useState<boolean>(false);

  const isMineApplicationUser: boolean = Boolean(mineAccounts.find((elem) => elem.id && elem.id === id));

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
      .then(() => window.location.reload())
      .catch(() => setErrOccur(true));
  }

  let deleteApplicationUserAction: JSX.Element | undefined;
  if (isMineApplicationUser) {
    deleteApplicationUserAction = (
      <Button
        icon={<UserDeleteOutlined />}
        onClick={() => onDeleteApplicationUser(id)}
      >
        remove account
      </Button>
    );
  }

  return (
    <List.Item
      key={id}
      actions={[deleteApplicationUserAction]}
    >
      <List.Item.Meta
        avatar={<Avatar src={picture} />}
        title={name}
        description={
          <Text style={{ fontFamily: 'monospace' }}>{id}</Text>
        }
      />
      {errOccur &&
        <Rfc7807Alert
          title="The request to delete your account was unsuccessful."
        />
      }
    </List.Item>
  );
}
