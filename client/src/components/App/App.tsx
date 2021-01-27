import * as React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {AppLayout} from './AppLayout/AppLayout';

/**
 * The highest level react component.
 *
 * @return {JSX.Element}
 */
export function App(): JSX.Element {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
