import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import CalloutSection from "@site/src/components/CalloutSection";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";
import HeroImage from "@site/static/img/introspection.svg";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className="container">
        <div className={clsx("row", styles.heroRow)}>
          <div className="col col--6">
            <h1 className={clsx("padding-vert--md", styles.hero)}>
              {siteConfig.tagline}
            </h1>
            <div className={styles.buttons}>
              <Link
                className={clsx(
                  "button button--primary button--lg margin-left--none margin-right--md",
                  styles.buttonHero,
                )}
                to="/graphile-build/"
              >
                Documentation
              </Link>
            </div>
          </div>
          <div className="col col--6">
            <HeroImage
              title="Coder uses magnifying glass to introspect his code on the monitor"
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  // const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Graphile Build`}
      description="Automate the boring parts of building GraphQL APIs"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <CalloutSection
          title={`Crowd-funded open-source software`}
          body={`We're extremely grateful to our sponsors, for helping to fund ongoing development on PostGraphile, Graphile Engine, Graphile Worker and Graphile Migrate.
          THANK YOU!`}
          link={`https://graphile.org/sponsor/`}
          buttonText={`Learn more about sponsors and sponsorship`}
        />
      </main>
    </Layout>
  );
}
