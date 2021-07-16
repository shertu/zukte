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

export interface ImageShareListProps {
  value?: InfiniteScrollListValue<string>;
  onChange?: (value: InfiniteScrollListValue<string>) => void;
}

/**
 * A list of the application users or accounts stored in the application.
 */
export function ImageShareList(props: ImageShareListProps) {
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
      className="p-1"
    >
      <ImageList>
        {value?.items?.map(imageUrl => (
          <ImageListItem key={imageUrl}>
            <img src={imageUrl} loading="lazy" />
          </ImageListItem>
        ))}
      </ImageList>
    </InfiniteScrollList>
  );
}
