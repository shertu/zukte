import {AppBar, Container} from '@mui/material';

import {LocationBreadcrumb} from '../location-breadcrumb/location-breadcrumb';
import React from 'react';

/** The main header component for the application. */
export function AppHeader() {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container fixed className="flex items-center h-12">
        <LocationBreadcrumb />
      </Container>
    </AppBar>
  );
}

export default AppHeader;
