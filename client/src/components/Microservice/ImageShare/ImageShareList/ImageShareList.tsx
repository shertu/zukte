import { ImageStorageServiceApi, ImageStorageServiceGetListRequest } from '../../../../openapi-generator';
import { List, ListProps } from 'antd';

import { PaginationList } from '../../../PaginationList/PaginationList';
import { PaginationResponseInformation } from '../../../../utilities/PaginationResponseInformation';
import React from 'react';

/**
 * A list of the application users or accounts stored in the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ImageShareList(props: {
  information: PaginationResponseInformation<string>;
  onChangeInformation: (information: PaginationResponseInformation<string>) => void;
}): JSX.Element {
  const { information, onChangeInformation } = props;

  const client = new ImageStorageServiceApi();

  /**
   * An event to fetch an additional page of items.
   * @param {PaginationResponseInformation<ApplicationUser>} current
   * @return {Promise<PaginationResponseInformation<ApplicationUser>>}
   */
  async function onFetchAdditionalInformation(
    current: PaginationResponseInformation<string>,
  ): Promise<PaginationResponseInformation<string>> {
    const request: ImageStorageServiceGetListRequest = {

    };

    if (current.nextPageToken) {
      request.pageToken = current.nextPageToken;
    }

    const response = await client.imageStorageServiceGetList(request);

    const additionalItems: string[] = response.urls || [];

    const nextInformation: PaginationResponseInformation<string> =
      new PaginationResponseInformation<string>();

    nextInformation.items = current.items.concat(additionalItems);
    nextInformation.nextPageToken = response.nextPageToken;
    nextInformation.hasMadeAtLeastOneFetch = true;

    return nextInformation;
  }

  const listProps: ListProps<string> = {
    renderItem: (item: string, index: number) =>
      <List.Item key={index}>
        <img className="max-cell-xs" src={item} />
      </List.Item>,
    itemLayout: 'vertical',
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
