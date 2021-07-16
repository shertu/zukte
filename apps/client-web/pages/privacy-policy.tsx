import {AppHeader} from '../components/app-header/app-header';
import {AppPage} from '../components/app-page/app-page';
import React from 'react';
import {Typography} from '@material-ui/core';
import {useWindow} from '../custom-hooks/use-window';

/**
 * This page outlines the rights of the user in
 * regards to their online privacy while using
 * this web application.
 */
export function PrivacyPolicy() {
  const [hostname, setHostname] = React.useState<string>();
  useWindow(w => {
    setHostname(w.location.hostname.toUpperCase());
  });

  return (
    <>
      <AppHeader />
      <AppPage>
        <Typography variant="h1">Privacy Policy for {hostname}</Typography>

        <Typography>
          This Privacy Policy document outlines how information about&nbsp;
          <strong>you</strong> is collected and used whilst you visit this
          website.
        </Typography>

        <Typography>
          Further use of this website is to be considered&nbsp;
          <strong>consent</strong> to our Privacy Policy and agreemnent to its
          terms.
        </Typography>

        <Typography variant="h2">
          How we collect and use your information
        </Typography>

        <Typography>
          This website will store personal information such as your name, email
          address, phone number, etc.
        </Typography>

        <Typography>
          This website will use https://www.googleapis.com/auth/userinfo.profile
          to create an account in this web application from the information
          which is publically available from your Google account.
        </Typography>

        <Typography variant="h2">Cookies</Typography>

        <Typography>
          This website, like many other websites, uses computer cookies to help
          keep track of your preferences, authenticaiton session, etc.
        </Typography>
      </AppPage>
    </>
  );
}

export default PrivacyPolicy;
