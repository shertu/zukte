import {Alert, AlertProps, List, ListProps, Space} from 'antd';
import InfiniteScroll, {Props as InfiniteScrollProps} from 'react-infinite-scroll-component';
import {Rfc7807Alert, Rfc7807Props} from '../Rfc7807Alert/Rfc7807Alert';

import React from 'react';

export interface InfiniteScrollPageListProps<T> {
  noItemsFound?: AlertProps;
  onLoadMoreError?: Rfc7807Props;
  items?: T[];
  infiniteScrollProps?: Omit<InfiniteScrollProps, 'dataLength' | 'next' | 'hasMore' | 'loader'>;
  hasMadeAtLeastOneFetch?: boolean;
  onLoadMoreErrorOccur?: boolean;
  listProps?: Omit<ListProps<T>, 'loading' | 'dataSource'>;
  paginationCurrent: number;
  paginationPageSize?: number;
  paginationOnChange?: (page: number, pageSize?: number) => void;
  nextPageToken?: string;
};

const PAGINATION_PAGE_SIZE_DEFAULT = 10;

/**
 * An infinite scroll list of items which loads using pagination.
 *
 * @param {InfiniteScrollPageListProps<T>} props
 * @return {JSX.Element}
 */
export function InfiniteScrollPageList<T>(props: InfiniteScrollPageListProps<T>): JSX.Element {
  const {
    noItemsFound,
    onLoadMoreError,
    infiniteScrollProps,
    items,
    hasMadeAtLeastOneFetch,
    onLoadMoreErrorOccur,
    listProps,
    paginationCurrent,
    paginationPageSize = PAGINATION_PAGE_SIZE_DEFAULT,
    paginationOnChange,
    nextPageToken,
  } = props;

  const itemCount = items?.length || 0;
  const hasMore: boolean = Boolean(nextPageToken);
  const shouldLoadMore: boolean = itemCount < paginationCurrent * paginationPageSize;
  const potentialForMore: boolean = hasMore || !hasMadeAtLeastOneFetch;

  function onNext(): void {
    if (paginationOnChange) {
      paginationOnChange(paginationCurrent + 1);
    }
  }

  return (
    <Space
      className="max-cell"
      direction="vertical"
    >
      <InfiniteScroll
        {...infiniteScrollProps}
        dataLength={itemCount}
        next={onNext}
        hasMore={potentialForMore}
        loader={null}
      >
        <List
          {...listProps}
          loading={potentialForMore && shouldLoadMore && !onLoadMoreErrorOccur}
          dataSource={items}
        />
      </InfiniteScroll>


      {(!itemCount && hasMadeAtLeastOneFetch) &&
        <Alert
          message="No resources were found."
          {...noItemsFound}
        />
      }

      {onLoadMoreErrorOccur &&
        <Rfc7807Alert
          title="The request to fetch additional resources was unsuccessful."
          {...onLoadMoreError}
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
