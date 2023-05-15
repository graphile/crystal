import Link from "@docusaurus/Link";
import styles from "@site/src/components/TertiarySection/styles.module.css";
import clsx from "clsx";
import React from "react";

export default function TertiaryContent({
  title,
  tagline,
  body,
  Svg,
  link,
  buttonText,
}) {
  return (
    <section className={styles.tertiarySection}>
      <div className="container">
        <div className={clsx("row", styles.tertiaryRow)}>
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
          <div className="col col--6">
            <Svg className={styles.tertiarySvg} role="img" />
          </div>
        </div>
      </div>
    </section>
  );
}
