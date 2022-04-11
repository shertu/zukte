import {AppPage, ImageShareList, ImageShareUploadFormik} from 'components';
import {Divider, Typography} from '@mui/material';

import {ImageStorageInsertResponse} from '@zukte/api-client';
import React from 'react';

export interface ImageShareMicroservicePageProps {
  maxFileSize?: number;
}

/**
 * An {@link AppPage} where the user can sign in to the application
 * and view accounts in the application.
 */
export function ImageShareMicroservicePage(
  props: ImageShareMicroservicePageProps
) {
  const {maxFileSize = 5242880} = props; // bytes = 5 MB
  const [uploaded, setUploaded] = React.useState<string[]>([]);

  /**
   * A hook to prepend the uploaded image to the image item collection.
   */
  function onSuccessfulUpload(responses: ImageStorageInsertResponse[]) {
    const additionalUrls: string[] = [];
    responses.forEach((r: ImageStorageInsertResponse) => {
      if (r.url) {
        additionalUrls.push(r.url);
      }
    });
    setUploaded([...additionalUrls, ...uploaded]);
  }

  return (
    <AppPage>
      <Typography>
        To use this service please click or drag images into the upload area;
        each image is required to be smaller than&nbsp;
        {maxFileSize} bytes. You <strong>cannot</strong>
        &nbsp;delete an image once it is uploaded.
      </Typography>

      <div className="p-5">
        <ImageShareUploadFormik
          maxFileSize={maxFileSize}
          onSuccessfulUpload={onSuccessfulUpload}
        />
      </div>

      <Divider className="my-5" />
      <ImageShareList uploaded={uploaded} />
    </AppPage>
  );
}

export default ImageShareMicroservicePage;
