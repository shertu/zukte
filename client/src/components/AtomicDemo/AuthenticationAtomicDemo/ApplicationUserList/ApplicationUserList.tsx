import { ApplicationUser, ApplicationUserListResponse, ApplicationUserServiceApi, ApplicationUserServiceDeleteRequest, ApplicationUserServiceGetListRequest } from '../../../../openapi-generator';
import { Avatar, Button, List, ListProps, PaginationProps, SpaceProps, Typography, message } from 'antd';

import { InfiniteScrollPageList } from '../../../InfiniteScrollPageList/InfiniteScrollPageList';
import React from 'react';
import { UserDeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

/** The ongoing pagination response state information. */
interface MessageInfomation {
  items: ApplicationUser[];
  nextPageToken?: string;
  hasMadeAtLeastOneFetch: boolean;
}

/**
 * A list of the application users or accounts stored in the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ApplicationUserList(): JSX.Element {
  // const {onChangeMineApplicationUserHook} = props;
  const client = new ApplicationUserServiceApi();

  const [messageInfomation, setMessageInfomation] =
    React.useState<MessageInfomation>({
      items: [],
      hasMadeAtLeastOneFetch: false,
    });

  const [paginationInfomation, setPaginationInfomation] =
    React.useState<PaginationProps>({
      onChange: onChangePagination,
    });

  const [onLoadMoreError, setOnLoadMoreError] =
    React.useState<boolean>(false);

  const {
    items,
    nextPageToken,
    hasMadeAtLeastOneFetch,
  } = messageInfomation;

  const paginationCurrent: number = paginationInfomation?.current || paginationInfomation?.defaultCurrent || 0;
  const paginationSize: number = paginationInfomation?.pageSize || paginationInfomation?.defaultPageSize || 10;

  const hasMore: boolean = Boolean(nextPageToken);
  const shouldLoadMore: boolean = items.length < paginationCurrent * paginationSize;
  const potentialForMore: boolean = hasMore || !hasMadeAtLeastOneFetch;

  console.log('ApplicationUserList', {
    itemCount: items.length,
    nextPageToken: nextPageToken,
    hasMadeAtLeastOneFetch: hasMadeAtLeastOneFetch,
    paginationCurrent: paginationCurrent,
    paginationSize: paginationSize,
    onLoadMoreError: onLoadMoreError,
    hasMore: hasMore,
    shouldLoadMore: shouldLoadMore,
  });

  /** Triggers the load additional items event. */
  React.useEffect(() => {
    if (potentialForMore && shouldLoadMore && !onLoadMoreError) {
      onLoadMore();
    }
  }, [potentialForMore, shouldLoadMore, onLoadMoreError]);

  /** The event called to load additional items. */
  async function onLoadMore(): Promise<void> {
    const request: ApplicationUserServiceGetListRequest = {
      maxResults: paginationSize,
    };

    if (nextPageToken) {
      request.pageToken = nextPageToken;
    }

    try {
      const res: ApplicationUserListResponse =
        await client.applicationUserServiceGetList(request);

      const {
        items: additionalItems = [],
        nextPageToken: responseNextPageToken,
      } = res;

      const newMessageInfomation: MessageInfomation = {
        items: items.concat(additionalItems),
        nextPageToken: responseNextPageToken,
        hasMadeAtLeastOneFetch: true,
      };

      setMessageInfomation(newMessageInfomation);
    } catch (error) {
      const checkError = Boolean(error);
      setOnLoadMoreError(checkError);
    }
  }

  /**
   * Called when the page number is changed, and it takes
   * the resulting page number and page size as its arguments.
   *
   * @param {number} page
   * @param {number} pageSize
   */
  function onChangePagination(page: number, pageSize?: number): void {
    const newPaginationInformation: PaginationProps = {
      ...paginationInfomation,
      current: page,
      pageSize: pageSize,
    };

    setPaginationInfomation(newPaginationInformation);
  }

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
      .catch((error) => message.error('delete user action failed'));
  }

  function onClickReloadButton(): void {
    setOnLoadMoreError(false);
    //onLoadMore();
  }

  function renderApplicationUserItem(item: ApplicationUser, index: number): React.ReactNode {
    const { id, name, picture } = item;

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
      </List.Item>
    );
  }

  const spaceProps: SpaceProps = {
    className: 'max-cell',
  };

  const listProps: ListProps<ApplicationUser> = {
    dataSource: items,
    renderItem: renderApplicationUserItem,
  };

  return (
    <InfiniteScrollPageList
      spaceProps={spaceProps}
      itemCount={items.length}
      hasMadeAtLeastOneFetch={hasMadeAtLeastOneFetch}
      onLoadMoreErrorOccur={onLoadMoreError}
      onClickRetry={onClickReloadButton}
      paginationProps={paginationInfomation}
      nextPageToken={nextPageToken}
      listProps={listProps}
    />
  );
}
