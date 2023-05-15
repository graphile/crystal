import Link from "@docusaurus/Link";
import styles from "@site/src/components/CalloutSection/styles.module.css";
import clsx from "clsx";
import React from "react";

export default function CalloutContent({ title, body, link, buttonText }) {
  return (
    <section>
      <div className={clsx("container margin-vert--lg", styles.calloutSection)}>
        <div className={clsx("col col--6 padding-vert--md", styles.inner)}>
          <h2 className={styles.header}>{title}</h2>
          <p>{body}</p>
          <Link
            className={clsx("button button--primary button--lg", styles.button)}
            to={link}
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
