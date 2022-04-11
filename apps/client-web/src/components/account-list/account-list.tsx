import {
  ApplicationUser,
  applicationUserServiceGetListGenerator,
} from '@zukte/api-client';
import React from 'react';
import InfiniteLoader from 'react-window-infinite-loader';
import {FixedSizeList as List} from 'react-window';
import {AccountListItem, AccountListItemP} from './account-list-item';
import {useAsyncIterator} from 'hooks';
import {ZUKTE_CONFIGURATION} from 'business';

export interface AccountListP {
  /**
   * The accounts which are authenticated with the user.
   */
  mine?: ApplicationUser[];
}

/**
 * A {@link List} view of the accounts stored in the application.
 */
export function AccountList(props: AccountListP) {
  const {mine = []} = props;

  /**
   * We use an optimised set to store the ids the accounts which are authenticated with the user.
   */
  const mineKs = new Set(mine.map(m => m.id));

  const [paginationV, paginationD, paginationN] = useAsyncIterator(
    applicationUserServiceGetListGenerator(
      {
        pageSizeHint: 30,
      },
      ZUKTE_CONFIGURATION
    )
  );

  /**
   * The accounts fetched from the server.
   */
  const accounts = paginationV.flatMap<ApplicationUser>(page => page.values);

  const sorted = React.useMemo<ApplicationUser[]>(() => {
    const filtered = accounts.filter(account => !mineKs.has(account.id));
    return [...mine, ...filtered];
  }, [paginationV, mine, mineKs]);

  function isItemLoaded(index: number): boolean {
    return paginationD || index < sorted.length;
  }

  const itemData: AccountListItemP[] = sorted.map<AccountListItemP>(
    account => ({
      account: account,
      deleteSecondaryAction: mineKs.has(account.id),
    })
  );

  const itemCount: number = paginationD ? sorted.length : sorted.length + 1;

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={paginationN}
    >
      {({onItemsRendered, ref}) => (
        <List<AccountListItemP[]>
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
          height={800}
          width="100%"
          itemSize={100}
          itemData={itemData}
        >
          {AccountListItem}
        </List>
      )}
    </InfiniteLoader>
  );
}

export default AccountList;
