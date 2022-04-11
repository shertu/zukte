import React from 'react';
import InfiniteLoader from 'react-window-infinite-loader';
import {VariableSizeList as List} from 'react-window';
import {imageStorageServiceGetListGenerator} from '@zukte/api-client';
import {useAsyncIterator} from 'hooks';
import {ZUKTE_CONFIGURATION} from 'business';
import ImageShareListItem, {ImageShareListItemP} from './image-share-list-item';

export interface ImageShareListP {
  uploaded?: string[];
}

/**
 * A {@link ImageList} view used in the image share microservice.
 */
export function ImageShareList(props: ImageShareListP) {
  const {uploaded = []} = props;
  const uploadedset = new Set(uploaded);

  const [generator] = React.useState(
    imageStorageServiceGetListGenerator(
      {
        pageSizeHint: 10,
      },
      ZUKTE_CONFIGURATION
    )
  );

  const [pages, done, next] = useAsyncIterator(generator);

  const items = React.useMemo<string[]>(() => {
    const _items = pages.flatMap(p => p.values);
    const filtered = _items.filter(v => !uploadedset.has(v));
    return [...uploaded, ...filtered];
  }, [pages, uploaded]);

  function isItemLoaded(index: number): boolean {
    return done || index < items.length;
  }

  const itemData: ImageShareListItemP[] = items.map<ImageShareListItemP>(v => ({
    url: v,
  }));

  const itemCount: number = done ? items.length : items.length + 1;

  function itemSize(): number {
    // console.log('itemSize', index);
    return 800;
  }

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={next}
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
