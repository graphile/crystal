import React from "react";

import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Automated",
    Svg: require("@site/static/img/automated.svg").default,
    description: (
      <>
        Don&apos;t repeat yourself, have Graphile Build do the repetative tasks
        for you.
      </>
    ),
  },
  {
    title: "Extensible",
    Svg: require("@site/static/img/extensible.svg").default,
    description: (
      <>
        Extend your schemas to do whatever you need with many different
        extension hooks.
      </>
    ),
  },
  {
    title: "Hone your API",
    Svg: require("@site/static/img/hone.svg").default,
    description: (
      <>
        Graphile Build is not rigid, its plugin based system allows you to
        override every facet of the generated API.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={styles.feature}>
      <div className={styles.svgContainer}>
        <Svg className={styles.featureSvg} role="img" alt={title} />
      </div>
      <div className={styles.featureDetails}>
        <h3 className={styles.featureInfo}>{description}</h3>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
