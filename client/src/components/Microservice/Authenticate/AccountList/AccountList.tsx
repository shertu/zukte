import {ApplicationUser, ApplicationUserServiceApi, ApplicationUserServiceGetListRequest} from '../../../../openapi-generator';
import {IPageableListState, PageableListState} from '../../../PageableList/PageableListState';

import {AccountListItem} from './ListItem/AccountListItem';
import {PageableList} from '../../../PageableList/PageableList';
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
  const {mineAccounts} = props;

  const client = new ApplicationUserServiceApi();

  const [value, onChange] =
    React.useState<PageableListState<ApplicationUser>>(
        new PageableListState<ApplicationUser>());

  /**
   * Tigger to load the next page of data.
   *
   * @param {PageableListState<ApplicationUser>} current
   * @return {Promise<PageableListState<ApplicationUser>>}
   */
  async function onFetchNextPageAsync(
      current: PageableListState<ApplicationUser>,
  ) {
    const request: ApplicationUserServiceGetListRequest = {
    };

    const nextPageToken = current.state.nextPageToken;
    if (nextPageToken) {
      request.pageToken = nextPageToken;
    }

    const response = await client.applicationUserServiceGetList(request);

    const currentItems: ApplicationUser[] = current.state.items || [];
    const additionalItems: ApplicationUser[] = response.items || [];

    const nextValue: IPageableListState<ApplicationUser> = {
      items: currentItems.concat(additionalItems),
      nextPageToken: response.nextPageToken,
      hasMadeAtLeastOneFetch: true,
    };

    return new PageableListState<ApplicationUser>(nextValue);
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

  // order elements with mine accounts first
  let nextValueSorted: IPageableListState<ApplicationUser> | undefined;

  if (mineAccounts?.length) {
    nextValueSorted = {
      ...value.state,
    };

    nextValueSorted.items = value.state.items.sort((a, b) => {
      const aIsMineAccount =
        Boolean(mineAccounts.find((elem) => elem.id === a.id));
      const bIsMineAccount =
        Boolean(mineAccounts.find((elem) => elem.id === b.id));

      const aScore: number = aIsMineAccount ? -1 : 0;
      const bScore: number = bIsMineAccount ? 1 : 0;

      return aScore + bScore;
    });
  }

  const usedValue: PageableListState<ApplicationUser> = nextValueSorted ?
    new PageableListState<ApplicationUser>(nextValueSorted) :
    value;

  return (
    <PageableList
      onFetchNextPageAsync={onFetchNextPageAsync}
      onChange={onChange}
      value={usedValue}
      paginationPageSize={25}
      list={{
        renderItem: renderListItem,
        itemLayout: 'vertical',
      }}
    />
  );
}
