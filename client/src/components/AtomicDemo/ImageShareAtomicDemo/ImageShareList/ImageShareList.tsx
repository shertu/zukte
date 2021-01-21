import {Alert, List, Skeleton} from 'antd';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {BlobStorageApi, StringListResponse} from '../../../../../generated-sources/openapi';

const DEFAULT_PAGE_SIZE: number = 30;
const ImageShareListGutterValue: number = 8;

const BLOB_STORAGE_API: BlobStorageApi = new BlobStorageApi();

/**
 * A list of the images stored in the application's image share container.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ImageShareList(props: {
  itemCollection: string[],
  setItemCollection: (value: string[]) => void
}): JSX.Element {
  const {itemCollection, setItemCollection} = props;

  /** The response from the latest item fetch. */
  const [currentResponse, setCurrentResponse] =
    React.useState<StringListResponse>(null);

  /** The current page index of the pagination. */
  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(0);

  /** The current page size of the pagination. */
  const [paginationSize, setPaginationSize] =
    React.useState<number>(0);

  /** Has an error occured during a fetch op? */
  const [error, setError] =
    React.useState<boolean>(false);

  const paginationExpectedTotal: number = paginationCurrent * paginationSize;
  const dataLength: number = itemCollection ? itemCollection.length : 0;
  const shouldAndCanLoadMore: boolean = dataLength < paginationExpectedTotal && canLoadMore(currentResponse);
  const hasMore: boolean = canLoadMore(currentResponse) && !error;

  /** After fetching additional items, append the new items to the data collection. */
  React.useEffect(() => {
    if (currentResponse) {
      const data: string[] = itemCollection || []; // important to default data value
      const {items} = currentResponse;

      if (items) {
        setItemCollection(data.concat(items));
      }
    }
  }, [currentResponse]);

  /** Loads the first page. */
  React.useEffect(() => {
    onChangePagination(paginationCurrent + 1, DEFAULT_PAGE_SIZE);
  }, []);

  /** Load items into the data collection until the length expectation is met or no additional items can be loaded. */
  React.useEffect(() => {
    if (shouldAndCanLoadMore) {
      fetchNextResponse(currentResponse)
          .then((res: StringListResponse) => setCurrentResponse(res))
          .catch(() => setError(true));
    }
  }, [shouldAndCanLoadMore, itemCollection]);

  /**
   * Called when the page number is changed, and it takes the resulting page number and page size as its arguments.
   *
   * @param {number} page
   * @param {number} pageSize
   */
  function onChangePagination(page: number, pageSize?: number): void {
    pageSize = pageSize || DEFAULT_PAGE_SIZE;
    setPaginationCurrent(page);
    setPaginationSize(pageSize);
  }

  /**
   * Fetches the next page of items based on the current response.
   *
   * @param {StringListResponse} response
   * @param {number} maxResults
   * @return {StringListResponse}
   */
  async function fetchNextResponse(response: StringListResponse, maxResults?: number): Promise<StringListResponse> {
    const res: StringListResponse = await BLOB_STORAGE_API.apiBlobStorageListGet({
      maxResults: maxResults,
      pageToken: response?.nextPageToken,
    });

    return res;
  }

  /**
   * Checks if additional items can be loaded for the specified tresponse.
   *
   * @param {StringListResponse} response
   * @return {boolean}
   */
  function canLoadMore(response: StringListResponse): boolean {
    return response == null || Boolean(response.nextPageToken);
  }

  return (
    <div style={{paddingLeft: ImageShareListGutterValue, paddingRight: ImageShareListGutterValue}}>
      {error &&
        <Alert message="Error" description="An unexpected error occured while trying to load the images." type="error" showIcon />
      }

      <InfiniteScroll
        dataLength={dataLength}
        next={() => onChangePagination(paginationCurrent + 1)}
        hasMore={hasMore}
        loader={<Skeleton loading active />}
      >
        {dataLength > 0 &&
          <List
            grid={{
              gutter: ImageShareListGutterValue,
              xs: 1,
              sm: 2,
              md: 3,
              column: 4,
            }}
            dataSource={itemCollection}
            renderItem={(item: string) => (
              <List.Item key={item}>
                <img className="max-cell-xs" src={item} />
              </List.Item>
            )}
          />
        }
      </InfiniteScroll>
    </div>
  );
}
