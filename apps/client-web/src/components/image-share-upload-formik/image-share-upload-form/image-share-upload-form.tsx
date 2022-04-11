import {Button, FormControl, FormHelperText} from '@mui/material';
import {ImageShareFormV, fnFiles} from './values';

import {DropzoneArea, DropzoneAreaBaseProps} from 'mui-file-dropzone';
import {FormikProps} from 'formik';
import React from 'react';

export interface ImageShareUploadFormP extends FormikProps<ImageShareFormV> {
  maxFileSize?: DropzoneAreaBaseProps['maxFileSize'];
}

/** The underlying form component. */
export function ImageShareUploadForm(props: ImageShareUploadFormP) {
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    maxFileSize,
  } = props;

  /** Handle the event of files being added or removed. */
  function onChangeDropzoneArea(files: File[]) {
    setFieldValue(fnFiles, files);
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <FormControl
        fullWidth
        error={touched.files && !!errors.files}
        className="mb-4"
      >
        <DropzoneArea
          acceptedFiles={['image/png']}
          maxFileSize={maxFileSize}
          inputProps={{
            name: fnFiles,
            onBlur: handleBlur,
          }}
          onChange={onChangeDropzoneArea}
          initialFiles={values.files}
          fileObjects={null}
        />

        <FormHelperText>{touched.files && errors.files}</FormHelperText>
      </FormControl>

      <FormControl fullWidth className="items-end">
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          disabled={isSubmitting}
        >
          submit
        </Button>
      </FormControl>
    </form>
  );
}
