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
  const pageid = 'about-me-page';

  return (
    <>
      <Head>
        <title>Jared Michael Blackman</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js" />
      </Head>
      <Paper square elevation={3}>
        <LandingScreen readMoreLinkFragment={pageid} />
      </Paper>
      <AppPage
        id={pageid}
        className="min-h-screen flex flex-col items-center pt-16"
      >
        <AboutMeContent />
        <PortfolioNav />
      </AppPage>
    </>
  );
}

export default LandingPage;
