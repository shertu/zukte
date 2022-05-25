import {
  ApplicationUser,
  Page,
  applicationUserServiceGetListGenerator,
} from '@zukte/api-client';

import React from 'react';

type P = Page<ApplicationUser>;

/**
 * Uses an {@link applicationUserServiceGetListGenerator} to fetch all of the user's accounts.
 */
async function _h() {
  const generator = applicationUserServiceGetListGenerator({
    mine: true,
    pageSizeHint: 5,
  });
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
