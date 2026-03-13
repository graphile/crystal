import Link from "@docusaurus/Link";
import styles from "@site/src/components/WarningSection/styles.module.css";
import V5Image from "@site/static/img/celebration.svg";

import v5betaStyles from "@site/src/pages/v5beta.module.css";
import clsx from "clsx";
import React from "react";

export default function WarningContent({
  title,
  primaryLink,
  primaryButtonText,
  secondaryLink,
  secondaryButtonText,
}) {
  return (
    <section className={styles.warningSection}>
      <div className={clsx("container margin-vert--lg")}>
        <div className={clsx("row", styles.warningRow)}>
          <div className={clsx("col col--6", styles.inner)}>
            <V5Image
              title="Fireworks and celebration"
              className={styles.v5Image}
            />
          </div>
          <div className={clsx("col col--6", styles.inner)}>
            <h2 className={styles.header}>{title}</h2>
            <p className={styles.warningProse}>
              A ground-up re-architecture focused on long-term maintainability,
              extensibility, performance, and correctness — whilst staying true
              to PostGraphile's original goal:
            </p>
            <p className={styles.warningProseStrong}>
              Implementing the obvious so you need only write code that truly
              delivers value.
            </p>
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
      </div>
    </section>
  );
}
