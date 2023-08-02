import styles from "@site/src/components/HomepageFeatures/styles.module.css";
import clsx from "clsx";
import React from "react";

const FeatureList = [
  {
    title: "Get started in seconds",
    Svg: require("@site/static/img/homepage/clock.svg").default,
    description: (
      <>
        <code>npx postgraphile -c postgres://...</code> and you&apos;re running
        ─ try it out without investing large amounts of time!
      </>
    ),
  },
  {
    title: "Craft your perfect API",
    Svg: require("@site/static/img/homepage/code.svg").default,
    description: (
      <>
        Don&apos;t just take our defaults, spend a few minutes honing your API
        so it&apos;s the shape that you&apos;ll want it to be for years to come.
      </>
    ),
  },
  {
    title: "Versatile",
    Svg: require("@site/static/img/homepage/versatile.svg").default,
    description: (
      <>
        Whether you&apos;re building the backend API for your SaaS, build
        internal tooling for your business, or anything else, PostGraphile has
        your back.
      </>
    ),
  },
  {
    title: (
      <>
        Powered by Gra<em>fast</em>
      </>
    ),
    Svg: require("@site/static/img/homepage/fast.svg").default,
    description: (
      <>
        PostGraphile Version 5 is built upon a new, powerful and pleasant
        planning and execution engine,{" "}
        <a href="https://grafast.org">
          Gra<em>fast</em>
        </a>
        , which brings with it a new, holistic approach and simpler
        abstractions, better performance and code which is easier to read and
        maintain.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--6 padding-vert--md", styles.feature)}>
      <div className={styles.svgContainer}>
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className={styles.featureDetails}>
        <h2 className={styles.featureTitle}>{title}</h2>
        <h3 className={styles.featureInfo}>{description}</h3>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={clsx("row", styles.row)}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
