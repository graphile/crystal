import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Grafast from "../Grafast/index.js";

const FeatureList = [
  {
    title: "General purpose",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: (
      <>
        <Grafast /> can implement any shape of GraphQL schema and is designed to
        integrate with your existing Node.js or remote business logic.
      </>
    ),
  },
  {
    title: "Holistic approach",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: (
      <>
        Fine-tune your plans to only fetch the data you need from your business
        logic layer, reducing stress across your stack and increasing
        scalability.
      </>
    ),
  },
  {
    title: "Everything is batched",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        By writing plans instead of resolvers you ensure every substep your
        schema executes is automatically batched for optimal efficiency.
      </>
    ),
  },
  {
    title: "Spec compliant",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        <Grafast /> is carefully designed to ensure it remains fully compliant
        with the GraphQL specification (to which the author is a major
        contributor).
      </>
    ),
  },
  {
    title: "Ludicrous speed",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: (
      <>
        <Grafast /> was designed to maximize performance throughout the entire
        request lifecycle without placing undue burden on application
        developers.
      </>
    ),
  },
  {
    title: "Compatible with GraphQL.js",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: (
      <>
        Regular{" "}
        <sup>
          <abbr title="those that don't use the advanced 'resolveInfo' feature">
            *
          </abbr>
        </sup>{" "}
        GraphQL.js schemas and resolvers can be executed directly by <Grafast />
        , allowing you to migrate to plans bit by bit.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <>
      <section className={styles.lead}>
        <div className="container">
          <div className="row">
            <p>
              <strong>
                <Grafast />
              </strong>{" "}
              is an alternative execution engine for GraphQL; its plan-based
              approach helps developers avoid common pitfalls and achieve
              incredible performance.
            </p>
          </div>
        </div>
      </section>
      <section className={styles.features}>
        <div className="container">
          <div className="row">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
