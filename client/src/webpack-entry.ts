import './style/index.less';

import {App} from './components/App/App';
import {render} from 'react-dom';

/* eslint-disable new-cap */
const element: JSX.Element = App();
/* eslint-enable new-cap */

// The following LOC renders the app component to the DOM.
render(element, document.getElementById('app'));
