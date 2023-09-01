import BrowserOnly from "@docusaurus/BrowserOnly";
import Head from "@docusaurus/Head";
import React from "react";

export default function Playground() {
  return (
    <BrowserOnly>
      {() => {
        const PlaygroundInner = require("./PlaygroundInner").default;
        return (
          <>
            <Head>
              <script src="https://cdn.jsdelivr.net/npm/mermaid@9.4.3"></script>
            </Head>
            <PlaygroundInner />
          </>
        );
      }}
    </BrowserOnly>
  );
}
