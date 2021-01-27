import {Button, Layout, Space} from 'antd';
import * as React from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import ApplicationRouteCollection from '../../../constants/ApplicationRouteCollection';
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
  return (
    <Layout id="app-layout">
      <Switch>
        <Route exact path={ApplicationRouteCollection.Home}>
          <LandingScreen />
        </Route>

        <Route>
          <Header style={{backgroundColor: 'transparent'}}>
            <Space className="max-height" align="center">
              <LocationBreadcrumb />
            </Space>
          </Header>
        </Route>
      </Switch>

      <Content>
        <div id="content-viewport" className="max-cell-lg">
          <AppContentSwitch />
        </div>
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
