import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {Alert, message, Space, Typography, Upload} from 'antd';
import {UploadChangeParam} from 'antd/lib/upload';
import {RcCustomRequestOptions} from 'antd/lib/upload/interface';
import * as React from 'react';
import {BlobStorageApi} from '../../../../../generated-sources/openapi';

const {Dragger} = Upload;
const {Paragraph} = Typography;

const BLOB_STORAGE_API: BlobStorageApi = new BlobStorageApi();

/**
 * Used to upload an image to the application's image share container.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ImageShareUpload(props: {
  className?: string;
  onFinishUpload?: (url: string) => void;
}): JSX.Element {
  const {onFinishUpload, className} = props;

  const [imageUrl, setImageUrl] = React.useState<string>(null);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  /** Has an error occured during a fetch op? */
  const [error, setError] = React.useState<boolean>(false);

  /**
   * The event called when the uploader starts to upload the file.
   * @param {UploadChangeParam} info
   */
  function onChange(info: UploadChangeParam): void {
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
    await BLOB_STORAGE_API.apiBlobStoragePost({
      file: options.file,
    }).then((res: string) => {
      setImageUrl(res);

      if (onFinishUpload) {
        onFinishUpload(imageUrl);
      }
    }).catch(() => setError(true));

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
        name='file'
        accept='image/*'
        multiple={false}
        beforeUpload={beforeUpload}
        onChange={onChange}
        showUploadList={false}
        customRequest={customRequest}
      >
        {imageUrl ?
          <img className="max-cell" src={imageUrl} alt="uploaded-image" /> :
          <div style={{padding: 28}}>
            <Paragraph className="ant-upload-drag-icon">
              {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
            </Paragraph>
            <Paragraph className="ant-upload-text">click or drag file to this area to upload</Paragraph>
          </div>
        }
      </Dragger>

      {error &&
        <Alert message="An unexpected error occurred while uploading the image." type="error" />
      }
    </Space>
  );
}

