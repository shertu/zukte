import {Container, ContainerProps} from '@mui/material';

import React from 'react';

/**
 * A large, full-width view component to display a section of content.
 */
export function AppPage(props: ContainerProps) {
  return <Container fixed component="main" {...props} />;
}

export default AppPage;
