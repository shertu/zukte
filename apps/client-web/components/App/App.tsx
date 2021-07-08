import {AppLayout} from './AppLayout/AppLayout';
import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

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
