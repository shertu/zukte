import {AppBar, Container} from '@material-ui/core';

import {LocationBreadcrumb} from '../location-breadcrumb/location-breadcrumb';
import React from 'react';

/** The main header component for the entail application. */
export function AppHeader() {
  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Container fixed>
        <LocationBreadcrumb />
      </Container>
    </AppBar>
  );
}

export default AppHeader;
