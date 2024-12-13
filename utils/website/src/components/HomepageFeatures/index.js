import clsx from "clsx";
import React from "react";

import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Graphile Config",
    imgsrc: "/img/graphile-config.svg",
    link: "/graphile-config/",
    description: (
      <>
        Provides a standard plugin interface and helpers which can be used
        across the entire Graphile suite
      </>
    ),
  },
  {
    title: "Graphile Export",
    imgsrc: "/img/graphile-export.svg",
    link: "/graphile-export/",
    description: (
      <>
        Export a GraphQL Schema (or other code) as executable JavaScript code!
      </>
    ),
  },
  {
    title: "tamedevil",
    imgsrc: "/img/tamedevil.svg",
    link: "/tamedevil/",
    description: <>Eval is evil, this module helps tame it!</>,
  },
  {
    title: "pg-sql2",
    imgsrc: "/img/pg-sql2.svg",
    link: "/pg-sql2/",
    description: (
      <>
        Create highly dynamic SQL in a powerful and flexible manner without
        opening yourself to SQL injection attacks.
      </>
    ),
  },
  {
    title: "pg-introspection",
    imgsrc: "/img/pg-introspection.svg",
    link: "/pg-introspection/",
    description: (
      <>
        A strongly typed PostgresSQL introspection library for PostgresSQL built
        automatically from the PostgresSQL documentation.
      </>
    ),
  },
  {
    title: "Sponsor Graphile",
    imgsrc: "/img/sponsor.svg",
    link: "https://graphile.org/sponsor",
    description: (
      <>
        Like our work? Depend on our software? We have sponsorship slots open
        for both individuals and companies!
      </>
    ),
  },
];

function Feature({ title, description, imgsrc, link }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <a href={link}>
          <img className={styles.featureSvg} src={imgsrc} alt={title}></img>
        </a>
      </div>
      <div className="text--center padding-horiz--md">
        <p>{description}</p>
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
