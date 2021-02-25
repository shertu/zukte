import {Upload, message} from 'antd';

import {RcFile} from 'antd/lib/upload';
import React from 'react';
import {UploadFile} from 'antd/lib/upload/interface';
import {UploadOutlined} from '@ant-design/icons';

/**
 * Used to upload an image to the application's image share container.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function MockUpload(props: {
  value?: UploadFile[];
  onChange?: (value: UploadFile[]) => void;
  maximumFileSize: number;
}): JSX.Element {
  const {value = [], onChange, maximumFileSize} = props;

  const MAX_FILE_SIZE_MB: string = (maximumFileSize / 1000000).toFixed(2);

  /**
   * Hook function which will be executed before uploading.
   *
   * @param {RcFile} file
   * @param {RcFile[]} fileList
   * @return {boolean | Promise<void | Blob | File>}
   */
  function beforeUpload(
      file: RcFile,
      fileList: RcFile[],
  ): boolean | Promise<void | Blob | File> {
    const fileListA: RcFile[] = [];

    fileList.forEach((element: RcFile) => {
      if (element.size < maximumFileSize) {
        fileListA.push(element);
      } else {
        message.error(`file size require to be less 
        than ${MAX_FILE_SIZE_MB} MB\n${element.name}`);
      }
    });

    if (fileListA.length && onChange) {
      onChange([...value, ...fileListA]);
    }

    return false;
  }

  /**
   * A callback function, will be executed when
   * removing file button is clicked.
   *
   * @param {UploadFile} file
   */
  function onRemove(file: UploadFile): void {
    const index = value.indexOf(file);
    const newFileList = value.slice();
    newFileList.splice(index, 1);
    if (onChange) {
      onChange(newFileList);
    }
  }

  return (
    <Upload.Dragger
      beforeUpload={beforeUpload}
      onRemove={onRemove}
      fileList={value}
      multiple={true}
    >
      <p className="ant-upload-drag-icon">
        <UploadOutlined />
      </p>
      <p className="ant-upload-text">click or drag to select files</p>
    </Upload.Dragger>
  );
}
