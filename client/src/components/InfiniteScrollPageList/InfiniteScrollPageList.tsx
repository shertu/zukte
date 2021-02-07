import {Alert, List, ListProps, Space} from 'antd';
import InfiniteScroll, {Props as InfiniteScrollProps} from 'react-infinite-scroll-component';

import React from 'react';
import {Rfc7807Alert} from '../Rfc7807Alert/Rfc7807Alert';

export interface InfiniteScrollPageListProps<T> {
  onLoadInformation?: OnLoadInformation<T>;
  onLoadNextAsync: (info: OnLoadInformation<T>) => Promise<void>;
  paginationPageSize?: number;
  infiniteScroll?: Omit<InfiniteScrollProps, 'dataLength' | 'next' | 'hasMore' | 'loader'>;
  list?: Omit<ListProps<T>, 'loading' | 'dataSource'>;
  rfc7807Type?: string;
};

export interface OnLoadInformation<T> {
  items?: T[];
  nextPageToken?: string;
  hasMadeAtLeastOneFetch?: boolean;
}

/**
 * An infinite scroll list of items which loads using pagination.
 *
 * @param {InfiniteScrollPageListProps<T>} props
 * @return {JSX.Element}
 */
export function InfiniteScrollPageList<T>(props: InfiniteScrollPageListProps<T>): JSX.Element {
  const {
    onLoadInformation = {
      items: [],
      hasMadeAtLeastOneFetch: false,
    },
    onLoadNextAsync: onLoadNext,
    paginationPageSize = 10,
    rfc7807Type,
  } = props;

  const {
    items,
    nextPageToken,
    hasMadeAtLeastOneFetch,
  } = onLoadInformation;

  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(1);

  const [errOccur, setErrOccur] =
    React.useState<boolean>(false);

  const itemCount = items?.length || 0;
  const hasMore: boolean = Boolean(nextPageToken);
  const shouldLoadMore: boolean = itemCount < paginationCurrent * paginationPageSize;
  const potentialForMore: boolean = hasMore || !hasMadeAtLeastOneFetch;

  console.log('InfiniteScrollPageList', {
    itemCount: itemCount,
    hasMore: hasMore,
    shouldLoadMore: shouldLoadMore,
    potentialForMore: potentialForMore,
    errOccur: errOccur,
  });

  /** an automatic trigger for onLoadMore event. */
  React.useEffect(() => {
    if (potentialForMore && shouldLoadMore && !errOccur) {
      onLoadNext(onLoadInformation)
          .catch((error) => setErrOccur(Boolean(error)));
    }
  }, [potentialForMore, shouldLoadMore, errOccur]);

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
    setErrOccur(false);
  }

  return (
    <Space
      className="max-cell"
      direction="vertical"
    >
      <InfiniteScroll
        {...props.infiniteScroll}
        dataLength={itemCount}
        next={() => onChangePagination(paginationCurrent + 1)}
        hasMore={potentialForMore}
        loader={null}
      >
        <List
          {...props.list}
          loading={potentialForMore && shouldLoadMore && !errOccur}
          dataSource={items}
        />
      </InfiniteScroll>


      {(!itemCount && hasMadeAtLeastOneFetch) &&
        <Alert
          type="warning"
          message="No resources were found."
        />
      }

      {errOccur &&
        <Rfc7807Alert
          title="The request to fetch additional resources was unsuccessful."
          type={rfc7807Type}
          onClickRetry={onClickRetry}
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
