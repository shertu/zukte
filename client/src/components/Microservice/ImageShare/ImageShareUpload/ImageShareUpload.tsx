import { Alert, Space, Typography, Upload, message } from 'antd';
import { ImageInsertResponse, ImageStorageServiceApi, ImageStorageServiceInsertRequest } from '../../../../openapi-generator';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import React from 'react';
import { UploadChangeParam } from 'antd/lib/upload';

const { Dragger } = Upload;
const { Paragraph } = Typography;

/**
 * Used to upload an image to the application's image share container.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ImageShareUpload(props: {
  className?: string;
  onChangeImageUrl?: (url: string) => void;
}): JSX.Element {
  const { onChangeImageUrl, className } = props;
  const client = new ImageStorageServiceApi();

  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [errorOccur, setErrorOccur] =
    React.useState<boolean>(false);

  /**
   * The event called when the uploader starts to upload the file.
   * @param {UploadChangeParam} info
   */
  function onChangeDragger(info: UploadChangeParam): void {
    if (info.file.status === 'uploading') {
      setIsLoading(true);
      return;
    }
  }

  /**
   * An override for the upload request.
   *
   * @param {RcCustomRequestOptions} options
   */
  async function customRequest(options: RcCustomRequestOptions): Promise<void> {
    const buffer = await options.file.arrayBuffer();
    buffer.

    const request: ImageStorageServiceInsertRequest = {
      imageData = 
    };

    if (current.nextPageToken) {
      request.pageToken = current.nextPageToken;
    }

    const response: ImageInsertResponse =
      await client.imageStorageServiceInsert(request);


    setImageUrl(res);

    setIsLoading(false);
  }

  /**
   * The event called before the uploader starts to upload the file.
   *
   * @param {File} file
   * @param {File[]} FileList
   * @return {boolean}
   */
  function beforeUpload(file: File, FileList: File[]): boolean {
    const isSmallFile = file.size < 8388608;
    if (!isSmallFile) {
      message.error('Image must smaller than 8 MiB!');
    }

    return isSmallFile;
  }

  return (
    <Space className={className} direction="vertical">
      <Dragger
        name="file"
        accept="image/*"
        multiple={false}
        beforeUpload={beforeUpload}
        onChange={onChangeDragger}
        showUploadList={false}
        customRequest={customRequest}
      >
        {imageUrl ? (
          <img className="max-cell" src={imageUrl} alt="uploaded-image" />
        ) : (
            <div style={{ padding: 28 }}>
              <Paragraph className="ant-upload-drag-icon">
                {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
              </Paragraph>
              <Paragraph className="ant-upload-text">
                click or drag file to this area to upload
              </Paragraph>
            </div>
          )}
      </Dragger>

      {error && (
        <Alert
          message="An unexpected error occurred while uploading the image."
          type="error"
        />
      )}
    </Space>
  );
}
