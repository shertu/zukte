import {AccountListItem, AccountListItemP} from './account-list-item';
import {
  ApplicationUser,
  ApplicationUserGetListGenerator,
} from '@zukte/api-client';
import {ZUKTE_CONFIGURATION, isSuperuser} from 'business';

import InfiniteLoader from 'react-window-infinite-loader';
import {FixedSizeList as List} from 'react-window';
import React from 'react';
import {useAsyncIterator} from 'hooks';

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

  const mineKs = React.useMemo<Set<string>>(() => {
    const set = new Set<string>();
    mine.forEach(({id}) => {
      if (id) {
        set.add(id);
      }
    });
    return set;
  }, [mine]);

  let superuser = false;
  mineKs.forEach(mineK => {
    if (isSuperuser(mineK)) {
      superuser = true;
    }
  });

  const [paginationV, paginationD, paginationN] = useAsyncIterator(
    ApplicationUserGetListGenerator(
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
    const filtered = accounts.filter(({id}) => id && !mineKs.has(id));
    return [...mine, ...filtered];
  }, [accounts, mine, mineKs]);

  /**
   * Has the item at the specified index been fetched?
   */
  function isItemLoaded(index: number): boolean {
    return paginationD || index < sorted.length;
  }

  const itemData: AccountListItemP[] = sorted.map<AccountListItemP>(
    account => ({
      account: account,
      deleteSecondaryAction:
        (account.id ? mineKs.has(account.id) : false) || superuser,
    })
  );

  const itemCount: number = paginationD ? sorted.length : sorted.length + 1;

  return (
    <InfiniteLoader
      key={sorted.length}
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
