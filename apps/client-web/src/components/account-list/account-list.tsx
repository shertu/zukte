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
  mine?: ApplicationUser[];
}

/**
 * A {@link List} view of the accounts stored in the application.
 */
export function AccountList(props: AccountListP) {
  const {mine = []} = props;
  const mineidset = new Set(mine.map(v => v.id));

  const [generator] = React.useState(
    applicationUserServiceGetListGenerator(
      {
        pageSizeHint: 30,
      },
      ZUKTE_CONFIGURATION
    )
  );

  const [pages, done, next] = useAsyncIterator(generator);

  const items = React.useMemo<ApplicationUser[]>(() => {
    const pValues = pages.flatMap(p => p.values);
    const filtered = pValues.filter(v => !mineidset.has(v.id));
    return [...mine, ...filtered];
  }, [pages, mine, mineidset]);

  function isItemLoaded(index: number): boolean {
    return done || index < items.length;
  }

  const itemData: AccountListItemP[] = items.map<AccountListItemP>(v => ({
    account: v,
    deleteSecondaryAction: mineidset.has(v.id),
  }));

  const itemCount: number = done ? items.length : items.length + 1;

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={next}
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
