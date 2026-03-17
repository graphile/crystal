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
            <ul className={styles.warningProse}>
              <li>
                <a href="/postgraphile/5/grafast-for-postgraphile-users">
                  🚀 Gra<em>fast</em> engine reduces database load
                </a>
              </li>
              <li>
                <a href="/postgraphile/5/exporting-schema">
                  ⏏️ &ldquo;Eject&rdquo; function for evolution and serverless
                </a>
              </li>
              <li>
                <a href="/postgraphile/5/polymorphism">
                  🎭 Abstract types (interfaces and unions)
                </a>
              </li>
              <li>
                <a href="/postgraphile/5/extend-schema">
                  🌱 Simpler, smoother and safer <tt>extendSchema()</tt>
                </a>
              </li>
              <li>
                <a href="/postgraphile/5/customization-overview">
                  💅 More customizeable; make it your own!
                </a>
              </li>
              <li>
                <a href="/postgraphile/5/config/">
                  ⚙️ Overhauled configuration and plugin system
                </a>
              </li>
              <li>
                <a href="/postgraphile/5/requirements#typescript-v500-optional">
                  💪 Stronger types throughout; even plugins
                </a>
              </li>
            </ul>
            <div className="buttons-container">
              <Link
                className={clsx(
                  "button button--primary button--lg margin-right--md margin-bottom--md",
                  styles.button,
                )}
                to={primaryLink}
              >
                {primaryButtonText}
              </Link>
              <Link
                className={clsx(
                  "button button--primary button--outline button--lg",
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
