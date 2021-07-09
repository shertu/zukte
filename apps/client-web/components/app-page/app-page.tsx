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
export function AppPage(props: PageProps): JSX.Element {
  const {pageTitle, children, ...other} = props;

  return (
    <main {...other}>
      <Container fixed>
        {pageTitle && <Typography variant="h1">{pageTitle}</Typography>}
        {children}
      </Container>
    </main>
  );
}
