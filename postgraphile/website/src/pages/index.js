import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import CalloutSection from "@site/src/components/CalloutSection";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import HomepageTestimonials from "@site/src/components/HomepageTestimonials";
import HomepageTools from "@site/src/components/HomepageTools";
import SecondarySection from "@site/src/components/SecondarySection";
import TertiarySection from "@site/src/components/TertiarySection";
import WarningSection from "@site/src/components/WarningSection";
import styles from "@site/src/pages/index.module.css";
import HeroImage from "@site/static/img/homepage/coder.svg";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className="container">
        <div className={clsx("row", styles.heroRow)}>
          <div className="col col--6">
            <div className={styles.github}>
              <Link to="https://github.com/graphile/postgraphile">
                <img
                  className={styles.githubButton}
                  src="https://img.shields.io/github/stars/graphile/postgraphile?label=Star&style=social"
                />
              </Link>
            </div>
            <h1 className={clsx("padding-vert--md", styles.hero)}>
              {siteConfig.tagline}
            </h1>
            <div className={styles.buttons}>
              <Link
                className={clsx(
                  "button button--primary button--lg margin-left--none margin-right--md",
                  styles.buttonHero,
                )}
                to="/postgraphile/next"
              >
                Documentation
              </Link>
              <Link
                className={clsx(
                  "button button--outline button--lg margin-left--none",
                  styles.buttonHero,
                  styles.buttonHeroOutline,
                )}
                to="/postgraphile/next"
              >
                Overview - 5min ⏱
              </Link>
            </div>
          </div>
          <div className="col col--6">
            <HeroImage
              title="Coder sat at monitor"
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  //const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`PostGraphile`}
      description="Extensible high-performance automatic GraphQL API for PostgresSQL"
    >
      <WarningSection
        title={`PostGraphile Version 5 early access!`}
        body={`This website and the associated software is still a work-in-progress. Whilst suitable to run in production, we anticipate a small number of breaking changes over the coming weeks and the documentation is not yet complete. Please feel free to send pull requests or let us know of any gaps, we hope you have fun!`}
        primaryLink={`https://graphile.org/sponsor/`}
        primaryButtonText={`Beta Announcement`}
        secondaryLink={`/postgraphile/next/migrating-from-v4/`}
        secondaryButtonText={`V4 Migration Guide`}
      />
      <HomepageHeader />
      <main>
        <HomepageTestimonials />
        <HomepageFeatures />
        <SecondarySection
          title={`Graphile Starter`}
          tagline={`A quick-start project for full-stack application development in React, Node.js, GraphQL and PostgreSQL`}
          body={`Graphile Starter includes the foundations of a modern web application, with a full user registration system, session management, optimised job queue, pre-configured tooling, tests and much more.`}
          Svg={require("@site/static/img/homepage/starter.svg").default}
          link={`https://github.com/graphile/starter`}
          buttonText={`Learn more`}
        />
        <HomepageTools />
        <CalloutSection
          title={`Crowd-funded open-source software`}
          body={`We're extremely grateful to our sponsors, for helping to fund ongoing development on PostGraphile, Graphile Engine, Graphile Worker and Graphile Migrate.
          THANK YOU!`}
          link={`https://graphile.org/sponsor/`}
          buttonText={`Learn more about sponsors and sponsorship`}
        />
        <TertiarySection
          title={`Development Support`}
          tagline={`Priority text support straight from the maintainer`}
          body={`Give your company access to the knowledge and experience of the Graphile team through your chat server and GitHub/GitLab organisation. Reference your code verbatim and arrange calls for any trickier topics.`}
          Svg={require("@site/static/img/homepage/support.svg").default}
          link={`https://www.graphile.org/support/`}
          buttonText={`Learn more`}
        />
        <SecondarySection
          title={<>Advanced planning and execution engine for GraphQL</>}
          tagline={
            <>
              Gra<em>fast</em>&rsquo;s plan-based approach helps developers
              avoid common pitfalls and achieve better backend efficiency,
              leading to increased scalability and incredible performance your
              customers will love.
            </>
          }
          body={``}
          Svg={require("@site/static/img/homepage/grafast.svg").default}
          link={`https://grafast.org/`}
          buttonText={`Learn more`}
        />
      </main>
    </Layout>
  );
}
