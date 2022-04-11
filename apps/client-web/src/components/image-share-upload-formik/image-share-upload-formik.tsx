import {
  ImageStorageInsertResponse,
  ImageStorageServiceApi,
} from '@zukte/api-client';

import {Formik} from 'formik';
import {ImageShareFormValues} from './image-share-upload-form/values';
import {ImageShareUploadForm} from './image-share-upload-form/image-share-upload-form';
import React from 'react';
import {noop} from 'logic/noop';
import {ZUKTE_CONFIGURATION} from 'logic/configuration/zukte';

export interface ImageShareUploadFormikProps {
  maxFileSize?: number;
  onSuccessfulUpload?: (response: ImageStorageInsertResponse[]) => void;
  className?: string;
}

/**
 * A {@link Formik} form used to upload an image to the application's image storage.
 */
export function ImageShareUploadFormik(props: ImageShareUploadFormikProps) {
  const {maxFileSize = 5242880, onSuccessfulUpload = noop} = props;
  const api = new ImageStorageServiceApi(ZUKTE_CONFIGURATION);

  return (
    <Formik
      onSubmit={(values: ImageShareFormValues, formikHelpers) => {
        const {files} = values;

        // for each file construct a promise
        const promises: Promise<ImageStorageInsertResponse>[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          const promise = api
            .imageStorageServiceInsert({
              file: file,
            })
            .catch(reason => {
              throw new Error(
                `file "${file.name}" failed to upload with reason: ${reason}`
              );
            });

          promises.push(promise);
        }

        Promise.all(promises)
          .then((responses: ImageStorageInsertResponse[]) => {
            // call hook method
            onSuccessfulUpload(responses);
          })
          .finally(() => formikHelpers.setSubmitting(false));
      }}
      initialValues={{
        files: [],
      }}
    >
      {props => <ImageShareUploadForm {...props} maxFileSize={maxFileSize} />}
    </Formik>
  );
}

export default ImageShareUploadFormik;
