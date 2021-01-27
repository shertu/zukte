import {UserDeleteOutlined} from '@ant-design/icons';
import {Alert, Avatar, Button, List, Typography} from 'antd';
import * as React from 'react';
import {
  ApplicationUser,
  ApplicationUsersApi,
} from '../../../../openapi-generator';

const {Text} = Typography;

const APPLICATION_USERS_API: ApplicationUsersApi = new ApplicationUsersApi();

export function filterApplicationUserListWithList(a: ApplicationUser[], b: ApplicationUser[]): ApplicationUser[] {
  return a.filter((aE) => b.find((bE) => bE.id === aE.id));
}

/**
 * A list of the application users or accounts stored in the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ApplicationUserList(props: {
  mineApplicationUsers?: ApplicationUser[];
  onRemoveMineApplicationUserHook?: () => void;
}): JSX.Element {
  const {mineApplicationUsers, onRemoveMineApplicationUserHook} = props;

  const [data, setData] = React.useState<ApplicationUser[]>([]);

  const [dataSorted, setDataSorted] = React.useState<ApplicationUser[]>([]);

  const [error, setError] = React.useState<boolean>(false);

  /** The initial data fetch. */
  React.useEffect(() => {
    onLoadApplicationUsers();
  }, []);

  /** Sorts the data in the list. */
  React.useEffect(() => {
    if (data) {
      let newDataSortedValue: ApplicationUser[] = data;

      if (mineApplicationUsers) {
        // Move the user's application user or account to the start of the list.
        const filteredDataValue: ApplicationUser[] = filterApplicationUserListWithList(
            data,
            mineApplicationUsers,
        );
        newDataSortedValue = mineApplicationUsers.concat(filteredDataValue);
      }

      setDataSorted(newDataSortedValue);
    }
  }, [data, mineApplicationUsers]);

  /** Loads or reloads the content of this list. */
  function onLoadApplicationUsers(): void {
    APPLICATION_USERS_API.applicationUsersGetApplicationUsers({

    })
        .then((res) => setData(res.items))
        .catch((err: Response) => setError(true));
  }

  /** The event called when the user's application user or account is removed from the list. */
  function onRemoveMineApplicationUser(): void {
    if (data && mineApplicationUsers) {
      const filteredDataValue: ApplicationUser[] = filterApplicationUserListWithList(
          data,
          mineApplicationUsers,
      );
      setData(filteredDataValue);
    }

    if (onRemoveMineApplicationUserHook) {
      onRemoveMineApplicationUserHook();
    }
  }

  return (
    <div>
      {error && (
        <Alert
          message="Error"
          description="An unexpected error occured while trying to load the accounts."
          type="error"
          showIcon
        />
      )}

      {dataSorted && (
        <List
          dataSource={dataSorted}
          renderItem={(item: ApplicationUser) => {
            const {id, avatar, name} = item;

            const isMineApplicationUser: boolean = Boolean(mineApplicationUsers?.find((elem) => elem.id === id));

            return (
              <List.Item
                key={id}
                actions={[
                  isMineApplicationUser ? (
                    <Button
                      icon={<UserDeleteOutlined />}
                      onClick={onRemoveMineApplicationUser}
                    >
                      remove account
                    </Button>
                  ) : null,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={avatar} />}
                  title={name}
                  description={
                    <Text style={{fontFamily: 'monospace'}}>{id}</Text>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );
}
