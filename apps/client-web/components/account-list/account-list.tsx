import {
  ApplicationUser,
  ApplicationUserServiceApi,
  ApplicationUserServiceGetListRequest,
} from '@zukte/api-client';
import {
  InfiniteScrollList,
  InfiniteScrollListValue,
} from '../infinite-scroll-list/infinite-scroll-list';

import {AccountListItem} from './list-item/list-item';
import React from 'react';
import config from '../../lib/zukte-api-client-configuration/zukte-api-client-configuration';

export interface AccountListProps {
  mineAccounts?: ApplicationUser[];
}

/**
 * A list of the application users or accounts stored in the application.
 */
export function AccountList(props: AccountListProps) {
  const {mineAccounts} = props;

  const client = new ApplicationUserServiceApi(config);

  const [value, onChange] = React.useState<
    InfiniteScrollListValue<ApplicationUser>
  >({
    items: [],
  });

  /**
   * Tigger to load the next page of data.
   */
  async function onFetchNextPageAsync(
    current: InfiniteScrollListValue<ApplicationUser>
  ): Promise<InfiniteScrollListValue<ApplicationUser>> {
    const request: ApplicationUserServiceGetListRequest = {};

    const nextPageToken = current.nextPageToken;
    if (nextPageToken) {
      request.pageToken = nextPageToken;
    }

    const response = await client.applicationUserServiceGetList(request);

    const currentItems: ApplicationUser[] = current.items || [];
    const additionalItems: ApplicationUser[] = response.items || [];

    const nextValue: InfiniteScrollListValue<ApplicationUser> = {
      items: currentItems.concat(additionalItems),
      nextPageToken: response.nextPageToken,
      hasMadeAtLeastOneFetch: true,
    };

    return nextValue;
  }

  /**
   * A display name wrapper for the account list item component.
   */
  function renderListItem(
    item: ApplicationUser,
    index: number
  ): React.ReactNode {
    return <AccountListItem user={item} mineAccounts={mineAccounts} />;
  }

  // order elements with mine accounts first
  const sorted: InfiniteScrollListValue<ApplicationUser> = {
    ...value,
  };

  if (mineAccounts?.length && value.items) {
    sorted.items = value.items.sort((a, b) => {
      const aIsMineAccount = Boolean(
        mineAccounts.find(elem => elem.id === a.id)
      );
      const bIsMineAccount = Boolean(
        mineAccounts.find(elem => elem.id === b.id)
      );

      const aScore: number = aIsMineAccount ? -1 : 0;
      const bScore: number = bIsMineAccount ? 1 : 0;

      return aScore + bScore;
    });
  }

  return (
    <InfiniteScrollList<ApplicationUser>
      value={sorted}
      onChange={onChange}
      onFetchNextPageAsync={onFetchNextPageAsync}
      paginationPageSize={25}
      render={renderListItem}
    />
  );
}
