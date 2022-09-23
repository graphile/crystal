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

export * from "./index.js";
export { createRoot, React };
