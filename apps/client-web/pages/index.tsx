import {Divider, Space} from 'antd';

import {AboutMeContent} from '../components/AboutMeContent/AboutMeContent';
import {AppPage} from '../components/AppPage/AppPage';
import {PortfolioNav} from '../components/PortfolioNav/PortfolioNav';
import React from 'react';

/**
 * The page the user scrolls down to after seeing the landing screen.
 *
 * @return {JSX.Element}
 */
export function LandingPage(): JSX.Element {
  return (
    <AppPage style={{minHeight: '100vh'}}>
      <Space direction="vertical" align="center" size={40}>
        <AboutMeContent />

        <AppPage>
          <Divider>examples</Divider>
          <PortfolioNav />
        </AppPage>
      </Space>
    </AppPage>
  );
}
