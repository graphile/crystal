import Link from "@docusaurus/Link";
import styles from "@site/src/components/HomepageTools/styles.module.css";
import clsx from "clsx";
import React from "react";

const ToolList = [
  {
    title: "Graphile Worker",
    tagline: "High performance Node.js/PostgreSQL job queue",
    link: "https://github.com/graphile/worker",
    buttonText: "Documentation",
    stars:
      "https://img.shields.io/github/stars/graphile/worker?label=star&style=social",
    description: (
      <>
        Run jobs (e.g. sending emails, generating PDFs, …) &quot;in the
        background&quot; so that your HTTP response code is not held up. Starts
        jobs almost instantly (2ms latency). Used with any PostgreSQL-backed
        application.
      </>
    ),
  },
  {
    title: "Graphile Migrate",
    tagline:
      "Opinionated SQL-powered productive roll-forward migration tool for PostgreSQL",
    link: "https://github.com/graphile/migrate",
    buttonText: "Documentation",
    stars:
      "https://img.shields.io/github/stars/graphile/migrate?label=star&style=social",
    description: (
      <>
        Experimental, being developed in the open. Focuses on fast iteration
        speed.
      </>
    ),
  },
];

function Tool({ title, tagline, link, buttonText, description, stars }) {
  return (
    <div className={clsx("col col--4", styles.tool)}>
      <div className="padding-horiz--md padding-top--lg">
        <h2>{title}</h2>
        <h3 className={styles.tagline}>{tagline}</h3>
        <p>{description}</p>
      </div>
      <div
        className={clsx("padding-horiz--md padding-bottom--lg", styles.buttons)}
      >
        <Link
          className={clsx(
            "button button--primary button--lg margin-left--none margin-right--md",
            styles.button,
          )}
          to={link}
        >
          {buttonText}
        </Link>
        <Link to={link}>
          <img className={styles.githubButton} src={stars} />
        </Link>
      </div>
    </div>
  );
}

export default function HomepageTools() {
  return (
    <section className={clsx("padding-vert--lg", styles.tools)}>
      <div className="container">
        <h2 className={clsx("padding-bottom--lg", styles.header)}>
          Database tools
        </h2>
        <div className={clsx("row", styles.toolRow)}>
          {ToolList.map((props, idx) => (
            <Tool key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
