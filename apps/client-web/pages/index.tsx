import {AboutMeContent} from '../components/about-me-content/about-me-content';
import {AppPage} from '../components/app-page/app-page';
import Head from 'next/head';
import {LandingScreen} from '../components/landing-screen/landing-screen';
import {Paper} from '@material-ui/core';
import {PortfolioNav} from '../components/portfolio-nav/portfolio-nav';
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
      </Head>
      <Paper square elevation={3}>
        <LandingScreen scrollTo={landingScreenScrollToId} />
      </Paper>
      <AppPage
        className="min-h-screen flex flex-col items-center"
        id={landingScreenScrollToId}
      >
        <div className="w-full mb-12">
          <AboutMeContent />
        </div>
        <PortfolioNav />
      </AppPage>
    </>
  );
}

export default LandingPage;
