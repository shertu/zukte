import {ListItem, ListItemProps} from '@mui/material';
import {ImageStorageElement} from '@zukte/api-client';
import Image from 'next/image';

import React from 'react';
import {ListChildComponentProps} from 'react-window';

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
  const props = data[index];
  const {url, width, height, ...other} = props;

  return (
    <ListItem style={style} disablePadding {...other}>
      {url && <Image width={width} height={height} src={url} layout="fill" />}
    </ListItem>
  );
}

export default ImageShareListItem;
