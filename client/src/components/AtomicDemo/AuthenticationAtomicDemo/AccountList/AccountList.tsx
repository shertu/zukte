import { ApplicationUser, ApplicationUserListResponse, ApplicationUserServiceApi, ApplicationUserServiceDeleteRequest, ApplicationUserServiceGetListRequest } from '../../../../openapi-generator';
import { Avatar, Button, List, PaginationProps, Typography, message } from 'antd';
import { useEffect, useState } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';
import { PaginationContainer } from '../../../PaginationContainer/PaginationContainer';
import React from 'react';
import { UserDeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

/** The ongoing pagination response state information. */
interface AccountListMessageInfomation {
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
export function AccountList(
  // props: {
  // onChangeMineApplicationUserHook?: (user: ApplicationUser) => void;
  // }
): JSX.Element {
  // const {onChangeMineApplicationUserHook} = props;
  const client = new ApplicationUserServiceApi();

  const [messageInfomation, setMessageInfomation] =
    useState<AccountListMessageInfomation>({
      items: [],
      hasMadeAtLeastOneFetch: false,
    });

  const [paginationInfomation, setPaginationInfomation] =
    useState<PaginationProps>();

  const [onLoadMoreError, setOnLoadMoreError] =
    useState<boolean>(false);

  const {
    items: itemArr,
    nextPageToken,
    hasMadeAtLeastOneFetch,
  } = messageInfomation;

  const {
    current: paginationCurrent,
    size: paginationSize = DEFAULT_PAGE_SIZE,
  } = paginationInfomation;

  const itemCount =
    itemArr.length;
  const hasMore: boolean =
    Boolean(nextPageToken);
  const shouldLoadMore: boolean =
    itemCount < paginationCurrent * paginationSize;
  const potentialForMore: boolean =
    hasMore || !hasMadeAtLeastOneFetch;

  // console.log('ApplicationUserList', {
  //   itemCount: itemCount,
  //   nextPageToken: nextPageToken,
  //   hasMadeAtLeastOneFetch: hasMadeAtLeastOneFetch,
  //   paginationCurrent: paginationCurrent,
  //   paginationSize: paginationSize,
  //   onLoadMoreError: onLoadMoreError,
  //   hasMore: hasMore,
  //   shouldLoadMore: shouldLoadMore,
  // });

  /** Triggers the load additional items event. */
  useEffect(() => {
    if (shouldLoadMore && potentialForMore) {
      onLoadMore();
    }
  }, [shouldLoadMore, potentialForMore]);

  /** The event called to load additional items. */
  async function onLoadMore(): Promise<void> {
    // fetch the next page
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

      const newMessageInfomation: AccountListMessageInfomation = {
        items: itemArr.concat(additionalItems),
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
    const newPaginationInformation: PaginationInformation = {
      current: page,
      size: pageSize,
    };

    setPaginationInfomation(newPaginationInformation);
  }

  /**
   * Sends a request for the deletion of the specified accounts.
   *
   * @param {string} id
   */
  async function onDeleteApplicationUser(id: string): Promise<void> {
    // fetch the next page
    const request: ApplicationUserServiceDeleteRequest = {
      id: id,
    };

    try {
      await client.applicationUserServiceDelete(request);
    } catch (error) {
      message.error('delete user action failed');
    }
  }

  async function onClickReloadButton(): Promise<void> {
    setOnLoadMoreError(false);
    await onLoadMore();
  }

  return (
    <PaginationContainer
      className="max-cell"
      noItemsFetched={!itemCount && hasMadeAtLeastOneFetch}
      onLoadMoreError={onLoadMoreError}
      onClickReload={onClickReloadButton}
    >
      <InfiniteScroll
        dataLength={itemCount}
        next={() => onChangePagination(paginationCurrent + 1)}
        hasMore={potentialForMore}
        loader={null}
      >
        <List
          loading={potentialForMore && shouldLoadMore && !onLoadMoreError}
          dataSource={itemArr}
          renderItem={(item: ApplicationUser) => {
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
          }}
        />
      </InfiniteScroll>
    </PaginationContainer>
  );
}
