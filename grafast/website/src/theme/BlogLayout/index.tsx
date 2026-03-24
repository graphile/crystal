import React, { type ReactNode } from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";

import type { Props } from "@theme/BlogLayout";

export default function BlogLayout(props: Props): ReactNode {
  const { toc, children, ...layoutProps } = props;
  const bigToc = !!toc;

  return (
    <Layout {...layoutProps}>
      <div className="container margin-vert--lg">
        <div className="row">
          <main
            className={clsx("col", {
              "col--8": bigToc,
              "col--8 col--offset-2": !bigToc,
            })}
          >
            {children}
          </main>
          {toc && (
            <div
              className={clsx("col", { "col--2": !bigToc, "col--4": bigToc })}
            >
              {toc}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
