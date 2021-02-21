import { ImageStorageServiceApi, ImageStorageServiceInsertRequest } from '../../../../openapi-generator';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Space, Typography, Upload, message } from 'antd';

import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import React from 'react';
import { Rfc7807Alert } from '../../../Rfc7807Alert/Rfc7807Alert';
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
  async function uploadCustomRequest(options: RcCustomRequestOptions): Promise<void> {
    const request: ImageStorageServiceInsertRequest = {
      file: options.file,
    };

    const response = await client.imageStorageServiceInsert(request);

    setImageUrl(response.url ?? null);
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
        customRequest={uploadCustomRequest}
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

      {errorOccur &&
        <Rfc7807Alert
          title="The request to upload the image was unsuccessful."
        />
      }
    </Space>
  );
}
