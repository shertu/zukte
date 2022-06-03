import {
  Configuration,
  ImageStorageApi,
  ImageStorageElement,
  ImageStorageGetListRequest,
} from '../openapi-generator';

import {Page} from './page';

type P = Page<ImageStorageElement>;

/**
 * An async generator for image storage pages.
 */
export async function* ImageStorageGetListGenerator(
  request: ImageStorageGetListRequest,
  configuration?: Configuration
): AsyncGenerator<P> {
  const {continuationToken, pageSizeHint = 0} = request;
  const api = new ImageStorageApi(configuration);

  let current: P = {
    continuationToken: continuationToken,
    values: [],
  };

  do {
    const response = await api.imageStorageGetList({
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
