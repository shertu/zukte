import {Alert, AlertProps, List, ListProps, PaginationProps, Space, SpaceProps} from 'antd';
import InfiniteScroll, {Props as InfiniteScrollProps} from 'react-infinite-scroll-component';
import {Rfc7807Alert, Rfc7807Props} from '../Rfc7807Alert/Rfc7807Alert';

import React from 'react';

export interface InfiniteScrollPageListProps<T> {
  spaceProps?: Omit<SpaceProps, 'direction'>;
  noItemsFound?: AlertProps;
  onLoadMoreError?: Omit<Rfc7807Props, 'title'>;
  infiniteScrollProps?: Omit<InfiniteScrollProps, 'dataLength' | 'next' | 'hasMore' | 'loader'>;
  itemCount: number;
  hasMadeAtLeastOneFetch?: boolean;
  onLoadMoreErrorOccur?: boolean;
  listProps?: Omit<ListProps<T>, 'loading'>;
  paginationProps?: PaginationProps;
  nextPageToken?: string;
};

/**
 * An infinite scroll list of items which loads using pagination.
 *
 * @param {InfiniteScrollPageListProps<T>} props
 * @return {JSX.Element}
 */
export function InfiniteScrollPageList<T>(props: InfiniteScrollPageListProps<T>): JSX.Element {
  const {
    spaceProps,
    noItemsFound = {
      message: 'No items were found.',
    },
    onLoadMoreError,
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
          loading={potentialForMore && shouldLoadMore && !onLoadMoreErrorOccur}
        />
      </InfiniteScroll>


      {(!itemCount && hasMadeAtLeastOneFetch) &&
        <Alert
          {...noItemsFound}
        />
      }

      {onLoadMoreErrorOccur &&
        <Rfc7807Alert
          {...onLoadMoreError}
          title="The request to fetch additional resources was unsuccessful."
        />
      }
    </Space>
  );
}

// ...onLoadMoreError

/* <Alert
  type="error"
  action={
    <Button size="small" danger onClick={onClickRetry}>retry</Button>
  }
/> */
