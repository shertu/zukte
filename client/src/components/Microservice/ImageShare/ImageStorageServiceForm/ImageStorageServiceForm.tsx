import { Button, Form, Space, Upload } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';

import React from 'react';
import { Rfc7807Alert } from '../../../Rfc7807Alert/Rfc7807Alert';

export interface ImageStorageServiceFormValues {
  files: File[];
}

/**
 * Used to upload an image to the application's image share container.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ImageStorageServiceForm(props: {
  onFinish: (values: ImageStorageServiceFormValues) => void;
}): JSX.Element {
  const { onFinish } = props;

  return (
    <Form
      onFinish={onFinish}
    >
      <Form.Item
        name="files"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        noStyle
      >
        <Upload.Dragger name="files" action="/upload.do">
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">upload files</p>
        </Upload.Dragger>
      </Form.Item>

      <Space direction="vertical" align="end">
        <Button type="primary" htmlType="submit">execute</Button>
      </Space>
    </Form>
  );
}
