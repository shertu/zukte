import {AppHeader} from '../components/app-header/app-header';
import {AppPage} from '../components/app-page/app-page';
import {ImageShareList} from '../components/image-share-list/image-share-list';
import {ImageStorageInsertResponse} from '@zukte/api-client';
import {InfiniteScrollListValue} from '../components/infinite-scroll-list/infinite-scroll-list';
import React from 'react';
import {Typography} from '@material-ui/core';
import {UploadImageForm} from '../components/upload-image-form/UploadImageForm';

const MAX_FILE_SIZE = 5000000; // bytes = 5 MB

/**
 * A demonstration where the user can upload
 * and share images with other users.
 */
export function ImageShareMicroservice() {
  const MAX_FILE_SIZE_MB: string = (MAX_FILE_SIZE / 1000000).toFixed(2);

  const [images, setImages] = React.useState<InfiniteScrollListValue<string>>({
    items: [],
  });

  /**
   * A hook to prepend the uploaded image to the image item collection.
   */
  function onSuccessfulUpload(responses: ImageStorageInsertResponse[]) {
    const additionalUrls: string[] = [];

    responses.forEach((element: ImageStorageInsertResponse) => {
      const {insertedImageUrl} = element;

      if (insertedImageUrl) {
        additionalUrls.push(insertedImageUrl);
      }
    });

    const nextValue: InfiniteScrollListValue<string> = {
      ...images,
      items: [...additionalUrls, ...(images.items ?? [])],
    };

    setImages(nextValue);
  }

  return (
    <>
      <AppHeader />
      <AppPage pageTitle="Image Share Demo">
        <Typography>
          To use this demo service please click or drag images into the upload
          area; each image is required to be smaller than {MAX_FILE_SIZE_MB} MB.
          You <strong>cannot</strong> delete an image once it is uploaded.
        </Typography>

        <div style={{padding: '2em 24px'}}>
          {/* <UploadImageForm
          maximumFileSize={MAX_FILE_SIZE}
          onSuccessfulUpload={onSuccessfulUpload}
        /> */}
        </div>

        <AppPage pageTitle="Uploaded Images">
          <ImageShareList value={images} onChange={setImages} />
        </AppPage>
      </AppPage>
    </>
  );
}

export default ImageShareMicroservice;
