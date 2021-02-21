import { ApplicationUser, ApplicationUserServiceApi, ApplicationUserServiceGetListRequest } from '../../../../openapi-generator';

import { ListItem } from './ListItem/ListItem';
import { ListProps } from 'antd';
import { PaginationList } from '../../../PaginationList/PaginationList';
import { PaginationResponseInformation } from '../../../../utilities/PaginationResponseInformation';
import React from 'react';

/**
 * A list of the application users or accounts stored in the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function AccountList(props: {
  mineAccounts?: ApplicationUser[];
}): JSX.Element {
  const { mineAccounts = [] } = props;

  const client = new ApplicationUserServiceApi();

  const [information, setInformation] =
    React.useState<PaginationResponseInformation<ApplicationUser>>(
      new PaginationResponseInformation<ApplicationUser>());

  /**
   * An event to fetch an additional page of items.
   * @param {PaginationResponseInformation<ApplicationUser>} current
   * @return {Promise<PaginationResponseInformation<ApplicationUser>>}
   */
  async function onFetchAdditionalInformation(
    current: PaginationResponseInformation<ApplicationUser>,
  ): Promise<PaginationResponseInformation<ApplicationUser>> {
    const request: ApplicationUserServiceGetListRequest = {

    };

    if (current.nextPageToken) {
      request.pageToken = current.nextPageToken;
    }

    const response = await client.applicationUserServiceGetList(request);

    const additionalItems: ApplicationUser[] = response.items || [];

    const nextInformation: PaginationResponseInformation<ApplicationUser> =
      new PaginationResponseInformation<ApplicationUser>();

    nextInformation.items = current.items.concat(additionalItems);
    nextInformation.nextPageToken = response.nextPageToken;
    nextInformation.hasMadeAtLeastOneFetch = true;

    return nextInformation;
  }

  // this should be set using state
  let infoSorted: PaginationResponseInformation<ApplicationUser> =
    new PaginationResponseInformation<ApplicationUser>();

  if (mineAccounts.length) {
    infoSorted.items =
      information.items.sort((a, b) => {
        const aIsMineAccount =
          Boolean(mineAccounts.find((elem) => elem.id === a.id));
        const bIsMineAccount =
          Boolean(mineAccounts.find((elem) => elem.id === b.id));

        const aScore: number = aIsMineAccount ? -1 : 0;
        const bScore: number = bIsMineAccount ? 1 : 0;

        return aScore + bScore;
      });

    infoSorted.nextPageToken =
      information.nextPageToken;
    infoSorted.hasMadeAtLeastOneFetch =
      information.hasMadeAtLeastOneFetch;
  } else {
    infoSorted = information;
  }

  const listProps: ListProps<ApplicationUser> = {
    renderItem: (item: ApplicationUser, index: number) =>
      <ListItem user={item} mineAccounts={mineAccounts} />,
    itemLayout: 'vertical',
  };

  return (
    <PaginationList
      onFetchAdditionalInformation={onFetchAdditionalInformation}
      onChangeInformation={setInformation}
      information={infoSorted}
      paginationPageSize={25}
      list={listProps}
    />
  );
}
