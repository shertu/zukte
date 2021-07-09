import './style.less';

import {
  IPageableListState,
  PageableListState,
} from '../pageable-list/pageable-list-state';
import {
  ImageStorageServiceApi,
  ImageStorageServiceGetListRequest,
} from '../../../../openapi-generator';

import {InfiniteScrollList} from '../pageable-list/infinite-scroll-list';
import {List} from 'antd';
import React from 'react';

/**
 * A list of the application users or accounts stored in the application.
 */
export function ImageShareList(props: {
  value?: PageableListState<string>;
  onChange?: (value: PageableListState<string>) => void;
}) {
  const {value, onChange} = props;

  const client = new ImageStorageServiceApi();

  const paginationPageSize = 6;

  /**
   * Tigger to load the next page of data.
   */
  async function onFetchNextPageAsync(current: PageableListState<string>) {
    const request: ImageStorageServiceGetListRequest = {
      maxResults: paginationPageSize,
    };

    const nextPageToken = current.state.nextPageToken;
    if (nextPageToken) {
      request.pageToken = nextPageToken;
    }

    const response = await client.imageStorageServiceGetList(request);

    const currentItems: string[] = current.state.items || [];
    const additionalItems: string[] = response.items || [];

    const nextValue: IPageableListState<string> = {
      items: currentItems.concat(additionalItems),
      nextPageToken: response.nextPageToken,
      hasMadeAtLeastOneFetch: true,
    };

    return new PageableListState<string>(nextValue);
  }

  /**
   * A display name wrapper for the account list item component.
   */
  function renderListItem(item: string, index: number) {
    return (
      <List.Item key={index}>
        <img className="max-cell-xs imageshare-list-image" src={item} />
      </List.Item>
    );
  }

  const spacing: number | undefined = 16;

  return (
    <InfiniteScrollList
      onFetchNextPageAsync={onFetchNextPageAsync}
      onChange={onChange}
      value={value}
      paginationPageSize={paginationPageSize}
      list={{
        renderItem: renderListItem,
        grid: {
          gutter: spacing,
          xs: 1,
          md: 2,
          xl: 3,
        },
        style: {padding: spacing},
      }}
    />
  );
}
