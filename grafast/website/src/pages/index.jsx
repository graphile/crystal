import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";
import Head from "@docusaurus/Head";

import styles from "./index.module.css";
import boardStyles from "./board.module.css";
import GrafastLogo from "@site/static/img/grafast-wordmark.svg";
import Grafast from "../components/Grafast";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <div className="row">
          <div className={"col col--6 " + styles.alignSelfCenter}>
            <div className={boardStyles.boardContainer}>
              <div className={boardStyles.board}>
                <div className={boardStyles.b1}>
                  <div className={boardStyles.b2}>
                    <div className={boardStyles.b3}>
                      <div className={boardStyles.pin}>
                        <div className={boardStyles.dot1}></div>
                        <div className={boardStyles.dot2}></div>
                        <div className={boardStyles.line1}></div>
                        <div className={boardStyles.line2}></div>
                        <div className={boardStyles.dot3}></div>
                      </div>
                      The future of efficiency is here: add planning to your
                      schema!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col col--6">
            <div>
              <GrafastLogo
                className={styles.featureSvg}
                role="img"
                alt={"Grafast!"}
              />
            </div>
            <p className={styles.heroSubtitle}>
              <strong>Significantly reduce GraphQL-related load</strong> across
              your entire backend stack by leveraging the declarative nature of
              GraphQL.
            </p>
            <div className={styles.buttons}>
              <Link
                className="button button--secondary button--lg"
                to="/grafast/"
              >
                Overview - 5min ⏱️
              </Link>
            </div>
          </div>
        </div>
        {/*<p className="hero__subtitle">{siteConfig.tagline}</p>*/}
        {/*
        <p>
          Grafast's plan-based approach helps developers avoid common pitfalls
          and achieve better backend efficiency, leading to increased
          scalability and incredible performance your customers will love.
        </p>
        */}
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Sriracha&display=swap"
        />
      </Head>
      <div className={styles.divider}></div>
      <HomepageHeader />
      <div className={styles.divider}></div>
      <main>
        <HomepageFeatures />
      </main>
      <div className={styles.divider}></div>
      <section className={styles.subscribeSection}>
        <div className="container">
          <form
            action="https://graphile.us16.list-manage.com/subscribe/post?u=d103f710cf00a9273b55e8e9b&amp;id=c3a9eb5c4e&amp;f_id=00536ce0f0"
            method="post"
            id="mc-embedded-subscribe-form"
            name="mc-embedded-subscribe-form"
            className="validate"
            target="_self"
          >
            <div className={styles.instruction}>
              An interested visitor joins the Graphile mailing list:
            </div>
            <div
              style={{ position: "absolute", left: -5000 }}
              aria-hidden="true"
            >
              <input
                type="text"
                name="b_d103f710cf00a9273b55e8e9b_c3a9eb5c4e"
                tabindex="-1"
                value=""
              />
            </div>
            <div className={styles.subscribe}>
              <input
                placeholder="email@example.com"
                type="email"
                value=""
                name="EMAIL"
                className="required email"
                id="mce-EMAIL"
                required
              />
              <div hidden="true">
                <input type="hidden" name="tags" value="3434552" />
              </div>
              <input
                type="submit"
                value="Subscribe!"
                name="subscribe"
                id="mc-embedded-subscribe"
                className="button"
              />
            </div>
          </form>
        </div>
      </section>
      {/*
      <p>
        Eliminating over-fetching, under-fetching, and the N+1 problem are just
        the first step in your <Grafast /> "journey to efficiency".
      </p> */}
      <div className={styles.divider}></div>
    </Layout>
  );
}
