import {AppPage, ImageShareList, ImageShareUploadFormik} from 'components';
import {Divider, Typography} from '@mui/material';

import {ImageStorageElement} from '@zukte/api-client';
import React from 'react';

export interface ImageShareMicroservicePageP {
  maxFileSize?: number;
}

/**
 * An {@link AppPage} where the user can sign in to the application
 * and view accounts in the application.
 */
export function ImageShareMicroservicePage(props: ImageShareMicroservicePageP) {
  const {maxFileSize = 5242880} = props; // bytes = 5 MB
  const [uploaded, setUploaded] = React.useState<ImageStorageElement[]>([]);

  /**
   * A hook to prepend the uploaded images to the image item collection.
   */
  function onSuccessfulUpload(responses: ImageStorageElement[]) {
    setUploaded([...responses, ...uploaded]);
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
          onSuccessHook={onSuccessfulUpload}
        />
      </div>

      <Divider className="my-5" />
      <ImageShareList uploaded={uploaded} />
    </AppPage>
  );
}

export default ImageShareMicroservicePage;
