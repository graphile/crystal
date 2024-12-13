import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <img
          className=""
          src="/img/graphile-star.svg"
          alt="Graphile-Star the wildcards of the Graphile universe"
        ></img>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/graphile-config"
          >
            Continue to Docs
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  // const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Graphile*`}
      description="the stars we forge to build our universe"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
