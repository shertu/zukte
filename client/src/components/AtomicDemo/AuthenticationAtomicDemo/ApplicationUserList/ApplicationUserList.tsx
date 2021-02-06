import { UserDeleteOutlined } from '@ant-design/icons';
import { Avatar, Button, List, message, Skeleton, Typography } from 'antd';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ApplicationUser, ApplicationUserListResponse, ApplicationUserServiceApi, ApplicationUserServiceDeleteRequest, ApplicationUserServiceGetListRequest } from '../../../../openapi-generator';
import { PaginationContainer } from '../../../PaginationContainer/PaginationContainer';

const { Text } = Typography;

interface ApplicationUserListPageInfomation {
  itemArr: ApplicationUser[];
  nextPageToken?: string;
  hasMadeAtLeastOneFetch: boolean;
}

const DEFAULT_PAGE_SIZE: number = 30;

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
  const client = new ApplicationUserServiceApi();

  // assume the current response contains the page token for the last loaded page

  /** The known YouTube channels associated with the user. */
  const [pageInfomation, setPageInfomation] =
    useState<ApplicationUserListPageInfomation>({
      itemArr: [],
      hasMadeAtLeastOneFetch: false,
    });

  /** The current page index of the pagination. */
  const [paginationCurrent, setPaginationCurrent] =
    useState<number>(0);

  /** The current page size of the pagination. */
  const [paginationSize, setPaginationSize] =
    useState<number>(DEFAULT_PAGE_SIZE);

  const [onLoadMoreError, setOnLoadMoreError] =
    useState<boolean>(false);

  const { itemArr, nextPageToken, hasMadeAtLeastOneFetch } = pageInfomation;
  const itemCount = itemArr.length;
  const hasMore: boolean = Boolean(nextPageToken);
  const shouldLoadMore: boolean = itemCount < paginationCurrent * paginationSize;

  console.log("ApplicationUserList", {
    paginationCurrent: paginationCurrent,
    paginationSize: paginationSize,
    itemCount: itemCount,
    shouldLoadMore: shouldLoadMore,
    nextPageToken: nextPageToken,
    hasMadeAtLeastOneFetch: hasMadeAtLeastOneFetch,
    hasMore: hasMore,
  });

  /** Load items into the data collection until the length expectation is met or no additional item can be loaded. */
  useEffect(() => {
    if (shouldLoadMore && (hasMore || !hasMadeAtLeastOneFetch)) {
      onLoadMore();
    }
  }, [shouldLoadMore]);

  async function onLoadMore(): Promise<void> {
    // fetch the next page
    const request: ApplicationUserServiceGetListRequest = {
      maxResults: paginationSize || DEFAULT_PAGE_SIZE,
    };

    if (nextPageToken) {
      request.pageToken = nextPageToken;
    }

    try {
      const res: ApplicationUserListResponse = await client.applicationUserServiceGetList(request);
      const { items = [], nextPageToken: npt } = res;

      const newPageInformation: ApplicationUserListPageInfomation = {
        itemArr: itemArr.concat(items),
        nextPageToken: npt,
        hasMadeAtLeastOneFetch: true,
      }

      setPageInfomation(newPageInformation);
    } catch (error) {
      const checkError = Boolean(error);
      setOnLoadMoreError(checkError);
    }
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

  async function onExecuteDeleteUserAction(id: string | null | undefined): Promise<void> {
    // fetch the next page
    const request: ApplicationUserServiceDeleteRequest = {
      id: id,
    };

    try {
      await client.applicationUserServiceDelete(request);
    } catch (error) {
      message.error("delete user action failed")
    }
  }

  async function onClickReloadButton(): Promise<void> {
    setOnLoadMoreError(false);
    await onLoadMore();
  }

  return (
    <PaginationContainer
      className="max-cell"
      noItemsFetched={!itemCount && !hasMore}
      onLoadMoreError={onLoadMoreError}
      onClickReload={onClickReloadButton}
    >
      <InfiniteScroll
        dataLength={itemCount}
        next={() => onChangePagination(paginationCurrent + 1)}
        hasMore={hasMore || !hasMadeAtLeastOneFetch}
        loader={<Skeleton active />}
      >
        <List
          loading={(hasMore && shouldLoadMore) && !onLoadMoreError}
          dataSource={itemArr}
          renderItem={(item: ApplicationUser) => {
            const { id, name, picture } = item;

            const isMineApplicationUser: boolean = false;

            let deleteUserAction: JSX.Element | undefined;
            if (isMineApplicationUser) {
              deleteUserAction = (
                <Button icon={<UserDeleteOutlined />}
                  onClick={() => onExecuteDeleteUserAction(id)}
                >
                  remove account from {window.location.hostname}
                </Button>
              )
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
          }}
        />
      </InfiniteScroll>
    </PaginationContainer>
  );
}
