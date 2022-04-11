import {
  ApplicationUser,
  ApplicationUserServiceApi,
  ApplicationUserServiceGetListRequest,
  Configuration,
} from '../openapi-generator';
import {Page} from './page';

type P = Page<ApplicationUser>;

export async function* applicationUserServiceGetListGenerator(
  request: ApplicationUserServiceGetListRequest,
  configuration?: Configuration
): AsyncGenerator<P> {
  const {continuationToken, pageSizeHint = 0} = request;
  const api = new ApplicationUserServiceApi(configuration);

  let current: P = {
    values: [],
    continuationToken: continuationToken,
  };

  do {
    const response = await api.applicationUserServiceGetList({
      ...request,
      pageSizeHint: pageSizeHint,
      continuationToken: current.continuationToken,
    });

    current = {
      values: response.items ?? [],
      continuationToken: response.continuationToken,
    };

    if (current.values.length > 0) {
      yield current;
    }
  } while (current.values.length > 0 && current.values.length >= pageSizeHint);
}
