import {Button, Form, message} from 'antd';
import {
  ImageStorageInsertResponse,
  ImageStorageServiceApi,
} from '../../../../openapi-generator';

import {MockUpload} from './MockUpload/MockUpload';
import React from 'react';

export interface ImageShareFormValues {
  files: File[];
}

/**
 * Used to upload an image to the application's image share container.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function UploadImageForm(props: {
  maximumFileSize: number;
  onSuccessfulUpload?: (response: ImageStorageInsertResponse[]) => void;
  className?: string;
}): JSX.Element {
  const {className, maximumFileSize, onSuccessfulUpload} = props;

  const client = new ImageStorageServiceApi();

  const [uploading, setUploading] = React.useState<boolean>(false);

  /**
   * Trigger after submitting the form
   * and verifying data successfully.
   *
   * @param {ImageShareFormValues} values
   */
  function onFinishUploadForm(values: ImageShareFormValues): void {
    const files = values.files ?? [];

    const promises: Promise<ImageStorageInsertResponse>[] = [];

    for (let i = 0; i < files.length; i++) {
      const element: File = files[i];

      const promise = client
        .imageStorageServiceInsert({
          image: element,
        })
        .catch((reason: any) => {
          message.error(
            `file ${element.name} failed to 
          upload with status ${reason?.status}`
          );
          return reason;
        });

      promises.push(promise);
    }

    setUploading(true);

    Promise.all(promises)
      .then((responses: ImageStorageInsertResponse[]) => {
        // stop the upload symbol
        setUploading(false);

        // call hook method
        if (onSuccessfulUpload) {
          onSuccessfulUpload(responses);
        }
      })
      .catch(() => {
        setUploading(false);
      });
  }

  return (
    <Form onFinish={onFinishUploadForm} className={className}>
      <Form.Item name="files">
        <MockUpload maximumFileSize={maximumFileSize} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={uploading}>
          upload
        </Button>
      </Form.Item>
    </Form>
  );
}
