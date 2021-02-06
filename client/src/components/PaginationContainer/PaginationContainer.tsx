import {Alert, Button, List, Space} from 'antd';

import {MouseEventHandler} from 'react';
import React from 'react';
import classNames from 'classnames';

export interface PaginationContainer {
  className?: string;
  children?: React.ReactNode;
  noItemsFetched: boolean;
  noItemsFetchedText?: string;
  onLoadMoreError: boolean;
  onLoadMoreErrorText?: string;
  onClickReload: MouseEventHandler<HTMLElement>;
}

/**
 * A large, full-width view component to display a section of content.
 *
 * @param {PaginationContainer} props
 * @return {JSX.Element}
 */
export function PaginationContainer(props: PaginationContainer): JSX.Element {
  const {className, children,
    noItemsFetched, noItemsFetchedText,
    onLoadMoreError, onLoadMoreErrorText,
    onClickReload: onClickRetry} = props;

  const noItemsFetchedTextDefault: string = noItemsFetchedText || 'No data was found.';
  const onLoadMoreErrorTextDefault: string = onLoadMoreErrorText || 'The request for additional data failed.';

  return (
    <Space
      direction="vertical"
      className={classNames(className, 'infinite-scroll-list-container')}
    >
      {children}

      {noItemsFetched &&
        <Alert
          message={noItemsFetchedTextDefault}
          type="warning"
          showIcon
        />
      }

      {onLoadMoreError &&
        <Alert
          message={onLoadMoreErrorTextDefault}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={onClickRetry}>retry</Button>
          }
        />
      }
    </Space>
  );
}
