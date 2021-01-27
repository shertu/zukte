import {Divider, Space} from 'antd';
import * as React from 'react';
import {AppPage} from '../AppPage/AppPage';
import {AboutMeContent} from './AboutMeContent/AboutMeContent';
import {PortfolioNav} from './PortfolioNav/PortfolioNav';

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
