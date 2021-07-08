import {PageHeader} from 'antd';
import React from 'react';
import classNames from 'classnames';

export interface PageProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  pageTitle?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * A large, full-width view component to display a section of content.
 *
 * @param {PageProps} props
 * @return {JSX.Element}
 */
export function AppPage(props: PageProps): JSX.Element {
  const {className, pageTitle, size = 'md', children, ...other} = props;

  return (
    <section
      {...other}
      className={classNames(className, `max-cell-${size}`, 'app-page')}
    >
      {pageTitle && <PageHeader title={pageTitle} />}
      {children}
    </section>
  );
}
