import {Button, Layout, Space} from 'antd';
import * as React from 'react';
import {Link, useRouteMatch} from 'react-router-dom';
import ApplicationRouteCollection from '../../../utilities/ApplicationRouteCollection';
import {AppPage} from '../../AppPage/AppPage';
import {LandingScreen} from '../../LandingScreen/LandingScreen';
import {LocationBreadcrumb} from '../../LocationBreadcrumb/LocationBreadcrumb';
import {AppContentSwitch} from '../AppContentSwitch/AppContentSwitch';
import './style.less';

const {Header, Content, Footer} = Layout;

/**
 * A layout component used to describe general structure of the application, e.g. main, header, footer, etc.
 *
 * @return {JSX.Element}
 */
export function AppLayout(): JSX.Element {
  const isHomePage: boolean = useRouteMatch(ApplicationRouteCollection.Home)?.isExact || false;
  return (
    <Layout id="app-layout">
      {isHomePage ?
        <LandingScreen /> :
        <Header>
          <Space className="max-height" align="center">
            <LocationBreadcrumb />
          </Space>
        </Header>
      }

      <Content>
        <AppPage id="content-viewport">
          <AppContentSwitch />
        </AppPage>
      </Content>
      <Footer>
        <Space className="max-height" align="center">
          <Link to={ApplicationRouteCollection.PrivacyPolicy}>
            <Button type="link">Privacy Policy</Button>
          </Link>
        </Space>
      </Footer>
    </Layout>
  );
}
