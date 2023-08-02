import Link from "@docusaurus/Link";
import styles from "@site/src/components/WarningSection/styles.module.css";
import clsx from "clsx";
import React from "react";

export default function WarningContent({
  title,
  body,
  primaryLink,
  primaryButtonText,
  secondaryLink,
  secondaryButtonText,
}) {
  return (
    <section className={styles.warningSection}>
      <div
        className={clsx("container margin-vert--lg", styles.warningContainer)}
      >
        <div className={clsx("col col--6 padding-vert--md", styles.inner)}>
          <h2 className={styles.header}>{title}</h2>
          <p>{body}</p>
          <div className="buttons-container">
            <Link
              className={clsx(
                "button button--primary button--lg",
                styles.button,
              )}
              to={primaryLink}
            >
              {primaryButtonText}
            </Link>
            <Link
              className={clsx(
                "button button--primary button--lg",
                styles.button,
              )}
              to={secondaryLink}
            >
              {secondaryButtonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
