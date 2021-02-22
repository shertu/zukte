import { Space, Typography } from 'antd';

import { AppPage } from '../../AppPage/AppPage';
import { ImageShareList } from './ImageShareList/ImageShareList';
import { ImageShareUpload } from './ImageShareUpload/ImageShareUpload';
import Mailto from 'react-mailto.js';
import { PaginationListInformation } from '../../PaginationList/PaginationListInformation';
import React from 'react';

const { Paragraph } = Typography;

/**
 * A demonstration where the user can upload and share images with others.
 *
 * @return {JSX.Element}
 */
export function ImageShareMicroservice(): JSX.Element {
  const [information, setInformation] =
    React.useState<PaginationListInformation<string>>(
      new PaginationListInformation<string>());

  /**
   * A hook to prepend the uploaded image to the image item collection.
   *
   * @param {string} url
   */
  function onChangeUploadImageUrl(url: string | null | undefined): void {
    if (url) {
      const nextInformation: PaginationListInformation<string> =
        new PaginationListInformation<string>();

      nextInformation.items = [url, ...information.items];

      nextInformation.nextPageToken =
        information.nextPageToken;
      nextInformation.hasMadeAtLeastOneFetch =
        information.hasMadeAtLeastOneFetch;

      setInformation(nextInformation);
    }
  }

  return (
    <AppPage pageTitle="Image Share Demo">
      <Space direction="vertical">
        <Typography className="max-cell-xs">
          <Paragraph>
            To use this demo service please upload an image file, e.g. .png,
            .jpg, which is smaller than 8 MiB. You cannot delete an image once
            it is uploaded, however, you can{' '}
            <Mailto to="djared.xeknau@outlook.com">send me an email</Mailto> to
            request the deletion of an image.
          </Paragraph>
        </Typography>

        <ImageShareUpload onChangeImageUrl={onChangeUploadImageUrl} />
      </Space>

      <AppPage pageTitle="Uploaded Images">
        <ImageShareList
          information={information}
          onChangeInformation={setInformation}
        />
      </AppPage>
    </AppPage>
  );
}
