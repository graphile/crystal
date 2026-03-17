import React, { type ReactNode } from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import BlogSidebar from "@theme/BlogSidebar";

import type { Props } from "@theme/BlogLayout";

export default function BlogLayout(props: Props): ReactNode {
  const { sidebar, toc, children, ...layoutProps } = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;

  return (
    <Layout {...layoutProps}>
      <div className="container margin-vert--lg">
        <div className="row">
          <main className={clsx("col", "col--8 col--offset-1")}>
            {children}
          </main>
          {toc || hasSidebar ? (
            <aside className="col col--3">
              {toc}
              <BlogSidebar sidebar={sidebar} />
            </aside>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
