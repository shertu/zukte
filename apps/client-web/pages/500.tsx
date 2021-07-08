import {Button} from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import {Result} from '../components/result/result';
import {ToolbarOffset} from '../components/toolbar-offset/toolbar-offset';

/**
 * The component shown when there is a 500 HTTP status error.
 * @todo replace with ENNY artwork
 */
export function ErrorPage500() {
  return (
    <>
      <ToolbarOffset />
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong. Is Enny playing with the wires again?"
        extra={
          <Link href="/" passHref>
            <Button color="primary">Back Home</Button>
          </Link>
        }
      />
    </>
  );
}

export default ErrorPage500;
