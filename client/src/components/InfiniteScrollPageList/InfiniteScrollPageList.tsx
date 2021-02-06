import { Alert, AlertProps, Button, List, ListProps, PaginationProps, Space, SpaceProps } from 'antd';
import InfiniteScroll, { Props as InfiniteScrollProps } from 'react-infinite-scroll-component';

import React from 'react';

/**
 * An infinite scroll list of items which loads using pagination.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function InfiniteScrollPageList<T>(props: {
  spaceProps?: Omit<SpaceProps, 'direction'>;
  noItemsFound?: AlertProps;
  onLoadMoreError?: Omit<AlertProps, 'action' | 'type'>;
  onClickRetry: React.MouseEventHandler<HTMLElement>;
  infiniteScrollProps?: Omit<InfiniteScrollProps, 'dataLength' | 'next' | 'hasMore' | 'loader'>;
  itemCount: number;
  hasMadeAtLeastOneFetch?: boolean;
  onLoadMoreErrorOccur?: boolean;
  listProps?: Omit<ListProps<T>, 'loading'>;
  paginationProps?: PaginationProps;
  nextPageToken?: string;
}): JSX.Element {
  const {
    spaceProps,
    noItemsFound = {
      message: 'No items were found',
    },
    onLoadMoreError = {
      message: 'The request for additional data was not successful',
    },
    onClickRetry,
    infiniteScrollProps,
    itemCount,
    hasMadeAtLeastOneFetch,
    onLoadMoreErrorOccur,
    listProps,
    paginationProps,
    nextPageToken,
  } = props;

  const paginationCurrent: number = paginationProps?.current || paginationProps?.defaultCurrent || 0;
  const paginationSize: number = paginationProps?.pageSize || paginationProps?.defaultPageSize || 10;

  const hasMore: boolean = Boolean(nextPageToken);
  const shouldLoadMore: boolean = itemCount < paginationCurrent * paginationSize;
  const potentialForMore: boolean = hasMore || !hasMadeAtLeastOneFetch;

  function paginationOnChangeDefault(page: number, pageSize?: number): void {
    // do nothing
  }

  const paginationOnChange = paginationProps?.onChange || paginationOnChangeDefault;

  return (
    <Space
      {...spaceProps}
      direction="vertical"
    >
      <InfiniteScroll
        {...infiniteScrollProps}
        dataLength={itemCount}
        next={() => paginationOnChange(paginationCurrent + 1)}
        hasMore={potentialForMore}
        loader={null}
      >
        <List
          {...listProps}
          loading={potentialForMore && shouldLoadMore && !onLoadMoreError}
        />
      </InfiniteScroll>


      {(!itemCount && hasMadeAtLeastOneFetch) &&
        <Alert
          {...noItemsFound}
        />
      }

      {onLoadMoreErrorOccur &&
        <Alert
          {...onLoadMoreError}
          type="error"
          action={
            <Button size="small" danger onClick={onClickRetry}>retry</Button>
          }
        />
      }
    </Space>
  );
}
