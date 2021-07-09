import {AppPage} from '../components/app-page/app-page';
import React from 'react';
import {Typography} from '@material-ui/core';

/**
 * This page outlines the rights of the user in
 * regards to their online privacy while using
 * this web application.
 */
export function PrivacyPolicy(): JSX.Element {
  const [hostname, setHostname] = React.useState<string>();

  function onFirstMount() {
    setHostname(window.location.hostname.toUpperCase());
  }

  React.useEffect(onFirstMount, []);

  return (
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
        to create an account in this web application from the information which
        is publically available from your Google account.
      </Typography>

      <Typography variant="h2">Cookies</Typography>

      <Typography>
        This website, like many other websites, uses computer cookies to help
        keep track of your preferences, authenticaiton session, etc.
      </Typography>
    </AppPage>
  );
}

export default PrivacyPolicy;
