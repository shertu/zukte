import 'antd/dist/antd.less';
import {render} from 'react-dom';
import {App} from './components/App/App';

/* eslint-disable new-cap */
const element: JSX.Element = App();
/* eslint-enable new-cap */

// The following LOC renders the app component to the DOM.
render(element, document.getElementById('app'));
