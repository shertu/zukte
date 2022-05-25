import {Grid} from '@mui/material';
import PortfolioNavItem from './portfolio-nav-item';
import React from 'react';

/**
 * A navigiation element which links to various examples of my work.
 */
export function PortfolioNav() {
  return (
    <Grid container component="nav" spacing={1} justifyContent="center">
      <PortfolioNavItem
        to="/authenticate-microservice"
        src="https://source.unsplash.com/D44kHt8Ex14"
        title="authentication demo"
        description="sign in to a web application"
      />
      <PortfolioNavItem
        to="/image-share-microservice"
        src="https://source.unsplash.com/KWZa42a1kds"
        title="image share demo"
        description="upload images to the cloud"
      />
      <PortfolioNavItem
        to="/payment-microservice"
        src="https://source.unsplash.com/Q59HmzK38eQ"
        title="payment demo"
        description="process online transactions"
      />
      <PortfolioNavItem
        to="/machine-learn-microservice"
        src="https://source.unsplash.com/2EJCSULRwC8"
        title="machine learn demo"
        description="versus in rock paper scissors"
      />
    </Grid>
  );
}

export default PortfolioNav;
