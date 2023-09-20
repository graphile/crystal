import clsx from "clsx";
import React from "react";

import Grafast from "../Grafast/index.jsx";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "General purpose",
    Svg: require("@site/static/img/generalpurpose2.svg").default,
    description: (
      <>
        <Grafast /> can implement any shape of GraphQL schema and is designed to
        integrate with your existing Node.js or remote business logic.
      </>
    ),
  },
  {
    title: "Holistic approach",
    Svg: require("@site/static/img/holistic2.svg").default,
    description: (
      <>
        Fine-tune your plans to only fetch the data you need from your business
        logic layer, reducing stress across your stack and increasing
        scalability.
      </>
    ),
  },
  /*
  {
    title: "Everything is batched",
    Svg: require("@site/static/img/batched.svg").default,
    description: (
      <>
        By writing plans instead of resolvers you ensure every substep your
        schema executes is automatically batched for optimal efficiency.
      </>
    ),
  },
  */
  /*
  {
    title: "Spec compliant",
    Svg: require("@site/static/img/speccompliant.svg").default,
    description: (
      <>
        <Grafast /> is carefully designed to ensure it remains fully compliant
        with the GraphQL specification (to which the author is a major
        contributor).
      </>
    ),
  },
  */
  {
    title: "Ludicrous speed",
    Svg: require("@site/static/img/ludicrousspeed2.svg").default,
    description: (
      <>
        <Grafast /> was designed to maximize performance throughout the entire
        request lifecycle without placing undue burden on application
        developers.
      </>
    ),
  },
  {
    title: "And so much more!",
    Svg: require("@site/static/img/andmore2.svg").default,
    description: (
      <>
        Eliminating over-fetching, under-fetching, and the N+1 problem are just
        the first step in your <Grafast /> &ldquo;journey to efficiency&rdquo;.
      </>
    ),
  },
  /*
  {
    title: "Compatible with GraphQL.js",
    Svg: require("@site/static/img/graphqljscompatability.svg").default,
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
  */
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--6")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <div className={styles.featuresContainer}>
      <section className={styles.lead}>
        <div className="container">
          <div className="row">
            <div className={styles.mainSectionInstructionContainer}>
              <div className={styles.instruction}>
                Introducing Gra<em>fast</em>: a next-generation planning and
                execution engine for GraphQL!
              </div>
            </div>
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
    </div>
  );
}
