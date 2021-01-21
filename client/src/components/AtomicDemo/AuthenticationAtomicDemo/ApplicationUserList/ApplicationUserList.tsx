import {UserDeleteOutlined} from '@ant-design/icons';
import {Alert, Avatar, Button, List, Typography} from 'antd';
import * as React from 'react';
import { ApplicationUser, ApplicationUsersApi } from '../../../../openapi-generator';

const {Text} = Typography;

const APPLICATION_USERS_API: ApplicationUsersApi = new ApplicationUsersApi();

/**
 * A list of the application users or accounts stored in the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ApplicationUserList(props: {
  mineApplicationUser?: ApplicationUser;
  onRemoveMineApplicationUserHook?: () => void;
}): JSX.Element {
  const {mineApplicationUser, onRemoveMineApplicationUserHook} = props;

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

      if (mineApplicationUser) { // Move the user's application user or account to the start of the list.
        const filteredDataValue: ApplicationUser[] = filterApplicationUser(data, mineApplicationUser);
        newDataSortedValue = [mineApplicationUser, ...filteredDataValue];
      }

      setDataSorted(newDataSortedValue);
    }
  }, [data, mineApplicationUser]);

  /** Loads or reloads the content of this list. */
  function onLoadApplicationUsers(): void {
    APPLICATION_USERS_API.apiApplicationUsersGet()
        .then((res) => setData(res))
        .catch((err: Response) => setError(true));
  }

  /** The event called when the user's application user or account is removed from the list. */
  function onRemoveMineApplicationUser(): void {
    if (data && mineApplicationUser) {
      const filteredDataValue: ApplicationUser[] = filterApplicationUser(data, mineApplicationUser);
      setData(filteredDataValue);
    }

    if (onRemoveMineApplicationUserHook) {
      onRemoveMineApplicationUserHook();
    }
  }

  /**
   * Filters a specific application user from an array of application users.
   *
   * @param {ApplicationUser[]} collection
   * @param {ApplicationUser} applicationUser
   * @return {ApplicationUser[]}
   */
  function filterApplicationUser(collection: ApplicationUser[], applicationUser: ApplicationUser): ApplicationUser[] {
    return collection.filter((e: ApplicationUser) => e.id !== applicationUser.id);
  }

  return (
    <div>
      {error &&
        <Alert message="Error" description="An unexpected error occured while trying to load the accounts." type="error" showIcon />
      }

      {dataSorted &&
        <List
          dataSource={dataSorted}
          renderItem={(item: ApplicationUser) => {
            const {id, avatarUrl, name} = item;

            const isMineApplicationUser: boolean = mineApplicationUser ? id === mineApplicationUser.id : false;

            return (
              <List.Item
                key={id}
                actions={[
                  isMineApplicationUser ?
                    <Button icon={<UserDeleteOutlined />} onClick={onRemoveMineApplicationUser} >remove account</Button> : null,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={avatarUrl} />}
                  title={name}
                  description={<Text style={{fontFamily: 'monospace'}}>{id}</Text>}
                />
              </List.Item>
            );
          }}
        />
      }
    </div>
  );
}
