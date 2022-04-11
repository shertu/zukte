import {
  Configuration,
  ImageStorageElement,
  ImageStorageServiceApi,
  ImageStorageServiceGetListRequest,
} from '../openapi-generator';
import {Page} from './page';

type P = Page<ImageStorageElement>;

export async function* imageStorageServiceGetListGenerator(
  request: ImageStorageServiceGetListRequest,
  configuration?: Configuration
): AsyncGenerator<P> {
  const {continuationToken, pageSizeHint = 0} = request;
  const api = new ImageStorageServiceApi(configuration);

  let current: P = {
    values: [],
    continuationToken: continuationToken,
  };

  do {
    const response = await api.imageStorageServiceGetList({
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
