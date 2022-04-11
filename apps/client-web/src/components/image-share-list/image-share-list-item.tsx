import {ListItem, ListItemProps} from '@mui/material';
import Image from 'next/image';

import React from 'react';
import {ListChildComponentProps} from 'react-window';

export interface ImageShareListItemP extends ListItemProps {
  url: string;
}

/**
 * A {@link ImageListItem} view of an uploaded image.
 */
export function ImageShareListItem(
  lccp: ListChildComponentProps<ImageShareListItemP[]>
) {
  const {index, style, data} = lccp;
  const props = data[index];
  const {url, ...other} = props;

  return (
    <ListItem style={style} disablePadding {...other}>
      <Image src={url} layout="fill" />
    </ListItem>
  );
}

export default ImageShareListItem;
