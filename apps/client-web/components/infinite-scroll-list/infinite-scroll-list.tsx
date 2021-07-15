import InfiniteScroll, {
  Props as InfiniteScrollProps,
} from 'react-infinite-scroll-component';

import React from 'react';

export interface InfiniteScrollListValue<T> {
  items?: T[];
  nextPageToken?: string | null | undefined;
  hasMadeAtLeastOneFetch?: boolean;
}

/**
 * Is there the potential to fetch more items?
 */
export function isPotentialForMore<T>(
  value: InfiniteScrollListValue<T>
): boolean {
  return !!value.nextPageToken || !value.hasMadeAtLeastOneFetch;
}

/**
 * Should the client try to fetch more items regardless of potential?
 */
export function shouldFetchMore<T>(
  value: InfiniteScrollListValue<T>,
  paginationCurrent: number,
  paginationPageSize?: number
): boolean {
  const b: number = paginationPageSize || 0;
  const count: number = value.items?.length ?? 0;
  return count < paginationCurrent * b;
}

/** The props for the pagination list component. */
export interface InfiniteScrollListProps<T>
  extends Omit<
    InfiniteScrollProps,
    'dataLength' | 'next' | 'hasMore' | 'loader'
  > {
  onFetchNextPageAsync: (
    current: InfiniteScrollListValue<T>
  ) => Promise<InfiniteScrollListValue<T>>;
  value?: InfiniteScrollListValue<T>;
  onChange?: (value: InfiniteScrollListValue<T>) => void;
  paginationPageSize: number;
}

/**
 * An infinite scroll list of items which loads
 * additional content using pagination.
 */
export function InfiniteScrollList<T>(props: InfiniteScrollListProps<T>) {
  const [value_, setValue_] = React.useState<InfiniteScrollListValue<T>>({
    items: [],
  });

  const {
    onFetchNextPageAsync,
    value = value_, // use internal value as default
    onChange = setValue_,
    paginationPageSize,
    ...other
  } = props;

  const [paginationCurrent, setPaginationCurrent] = React.useState<number>(1);
  const [errorOccur, setErrorOccur] = React.useState<boolean>(false);

  const length: number = value.items?.length ?? 0;
  const should: boolean = shouldFetchMore(
    value,
    paginationCurrent,
    paginationPageSize
  );
  const potential: boolean = isPotentialForMore(value);

  /** trigger to fetch additional items */
  React.useEffect(() => {
    if (potential && should && !errorOccur) {
      onFetchNextPageAsync(value)
        .then(response => onChange(response))
        .catch(() => setErrorOccur(true));
    }
  }, [potential, should, errorOccur]);

  /**
   * Called when the page number is changed, and it takes
   * the resulting page number and page size as its arguments.
   */
  // function onChangePagination(page: number, pageSize?: number) {
  function onChangePagination(page: number) {
    setPaginationCurrent(page);
  }

  // /** The event called when the retry button is clicked. */
  // function onClickRetry() {
  //   setErrorOccur(false);
  // }

  /** The event called to increment the page no. */
  function onNext() {
    if (value.hasMadeAtLeastOneFetch) {
      onChangePagination(paginationCurrent + 1);
    } else {
      onChangePagination(1);
    }
  }

  return (
    <InfiniteScroll
      {...other}
      dataLength={length}
      next={onNext}
      hasMore={potential}
      loader={potential && should && !errorOccur}
    />
  );
}
