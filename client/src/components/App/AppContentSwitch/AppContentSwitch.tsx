import {Result, Typography} from 'antd';
import {Route, Switch} from 'react-router-dom';

import AppRouteCollection from '../../../constants/AppRouteCollection';
import {AuthenticationAtomicDemo} from '../../AtomicDemo/AuthenticationAtomicDemo/AuthenticationAtomicDemo';
import {LandingPage} from '../../LandingPage/LandingPage';
import Mailto from 'react-mailto.js';
import {PrivacyPolicyPage} from '../../PrivacyPolicyPage/PrivacyPolicyPage';
import React from 'react';

const {Paragraph} = Typography;

/**
 * A switch component used to route URLs to core pages in the application.
 *
 * @return {JSX.Element}
 */
export function AppContentSwitch(): JSX.Element {
  const mailToSubject: string =
    `An error occured when I visited ${window.location.href}`;

  return (
    <Switch>
      <Route exact path={AppRouteCollection.Home}>
        <LandingPage />
      </Route>

      <Route exact path={AppRouteCollection.PrivacyPolicy}>
        <PrivacyPolicyPage />
      </Route>

      <Route exact path={AppRouteCollection.AuthenticationDemo}>
        <AuthenticationAtomicDemo />
      </Route>

      <Route>
        <Result
          status="404"
          title="client no route match error"
          extra={
            <Paragraph>
              please&nbsp;
              <Mailto
                subject={mailToSubject}
                to="djared.xeknau@outlook.com"
              >
                report this error to a developer
              </Mailto>
            </Paragraph>
          }
        />
      </Route>
    </Switch>
  );
}

/*
<Route exact path={AppRouteCollection.MapDemo}>
<MapAtomicDemo />
</Route>

<Route exact path={ApplicationRouteCollection.ImageShareDemo}>
<ImageShareAtomicDemo />
</Route>
*/
