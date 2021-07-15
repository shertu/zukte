import {ImageList, ImageListItem} from '@material-ui/core';
import {
  ImageStorageServiceApi,
  ImageStorageServiceGetListRequest,
} from '@zukte/api-client';
import {
  InfiniteScrollList,
  InfiniteScrollListValue,
} from '../infinite-scroll-list/infinite-scroll-list';

import React from 'react';

/**
 * A list of the application users or accounts stored in the application.
 */
export function ImageShareList(props: {
  value?: InfiniteScrollListValue<string>;
  onChange?: (value: InfiniteScrollListValue<string>) => void;
}) {
  const {value, onChange} = props;

  const client = new ImageStorageServiceApi();

  const paginationPageSize = 6;

  /**
   * Tigger to load the next page of data.
   */
  async function onFetchNextPageAsync(
    current: InfiniteScrollListValue<string>
  ) {
    const request: ImageStorageServiceGetListRequest = {
      maxResults: paginationPageSize,
    };

    const nextPageToken = current.nextPageToken;
    if (nextPageToken) {
      request.pageToken = nextPageToken;
    }

    const response = await client.imageStorageServiceGetList(request);

    const currentItems: string[] = current.items || [];
    const additionalItems: string[] = response.items || [];

    const nextValue: InfiniteScrollListValue<string> = {
      items: currentItems.concat(additionalItems),
      nextPageToken: response.nextPageToken,
      hasMadeAtLeastOneFetch: true,
    };

    return nextValue;
  }

  return (
    <InfiniteScrollList
      onFetchNextPageAsync={onFetchNextPageAsync}
      onChange={onChange}
      value={value}
      paginationPageSize={paginationPageSize}
    >
      <ImageList
        // variant="quilted"
        cols={4}
        rowHeight={121}
      >
        {value?.items?.map(imageUrl => (
          <ImageListItem
            key={imageUrl}
            // cols={item.cols || 1}
            // rows={item.rows || 1}
          >
            <img src={imageUrl} loading="lazy" />
          </ImageListItem>
        ))}
      </ImageList>
    </InfiniteScrollList>
  );
}
