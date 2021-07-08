import React from 'react';
import {Result} from 'antd';
import {mail} from 'fluent-mailto';

/**
 * The component shown when there is a 404 HTTP status error.
 * @todo replace with ENNY artwork
 */
export function ErrorPage404() {
  const mailToSubject = `An error occured when I visited ${window.location.href}`;

  const mailto = mail
    .to('djared.xeknau@outlook.com')
    .subject(mailToSubject)
    .build();

  return (
    <Result
      status="404"
      title="client no route match error"
      extra={
        <Paragraph>
          please&nbsp;
          <a href={mailto}>report this error to a developer</a>
        </Paragraph>
      }
    />
  );
}

export default ErrorPage404;
