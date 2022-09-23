import BrowserOnly from "@docusaurus/BrowserOnly";
import React from "react";

export default function Playground() {
  return (
    <BrowserOnly>
      {() => {
        const PlaygroundInner = require("./PlaygroundInner").default;
        return <PlaygroundInner />;
      }}
    </BrowserOnly>
  );
}
