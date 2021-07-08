import {Result, Typography} from 'antd';
import {Route, Switch} from 'react-router-dom';

import AppRouteCollection from '../../../constants/AppRouteCollection';
import {AuthenticateMicroservice} from '../../../pages/AuthenticateMicroservice';
import {ImageShareMicroservice} from '../../../pages/ImageShareMicroservice';
import {LandingPage} from '../../../pages/LandingPage';
import {PrivacyPolicyPage} from '../../PrivacyPolicyPage/PrivacyPolicyPage';
import React from 'react';
import {mail} from 'fluent-mailto';

const {Paragraph} = Typography;

/**
 * A switch component used to route URLs to core pages in the application.
 *
 * @return {JSX.Element}
 */
export function AppContentSwitch(): JSX.Element {
  const mailToSubject = `An error occured when I visited ${window.location.href}`;

  const mailto = mail
    .to('djared.xeknau@outlook.com')
    .subject(mailToSubject)
    .build();

  return (
    <Switch>
      <Route exact path={AppRouteCollection.Home}>
        <LandingPage />
      </Route>

      <Route exact path={AppRouteCollection.PrivacyPolicy}>
        <PrivacyPolicyPage />
      </Route>

      <Route exact path={AppRouteCollection.AuthenticationDemo}>
        <AuthenticateMicroservice />
      </Route>

      <Route exact path={AppRouteCollection.ImageShareDemo}>
        <ImageShareMicroservice />
      </Route>

      <Route>
        <Result
          status="404"
          title="client no route match error"
          extra={
            <Paragraph>
              please&nbsp;
              <a href={mailto}>report this error to a developer</a>
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
*/
