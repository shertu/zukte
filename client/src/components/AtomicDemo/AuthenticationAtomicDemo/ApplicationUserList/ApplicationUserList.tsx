import { UserDeleteOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, List, Skeleton, Space, Typography } from 'antd';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  ApplicationUser,
  ApplicationUserListResponse,
  ApplicationUsersApi,
  ApplicationUsersGetApplicationUsersRequest,
} from '../../../../openapi-generator';

const { Text } = Typography;

const APPLICATION_USERS_API: ApplicationUsersApi = new ApplicationUsersApi();
const DEFAULT_PAGE_SIZE: number = 30;

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
  onChangeMineApplicationUserHook?: (user: ApplicationUser) => void;
}): JSX.Element {
  const { onChangeMineApplicationUserHook } = props;

  /** The known YouTube channels associated with the user. */
  const [mineYouTubeChannels, setMineYouTubeChannels] =
    React.useState<Array<ApplicationUser>>([]);

  /** The response from the latest item fetch. */
  const [currentResponse, setCurrentResponse] =
    React.useState<ApplicationUserListResponse | null>(null);

  /** The current page index of the pagination. */
  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(0);

  /** The current page size of the pagination. */
  const [paginationSize, setPaginationSize] =
    React.useState<number>(0);

  /** Has an error occured during a fetch op? */
  const [error, setError] =
    React.useState<boolean>(false);

  const dataLength: number = mineYouTubeChannels.length;
  const shouldLoadMore: boolean = dataLength < calculateWantedItemCount();
  const hasMore: boolean = canLoadMore(currentResponse);
  const shouldLoadMoreAndHasMore: boolean = shouldLoadMore && hasMore;

  console.log("MineYouTubeChannelRadioGroup State", mineYouTubeChannels, currentResponse, paginationCurrent, paginationSize, error);
  console.log("MineYouTubeChannelRadioGroup", dataLength, shouldLoadMore, hasMore, shouldLoadMoreAndHasMore);

  /** On fetching additional items, append the new items to the data collection. */
  React.useEffect(() => {
    if (currentResponse) {
      const { items } = currentResponse;
      if (items) {
        setMineYouTubeChannels(mineYouTubeChannels.concat(items));
      }
    }
  }, [currentResponse]);

  /** On the initial mount, load the first page. */
  React.useEffect(() => {
    onChangePagination(1, DEFAULT_PAGE_SIZE);
  }, []);

  /** Load items into the data collection until the length expectation is met or no additional item can be loaded. */
  React.useEffect(() => {
    if (shouldLoadMoreAndHasMore) {
      fetchNextPage(currentResponse)
        .then((res: ApplicationUserListResponse) => setCurrentResponse(res))
        .catch(() => setError(true));
    }
  }, [shouldLoadMoreAndHasMore, mineYouTubeChannels]);

  /**
  * Calculates the desired number of items in the item collection.
  *
  * @return {number}
  */
  function calculateWantedItemCount(): number {
    const a: number = paginationCurrent || 0;
    const b: number = paginationSize || 0;
    return a * b;
  }

  /**
   * Called when the page number is changed, and it takes the resulting page number and page size as its arguments.
   *
   * @param {number} page
   * @param {number} pageSize
   */
  function onChangePagination(page: number, pageSize?: number): void {
    pageSize = pageSize || DEFAULT_PAGE_SIZE;
    setPaginationCurrent(page);
    setPaginationSize(pageSize);
  }

  /**
   * Constructs a fetch op to get the next page of data for the specified response.
   *
   * @param {ApplicationUserListResponse} response
   * @param {number} maxResults
   * @return {Promise<ApplicationUserListResponse>}
   */
  async function fetchNextPage(response: ApplicationUserListResponse | null, maxResults?: number): Promise<ApplicationUserListResponse> {
    const request: ApplicationUsersGetApplicationUsersRequest = {
      mine: true,
      top: maxResults,
      //skip: dataLength,
      //pageToken: response?.nextPageToken,
    };

    return await APPLICATION_USERS_API.applicationUsersGetApplicationUsers(request);
  }

  /**
   * Checks if additional items can be loaded for the specified the response.
   *
   * @param {ApplicationUserListResponse} response
   * @return {boolean}
   */
  function canLoadMore(response: ApplicationUserListResponse | null): boolean {
    return response == null || !(response.nextPageToken === null || response.nextPageToken === '');
  }

  // /** Used to hook into the on change value event. */
  // React.useEffect(() => {
  //   const channel: Channel = findMineYouTubeChannelById(radioGroupValue);
  //   if (onChangeChannel) {
  //     onChangeChannel(channel);
  //   }
  // }, [radioGroupValue]);

  // /** Sorts the data in the list. */
  // React.useEffect(() => {
  //   if (data) {
  //     let newDataSortedValue: ApplicationUser[] = data;

  //     if (mineApplicationUsers) {
  //       // Move the user's application user or account to the start of the list.
  //       const filteredDataValue: ApplicationUser[] = filterApplicationUserListWithList(
  //         data,
  //         mineApplicationUsers,
  //       );
  //       newDataSortedValue = mineApplicationUsers.concat(filteredDataValue);
  //     }

  //     setDataSorted(newDataSortedValue);
  //   }
  // }, [data, mineApplicationUsers]);

  // /** The event called when the user's application user or account is removed from the list. */
  // function onRemoveMineApplicationUser(): void {
  //   if (data && mineApplicationUsers) {
  //     const filteredDataValue: ApplicationUser[] = filterApplicationUserListWithList(
  //       data,
  //       mineApplicationUsers,
  //     );
  //     setData(filteredDataValue);
  //   }

  //   if (onRemoveMineApplicationUserHook) {
  //     onRemoveMineApplicationUserHook();
  //   }
  // }

  return (
    <Space className="max-cell" direction="vertical">
      {error &&
        <Alert message="Error" description="Failed to load account information." type="error" showIcon />
      }

      {!dataLength && !hasMore &&
        <Alert message="Warning" description="No accounts are associated with this web application." type="warning" showIcon />
      }

      {!error &&
        <InfiniteScroll
          dataLength={dataLength}
          next={() => onChangePagination(paginationCurrent + 1)}
          hasMore={hasMore}
          loader={<Skeleton loading active />}
        >
          {mineYouTubeChannels &&
            <List
              dataSource={mineYouTubeChannels}
              renderItem={(item: ApplicationUser) => {
                const { id, avatar, name } = item;

                const isMineApplicationUser: boolean = false;

                return (
                  <List.Item
                    key={id}
                    actions={[
                      isMineApplicationUser ? (
                        <Button
                          icon={<UserDeleteOutlined />}
                          onClick={() => { }}
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
                        <Text style={{ fontFamily: 'monospace' }}>{id}</Text>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          }
        </InfiniteScroll>
      }
    </Space>
  );
}
