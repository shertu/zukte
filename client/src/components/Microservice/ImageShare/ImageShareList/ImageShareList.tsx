import { IPageableListState, PageableListState } from '../../../PageableList/PageableListState';
import { ImageStorageServiceApi, ImageStorageServiceGetListRequest } from '../../../../openapi-generator';
import { List, ListProps } from 'antd';

import { PageableList } from '../../../PageableList/PageableList';
import React from 'react';

/**
 * A list of the application users or accounts stored in the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ImageShareList(props: {
  value?: PageableListState<string>;
  onChange?: (value: PageableListState<string>) => void;
}): JSX.Element {
  const { value, onChange } = props;
  const client = new ImageStorageServiceApi();

  async function onFetchNextPageAsync(
    current: PageableListState<string>,
  ) {
    const request: ImageStorageServiceGetListRequest = {
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
    }

    return new PageableListState<string>(nextValue);
  }

  /**
   * A display name wrapper for the account list item component.
   * @param {string} item
   * @param {string} index
   * @return {JSX.Element}
   */
  function renderListItem(item: string, index: number): JSX.Element {
    return (
      <List.Item key={index}>
        <img className="max-cell-xs" src={item} />
      </List.Item>
    );
  }

  return (
    <PageableList
      onFetchNextPageAsync={onFetchNextPageAsync}
      onChange={onChange}
      value={value}
      paginationPageSize={25}
      list={{
        renderItem: renderListItem,
      }}
      pluralWord="images"
    />
  );
}
