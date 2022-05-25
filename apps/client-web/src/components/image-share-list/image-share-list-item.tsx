import {ListItem, ListItemProps} from '@mui/material';

import Image from 'next/image';
import {ImageStorageElement} from '@zukte/api-client';
import {ListChildComponentProps} from 'react-window';
import React from 'react';

export interface ImageShareListItemP
  extends ListItemProps,
    ImageStorageElement {}

/**
 * A {@link ImageListItem} view of an uploaded image.
 */
export function ImageShareListItem(
  lccp: ListChildComponentProps<ImageShareListItemP[]>
) {
  const {index, style, data} = lccp;

  if (data.length === 0) {
    return null;
  }

  const props = data[index];
  const {url, width, height, ...other} = props;

  return (
    <ListItem style={style} disablePadding {...other}>
      {url && (
        <Image
          width={width}
          height={height}
          src={url}
          layout="fill"
          alt="an uploaded image"
        />
      )}
    </ListItem>
  );
}

export default ImageShareListItem;
