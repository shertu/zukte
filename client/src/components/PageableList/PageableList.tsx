import { Alert, List, ListProps, Space } from 'antd';
import InfiniteScroll, { Props as InfiniteScrollProps } from 'react-infinite-scroll-component';

import { PageableListState } from './PageableListState';
import React from 'react';
import { Rfc7807Alert } from '../Rfc7807Alert/Rfc7807Alert';

/** The props for the pagination list component. */
export interface PageableListProps<T> {
  onFetchNextPageAsync: (current: PageableListState<T>) => Promise<PageableListState<T>>;
  value?: PageableListState<T>;
  onChange?: (value: PageableListState<T>) => void;
  paginationPageSize: number;

  infinite?: Omit<InfiniteScrollProps,
    'dataLength' | 'next' | 'hasMore' | 'loader'>;
  list?: Omit<ListProps<T>,
    'loading' | 'dataSource'>;

  pluralWord?: string;
};

/**
 * An infinite scroll list of items which loads
 * additional content using pagination.
 *
 * @param {PageableListProps<T>} props
 * @return {JSX.Element}
 */
export function PageableList<T>(
  props: PageableListProps<T>,
): JSX.Element {
  const [internalValue, setInternalValue] =
    React.useState<PageableListState<T>>(new PageableListState<T>());

  const {
    onFetchNextPageAsync,
    value = internalValue, // use internal value as default
    onChange,
    paginationPageSize,
    pluralWord = "resources",
  } = props;

  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(1);

  const [errorOccur, setErrorOccur] =
    React.useState<boolean>(false);

  const itemLength: number =
    internalValue.length;
  const shouldFetchMore: boolean =
    internalValue.shouldFetchMore(paginationCurrent, paginationPageSize);
  const isPotentialForMore: boolean =
    internalValue.isPotentialForMore();

  React.useEffect(() => {
    if (onChange) {
      onChange(internalValue);
    }
  }, [internalValue]);

  /** trigger to fetch additional items */
  React.useEffect(() => {
    if (isPotentialForMore && shouldFetchMore && !errorOccur) {
      onFetchNextPageAsync(value)
        .then((response) => setInternalValue(response))
        .catch((err) => setErrorOccur(true));
    }
  }, [isPotentialForMore, shouldFetchMore, errorOccur]);

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

  /** The event called when the retry button is clicked. */
  function onClickRetry(): void {
    setErrorOccur(false);
  }

  /** The event called to increment the page no. */
  function onNext(): void {
    if (value.state.hasMadeAtLeastOneFetch) {
      onChangePagination(paginationCurrent + 1);
    } else {
      onChangePagination(1);
    }
  }

  return (
    <Space
      className="max-cell"
      direction="vertical"
    >
      <InfiniteScroll
        {...props.infinite}
        dataLength={itemLength}
        next={onNext}
        hasMore={isPotentialForMore}
        loader={null}
      >
        <List
          {...props.list}
          loading={isPotentialForMore && shouldFetchMore && !errorOccur}
          dataSource={value.state.items}
        />
      </InfiniteScroll>

      {(!itemLength && value.state.hasMadeAtLeastOneFetch) &&
        <Alert
          type="warning"
          message={`The request to fetch additional ${pluralWord} was successful but no ${pluralWord} were found.`}
        />
      }

      {errorOccur &&
        <Rfc7807Alert
          title={`The request to fetch additional ${pluralWord} was unsuccessful.`}
          type="/error/infinite-scroll-page-list"
          onClickRetry={onClickRetry}
        />
      }
    </Space>
  );
}
