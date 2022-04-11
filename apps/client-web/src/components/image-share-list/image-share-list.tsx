import {
  ImageStorageElement,
  imageStorageServiceGetListGenerator,
} from '@zukte/api-client';
import React from 'react';
import InfiniteLoader from 'react-window-infinite-loader';
import {VariableSizeList as List} from 'react-window';
import {useAsyncIterator} from 'hooks';
import {ZUKTE_CONFIGURATION} from 'business';
import ImageShareListItem, {ImageShareListItemP} from './image-share-list-item';

export interface ImageShareListP {
  /**
   * The images upload by the user.
   */
  uploaded?: ImageStorageElement[];
}

/**
 * A {@link List} view of the images stored in the application.
 */
export function ImageShareList(props: ImageShareListP) {
  const {uploaded = []} = props;

  /**
   * We use an optimised set to store the ids the images upload by the user.
   */
  const uploadedKs = new Set(uploaded.map(u => u.url));

  const [paginationV, paginationD, paginationN] = useAsyncIterator(
    imageStorageServiceGetListGenerator(
      {
        pageSizeHint: 10,
      },
      ZUKTE_CONFIGURATION
    )
  );

  /**
   * The images fetched from the server.
   */
  const images = paginationV.flatMap<ImageStorageElement>(page => page.values);

  const sorted = React.useMemo<ImageStorageElement[]>(() => {
    const filtered = images.filter(image => !uploadedKs.has(image.url));
    return [...uploaded, ...filtered];
  }, [paginationV, uploaded, uploadedKs]);

  function isItemLoaded(index: number): boolean {
    return paginationD || index < sorted.length;
  }

  const itemCount: number = paginationD ? sorted.length : sorted.length + 1;

  function itemSize(index: number): number {
    return sorted[index].height ?? 0;
  }

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={paginationN}
    >
      {({onItemsRendered, ref}) => (
        <List<ImageShareListItemP[]>
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
          height={800}
          width="100%"
          itemSize={itemSize}
          itemData={sorted}
        >
          {ImageShareListItem}
        </List>
      )}
    </InfiniteLoader>
  );
}

export default ImageShareList;
