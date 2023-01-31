import "graphiql/graphiql.css";
import "@graphiql/plugin-explorer/dist/style.css";
import "ruru-components/ruru.css";

import * as React from "react";
import * as ReactDOM from "react-dom";

// TODO: React 18:
// import { createRoot } from "react-dom/client";

function createRoot(container: HTMLElement) {
  return {
    render(component: JSX.Element) {
      ReactDOM.render(component, container);
    },
  };
}

export * from "ruru-components";
export { createRoot, React };
