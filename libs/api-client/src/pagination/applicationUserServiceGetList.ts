import {
  ApplicationUser,
  ApplicationUserServiceApi,
  ApplicationUserServiceGetListRequest,
  Configuration,
} from '../openapi-generator';

import {Page} from './page';

type P = Page<ApplicationUser>;

/**
 * An async generator for applicaton user pages.
 */
export async function* applicationUserServiceGetListGenerator(
  request: ApplicationUserServiceGetListRequest,
  configuration?: Configuration
): AsyncGenerator<P> {
  const {continuationToken, pageSizeHint = 0} = request;
  const api = new ApplicationUserServiceApi(configuration);

  let current: P = {
    continuationToken: continuationToken,
    values: [],
  };

  do {
    const response = await api.applicationUserServiceGetList({
      ...request,
      continuationToken: current.continuationToken,
      pageSizeHint: pageSizeHint,
    });

    current = {
      continuationToken: response.continuationToken,
      values: response.items ?? [],
    };

    if (current.values.length > 0) {
      yield current;
    }
  } while (current.values.length > 0 && current.values.length >= pageSizeHint);
}
