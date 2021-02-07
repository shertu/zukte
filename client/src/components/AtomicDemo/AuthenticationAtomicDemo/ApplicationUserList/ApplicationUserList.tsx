import { ApplicationUser, ApplicationUserListResponse, ApplicationUserServiceApi, ApplicationUserServiceGetListRequest } from '../../../../openapi-generator';

import { ApplicationUserListItem } from './ApplicationUserListItem/ApplicationUserListItem';
import { InfiniteScrollPageList } from '../../../InfiniteScrollPageList/InfiniteScrollPageList';
import { ListProps } from 'antd';
import React from 'react';
import { Rfc7807Props } from '../../../Rfc7807Alert/Rfc7807Alert';

/** The ongoing pagination response state information. */
interface MessageInfomation {
  items: ApplicationUser[];
  nextPageToken?: string;
  hasMadeAtLeastOneFetch: boolean;
}

const APPLICATION_USER_LIST_PAGE_SIZE: number = 30;

/**
 * A list of the application users or accounts stored in the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ApplicationUserList(props: {
  mineApplicationUsers?: ApplicationUser[];
}): JSX.Element {
  const { mineApplicationUsers } = props;

  const client = new ApplicationUserServiceApi();

  window.scrollTo(window.scrollX, window.scrollY - 1);

  const [messageInfomation, setMessageInfomation] =
    React.useState<MessageInfomation>({
      items: [],
      hasMadeAtLeastOneFetch: false,
    });

  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(1);

  const [onLoadMoreError, setOnLoadMoreError] =
    React.useState<boolean>(false);

  const {
    nextPageToken,
    hasMadeAtLeastOneFetch,
  } = messageInfomation;

  // this should be set using state mutations but it works for now
  let itemsUsed: ApplicationUser[] | undefined;
  if (mineApplicationUsers?.length) {
    const filteredForMine: ApplicationUser[] = messageInfomation.items
      .filter((a) => !mineApplicationUsers.find((b) => b.id === a.id));
    itemsUsed = mineApplicationUsers.concat(filteredForMine);
  } else {
    itemsUsed = messageInfomation.items;
  }

  const itemCount = itemsUsed?.length || 0;
  const hasMore: boolean = Boolean(nextPageToken);
  const shouldLoadMore: boolean = itemCount < paginationCurrent * APPLICATION_USER_LIST_PAGE_SIZE;
  const potentialForMore: boolean = hasMore || !hasMadeAtLeastOneFetch;

  // console.log('ApplicationUserList', {
  //   itemCount: itemCount,
  //   hasMore: hasMore,
  //   shouldLoadMore: shouldLoadMore,
  //   potentialForMore: potentialForMore,
  //   onLoadMoreError: onLoadMoreError,
  // });

  /** an automatic trigger for onLoadMore event. */
  React.useEffect(() => {
    if (potentialForMore && shouldLoadMore && !onLoadMoreError) {
      onLoadMore();
    }
  }, [potentialForMore, shouldLoadMore, onLoadMoreError]);

  /** an event which will attempt to load additional items */
  async function onLoadMore(): Promise<void> {
    const request: ApplicationUserServiceGetListRequest = {
      maxResults: APPLICATION_USER_LIST_PAGE_SIZE,
    };

    if (nextPageToken) {
      request.pageToken = nextPageToken;
    }

    try {
      const response: ApplicationUserListResponse =
        await client.applicationUserServiceGetList(request);

      const additionalItems: ApplicationUser[] = response.items || [];

      const newMessageInfomation: MessageInfomation = {
        items: messageInfomation.items.concat(additionalItems),
        nextPageToken: response.nextPageToken,
        hasMadeAtLeastOneFetch: true,
      };

      setMessageInfomation(newMessageInfomation);
    } catch (error) {
      setOnLoadMoreError(Boolean(error));
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
    setPaginationCurrent(page);
  }

  function onClickRetry(): void {
    setOnLoadMoreError(false);
  }

  const listProps: ListProps<ApplicationUser> = {
    renderItem: (item: ApplicationUser, index: number) => <ApplicationUserListItem
      user={item} mineApplicationUsers={mineApplicationUsers} />,
    itemLayout: 'vertical',
  };

  const onLoadMoreErrorProps: Rfc7807Props = {
    onClickRetry: onClickRetry,
    // type: '/ApplicationUserList/applicationUserServiceGetList',
  };

  return (
    <InfiniteScrollPageList
      items={itemsUsed}
      hasMadeAtLeastOneFetch={hasMadeAtLeastOneFetch}
      onLoadMoreErrorOccur={onLoadMoreError}
      onLoadMoreError={onLoadMoreErrorProps}
      paginationCurrent={paginationCurrent}
      paginationPageSize={APPLICATION_USER_LIST_PAGE_SIZE}
      paginationOnChange={onChangePagination}
      nextPageToken={nextPageToken}
      listProps={listProps}
    />
  );
}
