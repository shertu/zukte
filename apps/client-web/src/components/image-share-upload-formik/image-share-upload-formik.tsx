import {
  ImageShareUploadForm,
  ImageShareUploadFormP,
} from './image-share-upload-form/image-share-upload-form';
import {ImageStorageApi, ImageStorageElement} from '@zukte/api-client';
import {ZUKTE_CONFIGURATION, noop} from 'business';

import {Formik} from 'formik';
import {ImageShareFormV} from './image-share-upload-form/values';
import React from 'react';

export interface ImageShareUploadFormikP {
  /**
   * Maximum file size (in bytes) that the form will accept.
   */
  maxFileSize?: ImageShareUploadFormP['maxFileSize'];

  /**
   * The hook called after the form is succesfully submitted and the server receives the responses.
   */
  onSuccessHook?: (response: ImageStorageElement[]) => void;
}

/**
 * A {@link Formik} form used to upload an image to the application's image storage.
 */
export function ImageShareUploadFormik(props: ImageShareUploadFormikP) {
  const {maxFileSize = 5242880, onSuccessHook = noop} = props;
  const api = new ImageStorageApi(ZUKTE_CONFIGURATION);

  return (
    <Formik
      onSubmit={(values: ImageShareFormV, formikHelpers) => {
        const {files} = values;

        // for each file construct a promise
        const promises: Promise<ImageStorageElement>[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          const promise = api
            .imageStorageInsert({
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
          .then((responses: ImageStorageElement[]) => {
            // call hook method
            onSuccessHook(responses);
          })
          .finally(() => formikHelpers.setSubmitting(false));
      }}
      initialValues={{
        files: [],
      }}
    >
      {formikProps => (
        <ImageShareUploadForm {...formikProps} maxFileSize={maxFileSize} />
      )}
    </Formik>
  );
}

export default ImageShareUploadFormik;
