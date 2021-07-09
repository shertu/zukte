import {Container, Typography} from '@material-ui/core';

import React from 'react';

export interface PageProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  pageTitle?: string;
}

/**
 * A large, full-width view component to display a section of content.
 */
export function AppPage(props: PageProps) {
  const {pageTitle, children, ...other} = props;

  return (
    <Container fixed style={{backgroundColor: 'red'}}>
      <main {...other}>
        {pageTitle && <Typography variant="h1">{pageTitle}</Typography>}
        {children}
      </main>
    </Container>
  );
}
