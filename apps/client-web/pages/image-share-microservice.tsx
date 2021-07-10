import {
  IPageableListState,
  PageableListState,
} from '../components/infinite-scroll-list/pageable-list-state';

import {AppPage} from '../components/app-page/app-page';
import {ImageShareList} from '../components/image-share-list/image-share-list';
import {ImageStorageInsertResponse} from '../../../openapi-generator';
import React from 'react';
import {Typography} from 'antd';
import {UploadImageForm} from '../components/upload-image-form/UploadImageForm';

const {Paragraph, Text} = Typography;

const MAX_FILE_SIZE = 5000000; // bytes = 5 MB

/**
 * A demonstration where the user can upload
 * and share images with other users.
 */
export function ImageShareMicroservice() {
  const MAX_FILE_SIZE_MB: string = (MAX_FILE_SIZE / 1000000).toFixed(2);

  const [images, setImages] = React.useState<PageableListState<string>>(
    new PageableListState<string>()
  );

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

    const nextImages: IPageableListState<string> = {
      ...images.state,
      items: [...additionalUrls, ...images.state.items],
    };

    const nextValue = new PageableListState<string>(nextImages);
    setImages(nextValue);
  }

  return (
    <AppPage pageTitle="Image Share Demo">
      <Typography>
        <Paragraph>
          To use this demo service please click or drag images into the upload
          area; each image is required to be smaller than {MAX_FILE_SIZE_MB} MB.
          You <Text strong>cannot</Text> delete an image once it is uploaded.
        </Paragraph>
      </Typography>

      <div style={{padding: '2em 24px'}}>
        <UploadImageForm
          maximumFileSize={MAX_FILE_SIZE}
          onSuccessfulUpload={onSuccessfulUpload}
        />
      </div>

      <AppPage pageTitle="Uploaded Images">
        <ImageShareList value={images} onChange={setImages} />
      </AppPage>
    </AppPage>
  );
}
