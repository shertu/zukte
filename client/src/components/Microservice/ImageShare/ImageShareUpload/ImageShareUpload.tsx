import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Space, Typography, Upload, message } from 'antd';

import { ImageStorageServiceApi } from '../../../../openapi-generator';
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
  onChangeImageUrl?: (url: string | null | undefined) => void;
}): JSX.Element {
  const { onChangeImageUrl, className } = props;
  const client = new ImageStorageServiceApi();

  const [imageUrl, setImageUrl] = React.useState<string | null | undefined>();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [errorOccur, setErrorOccur] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    if (onChangeImageUrl) {
      onChangeImageUrl(imageUrl);
    }
  }, [imageUrl]);

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
  function uploadCustomRequest(options: RcCustomRequestOptions): void {
    client.imageStorageServiceInsert({
      image: options.file,
    }).then((response) => {
      setImageUrl(response.insertedImageUrl);
      setIsLoading(false);
    }).catch((err) => {
      setErrorOccur(true);
      setIsLoading(false);
    });
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
        <div style={{ minWidth: 428, minHeight: 64 }}>
          {imageUrl ?
            <img src={imageUrl} style={{ maxWidth: "100%", maxHeight: 437 }} />
            :
            <Typography>
              <Paragraph className="ant-upload-drag-icon">
                {isLoading ? <LoadingOutlined /> : <UploadOutlined />}
              </Paragraph>
              <Paragraph className="ant-upload-text">
                click this area to upload a file
              </Paragraph>
            </Typography>
          }
        </div>
      </Dragger>

      {errorOccur &&
        <Rfc7807Alert
          title="The request to upload the image was unsuccessful."
        />
      }
    </Space>
  );
}
