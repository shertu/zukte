import {Alert, List, ListProps, Space} from 'antd';
import InfiniteScroll, {Props as InfiniteScrollProps} from 'react-infinite-scroll-component';

import {PaginationListInformation} from './PaginationListInformation';
import React from 'react';
import {Rfc7807Alert} from '../Rfc7807Alert/Rfc7807Alert';

/** The props for the pagination list component. */
export interface PaginationListProps<T> {
  // TODO update definition to include page size
  onFetchAdditionalInformation: (
    current: PaginationListInformation<T>) =>
    Promise<PaginationListInformation<T>>;

  information?: PaginationListInformation<T>;
  onChangeInformation?: (
    information: PaginationListInformation<T>) => void;
  paginationPageSize?: number;

  infinite?: Omit<InfiniteScrollProps,
    'dataLength' | 'next' | 'hasMore' | 'loader'>;
  list?: Omit<ListProps<T>,
    'loading' | 'dataSource'>;
};

/**
 * An infinite scroll list of items which loads
 * additional content using pagination.
 *
 * @param {PaginationListProps<T>} props
 * @return {JSX.Element}
 */
export function PaginationList<T>(
    props: PaginationListProps<T>,
): JSX.Element {
  const [informationLocal, setInformationLocal] =
    React.useState<PaginationListInformation<T>>(
        new PaginationListInformation<T>());

  const {
    onFetchAdditionalInformation,
    information = informationLocal,
    onChangeInformation,
    paginationPageSize,
  } = props;

  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(1);

  const [errorOccur, setErrorOccur] =
    React.useState<boolean>(false);

  const itemLength: number =
    information.length;
  const shouldFetchMore: boolean =
    information.shouldFetchMore(paginationCurrent, paginationPageSize);
  const isPotentialForMore: boolean =
    information.isPotentialForMore();

  React.useEffect(() => {
    if (onChangeInformation) {
      onChangeInformation(informationLocal);
    }
  }, [informationLocal]);

  /** trigger to fetch additional items */
  React.useEffect(() => {
    if (isPotentialForMore && shouldFetchMore && !errorOccur) {
      onFetchAdditionalInformation(information)
          .then((response) => setInformationLocal(response))
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
    if (information.hasMadeAtLeastOneFetch) {
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
          dataSource={information.items}
        />
      </InfiniteScroll>


      {(!itemLength && information.hasMadeAtLeastOneFetch) &&
        <Alert
          type="warning"
          message="The system found zero resources."
        />
      }

      {errorOccur &&
        <Rfc7807Alert
          title="The request to fetch additional resources was unsuccessful."
          type="/error/infinite-scroll-page-list"
          onClickRetry={onClickRetry}
        />
      }
    </Space>
  );
}
