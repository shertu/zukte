import {ApplicationUser, ApplicationUserServiceApi, ApplicationUserServiceGetListRequest} from '../../../../openapi-generator';

import {AccountListItem} from './ListItem/AccountListItem';
import {ListProps} from 'antd';
import {PaginationList} from '../../../PaginationList/PaginationList';
import {PaginationListInformation} from '../../../PaginationList/PaginationListInformation';
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
  const {mineAccounts = []} = props;

  const client = new ApplicationUserServiceApi();

  const [information, setInformation] =
    React.useState<PaginationListInformation<ApplicationUser>>(
        new PaginationListInformation<ApplicationUser>());

  /**
   * An event to fetch an additional page of items.
   * @param {PaginationListInformation<ApplicationUser>} current
   * @return {Promise<PaginationListInformation<ApplicationUser>>}
   */
  async function onFetchAdditionalInformation(
      current: PaginationListInformation<ApplicationUser>,
  ): Promise<PaginationListInformation<ApplicationUser>> {
    const request: ApplicationUserServiceGetListRequest = {

    };

    if (current.nextPageToken) {
      request.pageToken = current.nextPageToken;
    }

    const response = await client.applicationUserServiceGetList(request);

    const additionalItems: ApplicationUser[] = response.items || [];

    const nextInformation: PaginationListInformation<ApplicationUser> =
      new PaginationListInformation<ApplicationUser>();

    nextInformation.items = current.items.concat(additionalItems);
    nextInformation.nextPageToken = response.nextPageToken;
    nextInformation.hasMadeAtLeastOneFetch = true;

    return nextInformation;
  }

  // this should be set using state
  let infoSorted: PaginationListInformation<ApplicationUser> =
    new PaginationListInformation<ApplicationUser>();

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

  /**
   * A display name wrapper for the account list item component.
   * @param {ApplicationUser} item
   * @param {string} index
   * @return {JSX.Element}
   */
  function renderListItem(item: ApplicationUser, index: number): JSX.Element {
    return (
      <AccountListItem user={item} mineAccounts={mineAccounts} />
    );
  }

  const listProps: ListProps<ApplicationUser> = {
    renderItem: renderListItem,
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
