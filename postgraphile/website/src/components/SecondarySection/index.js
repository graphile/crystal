import Link from "@docusaurus/Link";
import styles from "@site/src/components/SecondarySection/styles.module.css";
import clsx from "clsx";
import React from "react";

export default function SecondaryContent({
  title,
  tagline,
  body,
  Svg,
  link,
  buttonText,
}) {
  return (
    <section className={styles.secondarySection}>
      <div className="container">
        <div className={clsx("row", styles.secondaryRow)}>
          <div className="col col--6">
            <Svg className={styles.secondarySvg} role="img" />
          </div>
          <div className="col col--6">
            <div>
              <h2 className={styles.header}>{title}</h2>
              <h3 className={styles.tagline}>{tagline}</h3>
              <p>{body}</p>
              <Link
                className={clsx(
                  "button button--outline button--lg margin-left--none margin-right--md",
                  styles.button,
                )}
                to={link}
              >
                {buttonText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
