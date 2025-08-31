import Link from "@docusaurus/Link";
import styles from "@site/src/components/WarningSection/styles.module.css";
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
          <div className={clsx("col col--12", styles.inner)}>
            <h2 className={styles.header}>{title}</h2>
            <div className={styles.progressBarContainer}>
              <div className={v5betaStyles.progressBackground}>
                <div
                  className={v5betaStyles.progressForeground}
                  style={{ width: "95%" }}
                >
                  <div className={v5betaStyles.progressLabel}>95%</div>
                </div>
              </div>
            </div>
            <p>
              Progress towards release candidate stage.{" "}
              <Link className={styles.progressLink} to="./v5beta">
                Find out more.
              </Link>
            </p>
          </div>
        </div>
        <div className={clsx("row", styles.warningRow)}>
          <div className={clsx("col col--6", styles.inner)}>
            <h3 className={styles.warningInfo}>
              PostGraphile V5 is still work-in-progress. Whilst{" "}
              <strong>suitable to run in production</strong>, we need your help
              to get it past the finish line; please read the beta announcement{" "}
              <strong>and get involved</strong>.
            </h3>
            <p>
              PostGraphile V4 is feature frozen; it will still receive updates
              for critical security issues but all new development effort is
              going into PostGraphile V5.
            </p>

            <h3 className={styles.warningInfo}> </h3>
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
