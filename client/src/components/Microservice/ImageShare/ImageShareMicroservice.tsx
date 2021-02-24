import {IPageableListState, PageableListState} from '../../PageableList/PageableListState';
import {ImageShareFormValues, UploadImageForm} from './UploadImageForm/UploadImageForm';
import {ImageStorageInsertResponse, ImageStorageServiceApi} from '../../../openapi-generator';

import {AppPage} from '../../AppPage/AppPage';
import {ImageShareList} from './ImageShareList/ImageShareList';
import React from 'react';
import {Typography} from 'antd';

const {Paragraph, Text} = Typography;

const MAX_FILE_SIZE: number = 5000000; // bytes = 5 MB

/**
 * A demonstration where the user can upload
 * and share images with other users.
 *
 * @return {JSX.Element}
 */
export function ImageShareMicroservice(): JSX.Element {
  const MAX_FILE_SIZE_MB: string = (MAX_FILE_SIZE / 1000000).toFixed(2);

  const client = new ImageStorageServiceApi();

  const [images, setImages] =
    React.useState<PageableListState<string>>(
        new PageableListState<string>());

  const [uploading, setUploading] =
    React.useState<boolean>(false);

  const [uploadError, setUploadError] =
    React.useState<boolean>(false);

  /**
   * Trigger after submitting the form
   * and verifying data successfully.
   *
   * @param {ImageShareFormValues} values
   */
  function onFinishUploadForm(values: ImageShareFormValues): void {
    const files = values.files ?? [];

    for (let i = 0; i < files.length; i++) {
      setUploading(true);
      const element: File = files[i];

      client.imageStorageServiceInsert({
        image: element,
      }).then((response: ImageStorageInsertResponse) => {
        if (onSuccessfulUpload) {
          onSuccessfulUpload(response.insertedImageUrl);
        }

        setUploading(false);
      }).catch((err) => {
        setUploadError(true);
        setUploading(false);
      });
    }
  };

  /**
   * A hook to prepend the uploaded image to the image item collection.
   *
   * @param {string} url
   */
  function onSuccessfulUpload(url: string | null | undefined): void {
    if (url) {
      const nextImages: IPageableListState<string> = {
        ...images.state,
        items: [url, ...images.state.items],
      };

      const nextValue = new PageableListState<string>(nextImages);
      setImages(nextValue);
    }
  }

  return (
    <AppPage pageTitle="Image Share Demo">
      <Typography>
        <Paragraph>
          To use this demo service please click
          or drag images into the upload area;
          each image is required to be smaller than
          {MAX_FILE_SIZE_MB} MB.
          You <Text strong>cannot</Text> delete
          an image once it is uploaded.
        </Paragraph>
      </Typography>

      <UploadImageForm
        onFinish={onFinishUploadForm}
        maximumFileSize={MAX_FILE_SIZE}
        uploading={uploading}
        onFinishError={uploadError}
      />

      <AppPage pageTitle="Uploaded Images">
        <ImageShareList
          value={images}
          onChange={setImages}
        />
      </AppPage>
    </AppPage >
  );
}
