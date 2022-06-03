import {
  ApplicationUser,
  ApplicationUserGetListGenerator,
  Page,
} from '@zukte/api-client';

import React from 'react';
import {ZUKTE_CONFIGURATION} from 'business';

type P = Page<ApplicationUser>;

/**
 * Uses an {@link applicationUserServiceGetListGenerator} to fetch all of the user's accounts.
 */
async function _h() {
  const generator = ApplicationUserGetListGenerator(
    {
      mine: true,
      pageSizeHint: 5,
    },
    ZUKTE_CONFIGURATION
  );
  const pages: P[] = [];
  for await (const page of generator) {
    pages.push(page);
  }
  return pages;
}

/**
 * A custom hook to fetch all of the user's accounts.
 */
export function useMineAccounts(): ApplicationUser[] {
  const [ps, setPs] = React.useState<P[]>([]);
  React.useEffect(() => {
    _h()
      .then(pages => setPs(pages))
      .catch((response: Response) => {
        if (response.status !== 401) {
          throw response;
        }
      });
  }, []);
  return ps.flatMap(p => p.values);
}
