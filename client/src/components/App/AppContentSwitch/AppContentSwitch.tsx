import {Result, Typography} from 'antd';
import * as React from 'react';
import Mailto from 'react-mailto.js';
import {Route, Switch} from 'react-router-dom';
import ApplicationRouteCollection from '../../../utilities/ApplicationRouteCollection';
import {AuthenticationAtomicDemo} from '../../AtomicDemo/AuthenticationAtomicDemo/AuthenticationAtomicDemo';
import {ImageShareAtomicDemo} from '../../AtomicDemo/ImageShareAtomicDemo/ImageShareAtomicDemo';
import {MapAtomicDemo} from '../../AtomicDemo/MapAtomicDemo/MapAtomicDemo';
import {LandingPage} from '../../LandingPage/LandingPage';
import {PrivacyPolicyPage} from '../../PrivacyPolicyPage/PrivacyPolicyPage';

const {Paragraph} = Typography;

/**
 * A switch component used to route URLs to core pages in the application.
 *
 * @return {JSX.Element}
 */
export function AppContentSwitch(): JSX.Element {
  return (
    <Switch>
      <Route exact path={ApplicationRouteCollection.Home}>
        <LandingPage />
      </Route>

      <Route exact path={ApplicationRouteCollection.PrivacyPolicy}>
        <PrivacyPolicyPage />
      </Route>

      <Route exact path={ApplicationRouteCollection.AuthenticationDemo}>
        <AuthenticationAtomicDemo />
      </Route>

      <Route exact path={ApplicationRouteCollection.ImageShareDemo}>
        <ImageShareAtomicDemo />
      </Route>

      <Route exact path={ApplicationRouteCollection.MapDemo}>
        <MapAtomicDemo />
      </Route>

      <Route>
        <Result
          status="404"
          title='client-side no route match error'
          extra={
            <Paragraph>
              Please&nbsp;<Mailto subject={`An error occured when I visited ${window.location.href}`} to="djared.xeknau@outlook.com" >report this error to a developer.</Mailto>
            </Paragraph>
          }
        />
      </Route>
    </Switch>
  );
}
