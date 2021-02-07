import {ApplicationUser, ApplicationUserListResponse, ApplicationUserServiceApi, ApplicationUserServiceGetListRequest} from '../../../../openapi-generator';
import {ListProps, PaginationProps, SpaceProps} from 'antd';

import {ApplicationUserListItem} from './ApplicationUserListItem/ApplicationUserListItem';
import {InfiniteScrollPageList} from '../../../InfiniteScrollPageList/InfiniteScrollPageList';
import React from 'react';
import {Rfc7807Props} from '../../../Rfc7807Alert/Rfc7807Alert';

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
export function ApplicationUserList(props: {
  mineApplicationUsers?: ApplicationUser[];
}): JSX.Element {
  const {mineApplicationUsers} = props;
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

  const paginationCurrent: number = paginationInfomation.current || 0;
  const paginationSize: number = paginationInfomation.pageSize || 10;

  const hasMore: boolean = Boolean(nextPageToken);
  const shouldLoadMore: boolean = items.length < paginationCurrent * paginationSize;
  const potentialForMore: boolean = hasMore || !hasMadeAtLeastOneFetch;

  // console.log('ApplicationUserList', {
  //   itemCount: items.length,
  //   nextPageToken: nextPageToken,
  //   hasMadeAtLeastOneFetch: hasMadeAtLeastOneFetch,
  //   paginationCurrent: paginationCurrent,
  //   paginationSize: paginationSize,
  //   onLoadMoreError: onLoadMoreError,
  //   hasMore: hasMore,
  //   shouldLoadMore: shouldLoadMore,
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
      maxResults: paginationSize,
    };

    if (nextPageToken) {
      request.pageToken = nextPageToken;
    }

    try {
      const response: ApplicationUserListResponse =
        await client.applicationUserServiceGetList(request);

      const {
        items: additionalItems = [],
        nextPageToken: responseNextPageToken,
      } = response;

      const newMessageInfomation: MessageInfomation = {
        items: items.concat(additionalItems),
        nextPageToken: responseNextPageToken,
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
    const newPaginationInformation: PaginationProps = {
      ...paginationInfomation,
      current: page,
      pageSize: pageSize,
    };

    setPaginationInfomation(newPaginationInformation);
  }

  function onClickRetry(): void {
    setOnLoadMoreError(false);
  }

  const spaceProps: SpaceProps = {
    className: 'max-cell',
  };

  const listProps: ListProps<ApplicationUser> = {
    dataSource: items,
    renderItem: (item: ApplicationUser, index: number) => <ApplicationUserListItem
      user={item} mineApplicationUsers={mineApplicationUsers} />,
  };

  const onLoadMoreErrorProps: Rfc7807Props = {
    onClickRetry: onClickRetry,
    type: '/ApplicationUserList/applicationUserServiceGetList',
  };

  return (
    <InfiniteScrollPageList
      spaceProps={spaceProps}
      itemCount={items.length}
      hasMadeAtLeastOneFetch={hasMadeAtLeastOneFetch}
      onLoadMoreErrorOccur={onLoadMoreError}
      onLoadMoreError={onLoadMoreErrorProps}
      paginationProps={paginationInfomation}
      nextPageToken={nextPageToken}
      listProps={listProps}
    />
  );
}
