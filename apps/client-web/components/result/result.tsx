import {Box, Typography} from '@material-ui/core';
import {
  CheckIcon,
  CloseCircleIcon,
  InformationIcon,
  WarningTriangleIcon,
} from '@iconicicons/react';

import React from 'react';

export interface ResultProps {
  extra?: React.ReactNode;
  icon?: React.ReactNode;
  status?: 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';
  subTitle?: React.ReactNode;
  title?: React.ReactNode;
}

/**
 * Used to feed back the results of a series of operational tasks.
 * https://ant.design/components/result/
 */
export function Result(props: ResultProps) {
  const {extra, status = 'info', subTitle, title} = props;

  // custom icon takes precedence over status icon
  let statusIcon: React.ReactNode;
  switch (status) {
    case 'success':
      statusIcon = <CheckIcon />;
      break;
    case 'error':
      statusIcon = <CloseCircleIcon />;
      break;
    case 'info':
      statusIcon = <InformationIcon />;
      break;
    case 'warning':
      statusIcon = <WarningTriangleIcon />;
      break;
    case '404':
      statusIcon = '404';
      break;
    case '403':
      statusIcon = '403';
      break;
    case '500':
      statusIcon = '500';
      break;
  }

  const {icon = statusIcon} = props;

  return (
    <div className="flex flex-col items-center px-lg py-xl">
      <Box className="mb-8" fontSize={72}>
        {icon}
      </Box>
      <Typography variant="h4">{title}</Typography>
      <Typography variant="subtitle1">{subTitle}</Typography>
      <div className="mt-6">{extra}</div>
    </div>
  );
}

export default Result;
