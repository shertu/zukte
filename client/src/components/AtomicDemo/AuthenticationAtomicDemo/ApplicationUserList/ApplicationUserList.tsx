import { UserDeleteOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, List, Skeleton, Space, Typography } from 'antd';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ApplicationUser } from '../../../../grpc/application_user_pb';
import { ApplicationUserListRequest } from '../../../../grpc/application_user_list_request_pb';
import { ApplicationUserServiceClient } from '../../../../grpc/Application_user_serviceServiceClientPb';

const { Text } = Typography;

const DEFAULT_PAGE_SIZE: number = 30;

// export function filterApplicationUserListWithList(a: ApplicationUser[], b: ApplicationUser[]): ApplicationUser[] {
//   return a.filter((aE) => b.find((bE) => bE.id === aE.id));
// }

/**
 * A list of the application users or accounts stored in the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ApplicationUserList(props: {
  onChangeMineApplicationUserHook?: (user: ApplicationUser) => void;
}): JSX.Element {
  // const client = new ApplicationUserServiceClient(window.location.origin);
  const client = new ApplicationUserServiceClient("http://localhost:5000");

  const { onChangeMineApplicationUserHook } = props;

  /** The known YouTube channels associated with the user. */
  const [itemArr, setItemArr] =
    React.useState<ApplicationUser[]>([]);

  /** The response from the latest item fetch. */
  const [currentResponse, setCurrentResponse] =
    React.useState<ApplicationUserListRequest.ApplicationUserListResponse | null>(null);

  /** The current page index of the pagination. */
  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(0);

  /** The current page size of the pagination. */
  const [paginationSize, setPaginationSize] =
    React.useState<number>(0);

  /** Has an error occured during a fetch op? */
  const [error, setError] =
    React.useState<boolean>(false);

  const shouldLoadMore: boolean = itemArr.length < paginationCurrent * paginationSize;
  const canLoadMore: boolean = determineWhetherCanLoadMore(currentResponse);

  console.log("ApplicationUserList", {
    itemArr: itemArr,
    currentResponse: currentResponse,
    paginationCurrent: paginationCurrent,
    paginationSize: paginationSize,
    error: error,
    shouldLoadMore: shouldLoadMore,
    canLoadMore: canLoadMore,
  });

  /** On fetching additional items, append the new items to the data collection. */
  React.useEffect(() => {
    if (currentResponse == null) {
      return;
    }

    const additionalItems = currentResponse.getItemsList();
    setItemArr(itemArr.concat(additionalItems));
  }, [currentResponse]);

  /** On the initial mount, load the first page. */
  // React.useEffect(() => {
  //   onChangePagination(1, DEFAULT_PAGE_SIZE);
  // }, []);

  /** Load items into the data collection until the length expectation is met or no additional item can be loaded. */
  React.useEffect(() => {
    if (shouldLoadMore && canLoadMore) {
      // fetch the next page
      var request: ApplicationUserListRequest = new ApplicationUserListRequest();
      request.setMaxResults(paginationSize || DEFAULT_PAGE_SIZE)

      client.getList(request, null, (err, res) => {
        setError(Boolean(err));
        setCurrentResponse(res);
      });
    }
  }, [shouldLoadMore, canLoadMore, itemArr]);

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
   * Checks if additional items can be loaded for the specified the response.
   *
   * @param {ApplicationUserListRequest.ApplicationUserListResponse} res
   * @return {boolean}
   */
  function determineWhetherCanLoadMore(res: ApplicationUserListRequest.ApplicationUserListResponse | null): boolean {
    if (res == null) {
      return true;
    } else {
      const nextPageToken = res.getNextPageToken();
      return !(nextPageToken);
    }
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
        <Alert message="ApplicationUserList: Fetch Error" type="error" showIcon />
      }

      {!itemArr.length && !canLoadMore &&
        <Alert message="Warning" description="No accounts are associated with this web application." type="warning" showIcon />
      }

      {!error &&
        <InfiniteScroll
          dataLength={itemArr.length}
          next={() => onChangePagination(paginationCurrent + 1)}
          hasMore={canLoadMore}
          loader={<Skeleton loading active />}
        >
          {itemArr &&
            <List
              dataSource={itemArr}
              renderItem={(item: ApplicationUser) => {
                const isMineApplicationUser: boolean = false;

                return (
                  <List.Item
                    key={item.getId()}
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
                      avatar={<Avatar src={item.getPicture()} />}
                      title={item.getName()}
                      description={
                        <Text style={{ fontFamily: 'monospace' }}>{item.getId()}</Text>
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
