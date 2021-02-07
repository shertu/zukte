import { Alert, Button, Descriptions, Space } from 'antd';

import React from 'react';

// https://tools.ietf.org/html/rfc7807
export interface FailedNetworkRequestAlertProps {
  errorClassification: string;
  errorTitle: string;
  errorHttpStatus?: number;
  errorDetail?: string;
  errorInstance?: string;
  onClickRetry?: React.MouseEventHandler<HTMLElement>;
};

/**
 * An infinite scroll list of items which loads using pagination.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function FailedNetworkRequestAlert(props: FailedNetworkRequestAlertProps): JSX.Element {
  const { errorClassification, errorTitle, errorHttpStatus, errorDetail, errorInstance, onClickRetry } = props;

  const [showDetails, setShowDetails] =
    React.useState<boolean>(false);

  return (
    <Alert
      message={errorTitle}
      type="error"
      action={
        <Space>
          {!showDetails &&
            <Button size="small" onClick={() => setShowDetails(true)}>details</Button>
          }
          {onClickRetry &&
            <Button size="small" danger onClick={onClickRetry}>retry</Button>
          }
        </Space>
      }
      description={
        showDetails &&
        <Descriptions title="Error Information">
          <Descriptions.Item label="Classification">{errorClassification}</Descriptions.Item>
          <Descriptions.Item label="Detail" span={3}>{errorDetail}</Descriptions.Item>
          <Descriptions.Item label="Trace">{errorInstance}</Descriptions.Item>
          <Descriptions.Item label="HTTP Status Code">{errorHttpStatus}</Descriptions.Item>
        </Descriptions>
      }
    />
  );
}
