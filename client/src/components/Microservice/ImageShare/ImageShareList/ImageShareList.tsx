import {ImageStorageServiceApi, ImageStorageServiceGetListRequest} from '../../../../openapi-generator';
import {List, ListProps} from 'antd';

import {PaginationList} from '../../../PaginationList/PaginationList';
import {PaginationListInformation} from '../../../PaginationList/PaginationListInformation';
import React from 'react';

/**
 * A list of the application users or accounts stored in the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ImageShareList(props: {
  information: PaginationListInformation<string>;
  onChangeInformation: (
    information: PaginationListInformation<string>
  ) => void;
}): JSX.Element {
  const {information, onChangeInformation} = props;

  const client = new ImageStorageServiceApi();

  /**
   * An event to fetch an additional page of items.
   * @param {PaginationListInformation<ApplicationUser>} current
   * @return {Promise<PaginationListInformation<ApplicationUser>>}
   */
  async function onFetchAdditionalInformation(
      current: PaginationListInformation<string>,
  ): Promise<PaginationListInformation<string>> {
    const request: ImageStorageServiceGetListRequest = {

    };

    if (current.nextPageToken) {
      request.pageToken = current.nextPageToken;
    }

    const response = await client.imageStorageServiceGetList(request);

    const additionalItems: string[] = response.items || [];

    const nextInformation: PaginationListInformation<string> =
      new PaginationListInformation<string>();

    nextInformation.items = current.items.concat(additionalItems);
    nextInformation.nextPageToken = response.nextPageToken;
    nextInformation.hasMadeAtLeastOneFetch = true;

    return nextInformation;
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

  const listProps: ListProps<string> = {
    renderItem: renderListItem,
  };

  return (
    <PaginationList
      onFetchAdditionalInformation={onFetchAdditionalInformation}
      onChangeInformation={onChangeInformation}
      information={information}
      paginationPageSize={25}
      list={listProps}
    />
  );
}
