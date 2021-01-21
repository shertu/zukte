import "antd/dist/antd.less";
import { render } from "react-dom";
import { App } from "./components/App/App";

// The following LOC renders the app component to the DOM.
const element: JSX.Element = App();
render(element, document.getElementById("app"));
