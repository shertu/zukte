import {Button} from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import Result from '../components/result/result';
import {ToolbarOffset} from '../components/toolbar-offset/toolbar-offset';

/**
 * The component shown when there is a 404 HTTP status error.
 * @todo replace with ENNY artwork
 */
export function ErrorPage404() {
  return (
    <>
      <ToolbarOffset />
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link href="/" passHref>
            <Button color="primary">Back Home</Button>
          </Link>
        }
      />
    </>
  );
}

export default ErrorPage404;
