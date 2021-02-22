import { Button, Space, Upload, message } from 'antd';

import { ImageStorageServiceApi } from '../../../../openapi-generator';
import { RcFile } from 'antd/lib/upload';
import React from 'react';
import { Rfc7807Alert } from '../../../Rfc7807Alert/Rfc7807Alert';
import { UploadFile } from 'antd/lib/upload/interface';
import { UploadOutlined } from '@ant-design/icons';

/**
 * Used to upload an image to the application's image share container.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ImageShareUpload(props: {
  className?: string;
  onSuccessfulUpload?: (url: string | null | undefined) => void;
}): JSX.Element {
  const { onSuccessfulUpload, className } = props;
  const client = new ImageStorageServiceApi();

  const [uploading, setUploading] =
    React.useState<boolean>(false);

  const [fileList, setFileList] =
    React.useState<Array<UploadFile>>([]);

  const [errorOccur, setErrorOccur] =
    React.useState<boolean>(false);

  /**
   * The event called before the uploader starts to upload the file.
   *
   * @param {React.MouseEvent<HTMLElement, MouseEvent>} event
   */
  function handleUpload(event: React.MouseEvent<HTMLElement, MouseEvent>): void {
    setUploading(true);

    console.log("ImageShareUpload", {
      fileList: fileList,
    });

    fileList.forEach((file: UploadFile) => {
      console.log("ImageShareUpload", {
        originFileObj: file,
      });

      client.imageStorageServiceInsert({
        image: file as Blob,
      }).then((response) => {
        if (onSuccessfulUpload) {
          onSuccessfulUpload(response.insertedImageUrl);
        }

        setUploading(false);
      }).catch((err) => {
        setErrorOccur(true);
        setUploading(false);
      });
    });
  };

  /**
   * The event called before the uploader starts to upload the file.
   *
   * @param {RcFile} file
   * @param {RcFile[]} FileList
   * @return {boolean | Promise<void | Blob | File>}
   */
  function beforeUpload(file: RcFile, FileList: RcFile[]): boolean | Promise<void | Blob | File> {
    if (file.size < 5000000) {
      setFileList([...fileList, file])
    } else {
      message.error('file size require to be less than or equal to 5 MB');
    }

    return false;
  }

  /**
   * The event called before the uploader starts to upload the file.
   *
   * @param {UploadFile} file
   * @return {void | boolean | Promise<void | boolean>}
   */
  function onRemove(file: UploadFile): void | boolean | Promise<void | boolean> {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  }

  return (
    <Space className={className} direction="vertical">
      <Upload
        beforeUpload={beforeUpload}
        onRemove={onRemove}
        fileList={fileList}
        multiple={false}
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? 'Uploading' : 'Start Upload'}
      </Button>

      {errorOccur &&
        <Rfc7807Alert
          title="The request to upload the image was unsuccessful."
        />
      }
    </Space>
  );
}
