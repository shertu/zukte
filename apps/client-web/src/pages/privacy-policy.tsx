import {AppHeader, AppPage} from 'components';

import Link from 'src/components/next-link-composed/next-link-composed';
import React from 'react';
import {Typography} from '@mui/material';

/**
 * This page outlines the rights of the user in
 * regards to their online privacy while using
 * this web application.
 */
export function PrivacyPolicy() {
  return (
    <>
      <AppHeader />
      <AppPage>
        <Typography>
          This document outlines how information about&nbsp;
          <strong>you</strong> is collected and used whilst you visit this
          website.
        </Typography>

        <Typography variant="h3">
          How we collect and use your information
        </Typography>

        <Typography>
          This website uses&nbsp;
          <Link href="https://www.googleapis.com/auth/userinfo.profile">
            https://www.googleapis.com/auth/userinfo.profile
          </Link>
          &nbsp;to create an account in this web application.
        </Typography>

        <Typography variant="h3">Cookies</Typography>

        <Typography>
          This website, like many other websites, uses computer cookies to help
          keep track of your preferences, authenticaiton session, etc.
        </Typography>
      </AppPage>
    </>
  );
}

export default PrivacyPolicy;
