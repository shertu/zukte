import {AutoColumnRow, AutoColumnRowGutterDefault} from '../../AutoColumnRow/AutoColumnRow';

import {AppPage} from '../../AppPage/AppPage';
import {ImageShareList} from './ImageShareList/ImageShareList';
import {ImageShareUpload} from './ImageShareUpload/ImageShareUpload';
import Mailto from 'react-mailto.js';
import React from 'react';
import {Typography} from 'antd';

const {Paragraph} = Typography;

/**
 * A demonstration where the user can upload and share images with others.
 *
 * @return {JSX.Element}
 */
export function ImageShareAtomicDemo(): JSX.Element {
  const [itemCollection, setItemCollection] = React.useState<Array<string>>([]);

  /**
   * A hook to prepend the uploaded image to the image item collection.
   *
   * @param {string} url
   */
  function onFinishUpload(url: string): void {
    setItemCollection([url, ...itemCollection]);
  }

  return (
    <AppPage pageTitle="Image Share Demo">
      <AutoColumnRow
        align="middle"
        gutter={[AutoColumnRowGutterDefault, AutoColumnRowGutterDefault]}
      >
        <Typography className="max-cell-xs">
          <Paragraph>
            To use this demo service please upload an image file, e.g. .png,
            .jpg, which is smaller than 8 MiB. You cannot delete an image once
            it is uploaded, however, you can{' '}
            <Mailto to="djared.xeknau@outlook.com">send me an email</Mailto> to
            request the deletion of an image.
          </Paragraph>
        </Typography>

        <ImageShareUpload onFinishUpload={onFinishUpload} />
      </AutoColumnRow>

      <AppPage pageTitle="Uploaded Images">
        <ImageShareList
          itemCollection={itemCollection}
          setItemCollection={setItemCollection}
        />
      </AppPage>
    </AppPage>
  );
}
