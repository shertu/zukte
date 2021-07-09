import {AppBar, AppBarProps, Container} from '@material-ui/core';

import {LocationBreadcrumb} from '../location-breadcrumb/location-breadcrumb';
import React from 'react';

/** The main header component for the entail application. */
export function AppHeader(props: AppBarProps) {
  return (
    <AppBar {...props}>
      <Container fixed>
        <LocationBreadcrumb />
      </Container>
    </AppBar>
  );
}

export default AppHeader;
