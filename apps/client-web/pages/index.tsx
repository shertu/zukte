import {AboutMeContent} from '../components/about-me-content/about-me-content';
import {AppPage} from '../components/app-page/app-page';
import {PortfolioNav} from '../components/portfolio-nav/portfolio-nav';
import React from 'react';

/**
 * The page the user scrolls down to after seeing the landing screen.
 */
export function LandingPage(): JSX.Element {
  return (
    <AppPage>
      {/* <Space direction="vertical" align="center" size={40}> */}
      <div
        style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
      >
        <AboutMeContent />

        {/* <Divider>examples</Divider> */}
        <PortfolioNav />
      </div>
    </AppPage>
  );
}

export default LandingPage;
