import {Button, Form, Row, Space} from 'antd';

import {MockUpload} from './MockUpload/MockUpload';
import React from 'react';
import {Rfc7807Alert} from '../../../Rfc7807Alert/Rfc7807Alert';

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
  onFinish?: (values: ImageShareFormValues) => void;
  onFinishError?: boolean;
  uploading?: boolean;
  maximumFileSize: number;
}): JSX.Element {
  const {onFinish, onFinishError, uploading, maximumFileSize} = props;

  return (
    <Space direction="vertical" className="max-cell">
      <Form
        onFinish={onFinish}
      >
        <Form.Item
          name="files"
        >
          <MockUpload maximumFileSize={maximumFileSize} />
        </Form.Item>

        <Row justify="end">
          <Button
            type="primary"
            htmlType="submit"
            loading={uploading}
          >
            upload
          </Button>
        </Row>
      </Form >

      {onFinishError &&
        <Rfc7807Alert
          title="The request to upload the image was unsuccessful."
        />
      }
    </Space>
  );
}
