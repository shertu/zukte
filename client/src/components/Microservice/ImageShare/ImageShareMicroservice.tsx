import { IPageableListState, PageableListState } from '../../PageableList/PageableListState';

import { AppPage } from '../../AppPage/AppPage';
import { ImageShareList } from './ImageShareList/ImageShareList';
import React from 'react';
import { Typography } from 'antd';

const { Paragraph, Text } = Typography;

const MAX_FILE_SIZE: number = 5000000; // bytes = 5 MB

/**
 * A demonstration where the user can upload and share images with others.
 *
 * @return {JSX.Element}
 */
export function ImageShareMicroservice(): JSX.Element {
  const MAX_FILE_SIZE_MB: string = (MAX_FILE_SIZE / 1000000).toFixed(2);

  const [images, setImages] =
    React.useState<PageableListState<string>>(
      new PageableListState<string>());

  /**
   * A hook to prepend the uploaded image to the image item collection.
   *
   * @param {string} url
   */
  function onChangeUploadImageUrl(url: string | null | undefined): void {
    if (url) {
      const nextImages: IPageableListState<string> = {
        ...images.state,
        items: [url, ...images.state.items],
      }

      const nextValue = new PageableListState<string>(nextImages);
      setImages(nextValue);
    }
  }

  return (
    <AppPage pageTitle="Image Share Demo">
      <Typography>
        <Paragraph>
          To use this demo service please click or drag images into the upload area;
          each image is required to be smaller than {MAX_FILE_SIZE_MB} MB.
          You <Text strong>cannot</Text> delete an image once it is uploaded.
        </Paragraph>
      </Typography>

      <AppPage pageTitle="Uploaded Images">
        <ImageShareList
          value={images}
          onChange={setImages}
        />
      </AppPage>
    </AppPage >
  );
}
