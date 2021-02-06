import { Alert, List, Space, SpaceProps } from 'antd';

import InfiniteScroll from 'react-infinite-scroll-component';
import React from 'react';

interface InfiniteScrollPageListSpaceProps extends Omit<SpaceProps, 'vertical'> {

}

/**
 * An infinite scroll list of items which loads using pagination.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function InfiniteScrollPageList<T>(props: {
  spaceProps?: InfiniteScrollPageListSpaceProps,
  noItemsFound?: React.ReactNode,
  onLoadMoreError?: typeof Alert,
}): JSX.Element {
  const { spaceProps, noItemsFound, onLoadMoreError } = props;

  onLoadMoreError.

    return(
      <Space
        {...spaceProps}
        direction="vertical"
      >
        <InfiniteScroll
          dataLength={itemCount}
          next={() => onChangePagination(paginationCurrent + 1)}
          hasMore={potentialForMore}
          loader={null}
        >
          <List
            loading={potentialForMore && shouldLoadMore && !onLoadMoreError}
          />
        </InfiniteScroll>


        {true &&
          noItemsFound
        }

        {true &&
          <Alert
            message={onLoadMoreErrorTextDefault}
            type="error"
            showIcon
            action={
              <Button size="small" danger onClick={onClickRetry}>retry</Button>
            }
          />
        }
      </Space>,

      // <PaginationContainer
      //   className="max-cell"
      //   noItemsFetched={!itemCount && hasMadeAtLeastOneFetch}
      //   onLoadMoreError={onLoadMoreError}
      //   onClickReload={onClickReloadButton}
      // >

      // </PaginationContainer>
    );
}
