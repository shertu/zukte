import {
  AboutMeContent,
  AgeSexLocation,
  AppPage,
  LandingScreen,
  PortfolioNav,
} from 'components';

import Head from 'next/head';
import {Paper} from '@mui/material';
import React from 'react';

/**
 * The page the user scrolls down to after seeing the landing screen.
 */
export function LandingPage() {
  const landingScreenScrollToId = 'about-me-content';

  return (
    <>
      <Head>
        <title>Jared Michael Blackman</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js" />
        {/* <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js" /> */}
      </Head>
      <Paper square elevation={3}>
        <LandingScreen scrollTo={landingScreenScrollToId} />
      </Paper>
      <AppPage
        className="min-h-screen pt-office-word px-6"
        id={landingScreenScrollToId}
      >
        <AgeSexLocation
          className="mb-office-word"
          alignItems="center"
          justifyContent="center"
          spacing={5}
        />
        <AboutMeContent
          className="mb-16"
          alignItems="center"
          justifyContent="center"
          spacing={5}
        />
        <PortfolioNav />
      </AppPage>
    </>
  );
}

export default LandingPage;
