import {AboutMeContent} from '../components/about-me-content/about-me-content';
import {AppPage} from '../components/app-page/app-page';
import {PortfolioNav} from '../components/portfolio-nav/portfolio-nav';
import React from 'react';

/**
 * The page the user scrolls down to after seeing the landing screen.
 */
export function LandingPage() {
  return (
    <AppPage className="flex flex-col items-center space-y-6">
      <AboutMeContent />

      {/* <Divider>examples</Divider> */}
      <PortfolioNav />
    </AppPage>
  );
}

export default LandingPage;
