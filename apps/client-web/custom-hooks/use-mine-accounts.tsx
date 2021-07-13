import {
  ApplicationUser,
  ApplicationUserServiceApi,
  ApplicationUserServiceGetListRequest,
} from '@zukte/api-client';
import {
  InfiniteScrollListValue,
  isPotentialForMore,
} from '../components/infinite-scroll-list/infinite-scroll-list';

import React from 'react';
import config from '../lib/zukte-api-client-configuration/zukte-api-client-configuration';

export function useMineAccounts(): InfiniteScrollListValue<ApplicationUser> {
  const client = new ApplicationUserServiceApi(config);

  const [mineAccounts, setMineAccounts] = React.useState<
    InfiniteScrollListValue<ApplicationUser>
  >({
    items: [],
  });

  const [errorOccur, setErrorOccur] = React.useState<boolean>(false);

  const potential: boolean = isPotentialForMore(mineAccounts);

  /** An automatic trigger to fetch additional items. */
  React.useEffect(() => {
    if (potential && !errorOccur) {
      onFetchNextPage(mineAccounts)
        .then(response => setMineAccounts(response))
        .catch(() => setErrorOccur(true));
    }
  }, [potential, errorOccur]);

  /**
   * Tigger to load the next page of data.
   */
  async function onFetchNextPage(
    current: InfiniteScrollListValue<ApplicationUser>
  ): Promise<InfiniteScrollListValue<ApplicationUser>> {
    const request: ApplicationUserServiceGetListRequest = {
      mine: true,
    };

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

  return mineAccounts;
}
