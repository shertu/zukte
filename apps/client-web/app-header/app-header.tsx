import React from 'react';

/**
 * A large, full-width view component to display a section of content.
 *
 * @param {PageProps} props
 * @return {JSX.Element}
 */
export function AppPage(propss): JSX.Element {
  const {className, pageTitle, size = 'md', children, ...other} = props;

  return (
    <Header style={{backgroundColor: 'transparent'}}>
      <Space className="max-height" align="center">
        <LocationBreadcrumb />
      </Space>
    </Header>
  );
}
