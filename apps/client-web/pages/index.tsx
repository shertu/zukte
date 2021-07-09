import {AboutMeContent} from '../components/about-me-content/about-me-content';
import {AppPage} from '../components/app-page/app-page';
import {PortfolioNav} from '../components/portfolio-nav/portfolio-nav';
import React from 'react';

/**
 * The page the user scrolls down to after seeing the landing screen.
 *
 * @return {JSX.Element}
 */
export function LandingPage(): JSX.Element {
  return (
    <AppPage style={{minHeight: '100vh'}}>
      <div>
        <AboutMeContent />

        <AppPage>
          {/* <Divider>examples</Divider> */}
          <PortfolioNav />
        </AppPage>
      </div>
      {/* <Space direction="vertical" align="center" size={40}>

      </Space> */}
    </AppPage>
  );
}

export default LandingPage;
