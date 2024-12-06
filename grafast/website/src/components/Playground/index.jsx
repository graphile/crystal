import BrowserOnly from "@docusaurus/BrowserOnly";
import Head from "@docusaurus/Head";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function Playground() {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => {
        console.dir(error);
        const issueStack = (error?.stack ?? error)
          ?.split("\n")
          .slice(0, 2)
          .map((s) => s.trim())
          .join(" / ");
        return (
          <div>
            <h2>Something went wrong</h2>
            <p>
              Sorry about this. Grafast isn&apos;t really intended for usage on
              the web yet and we seem to break the playground quite frequently
              as a consequence. Please{" "}
              <strong>
                <a
                  href={`https://github.com/graphile/crystal/issues/new?title=${encodeURIComponent(
                    `Grafast playground: ${issueStack ?? String(error)}`,
                  )}`}
                >
                  open an issue
                </a>
              </strong>
              .
            </p>
            <p>Details:</p>
            <pre>
              <code>{String(error?.stack ?? error)}</code>
            </pre>
          </div>
        );
      }}
    >
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
    </ErrorBoundary>
  );
}
