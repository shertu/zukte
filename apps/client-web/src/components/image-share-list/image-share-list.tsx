import ImageShareListItem, {ImageShareListItemP} from './image-share-list-item';
import {
  ImageStorageElement,
  ImageStorageGetListGenerator,
} from '@zukte/api-client';

import InfiniteLoader from 'react-window-infinite-loader';
import {VariableSizeList as List} from 'react-window';
import React from 'react';
import {ZUKTE_CONFIGURATION} from 'business';
import {useAsyncIterator} from 'hooks';

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
  const uploadedKs = React.useMemo<Set<string>>(() => {
    const set = new Set<string>();
    uploaded.forEach(({url}) => {
      if (url) {
        set.add(url);
      }
    });
    return set;
  }, [uploaded]);

  const [paginationV, paginationD, paginationN] = useAsyncIterator(
    ImageStorageGetListGenerator(
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
    const filtered = images.filter(({url}) => url && !uploadedKs.has(url));
    const combined = [...uploaded, ...filtered];
    return combined.sort(({id: a = 0}, {id: b = 0}) => b - a);
  }, [images, uploaded, uploadedKs]);

  /**
   * Has the item at the specified index been fetched?
   */
  function isItemLoaded(index: number): boolean {
    return paginationD || index < sorted.length;
  }

  const itemCount: number = paginationD ? sorted.length : sorted.length + 1;

  const itemSize = React.useCallback(
    (index: number) => {
      const element = sorted[index];

      if (element) {
        const {width = 0, height = 0} = element;

        if (width) {
          const scalarX: number = 960 / width;
          const scalar: number = Math.min(scalarX, 1);
          return height * scalar;
        }
      }

      return 32;
    },
    [sorted]
  );

  const itemData: ImageShareListItemP[] = sorted.map<ImageShareListItemP>(
    element => ({
      imageStorageElement: element,
    })
  );

  return (
    <InfiniteLoader
      key={sorted.length}
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
          itemData={itemData}
        >
          {ImageShareListItem}
        </List>
      )}
    </InfiniteLoader>
  );
}

export default ImageShareList;
