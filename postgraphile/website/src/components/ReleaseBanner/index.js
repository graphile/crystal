import Link from "@docusaurus/Link";
import styles from "@site/src/components/ReleaseBanner/styles.module.css";
import V5Image from "@site/static/img/celebration.svg";

import clsx from "clsx";

import {
  faRocket,
  faEject,
  faMasksTheater,
  faSeedling,
  faPalette,
  faGears,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons"; // Import all solid icons.
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome"; // Import the FontAwesomeIcon component.

export default function ReleaseBanner({
  title,
  primaryLink,
  primaryButtonText,
  secondaryLink,
  secondaryButtonText,
}) {
  return (
    <section className={styles.banner}>
      <div className={clsx("container margin-vert--lg")}>
        <div className={clsx("row", styles.bannerRow)}>
          <div className={clsx("col col--6", styles.inner)}>
            <V5Image
              title="Fireworks and celebration"
              className={styles.v5Image}
            />
          </div>
          <div className={clsx("col col--6", styles.inner)}>
            <h2 className={styles.header}>{title}</h2>
            <ul className={styles.bannerProse}>
              <li>
                <a href="/postgraphile/5/grafast-for-postgraphile-users">
                  <Icon icon={faRocket} size="lg" />
                  Gra<em>fast</em> engine reduces database load
                </a>
              </li>
              <li>
                <a href="/postgraphile/5/exporting-schema">
                  <Icon icon={faEject} size="lg" />
                  &ldquo;Eject&rdquo; function for evolution and serverless
                </a>
              </li>
              <li>
                <a href="/postgraphile/5/polymorphism">
                  <Icon icon={faMasksTheater} size="lg" />
                  Abstract types (interfaces and unions)
                </a>
              </li>
              <li>
                <a href="/postgraphile/5/extend-schema">
                  <Icon icon={faSeedling} size="lg" />
                  Simpler, smoother and safer <tt>extendSchema()</tt>
                </a>
              </li>
              <li>
                <a href="/postgraphile/5/customization-overview">
                  <Icon icon={faPalette} size="lg" />
                  More customizable; make it your own!
                </a>
              </li>
              <li>
                <a href="/postgraphile/5/config/">
                  <Icon icon={faGears} size="lg" />
                  Overhauled configuration and plugin system
                </a>
              </li>
              <li>
                <a href="/postgraphile/5/requirements#typescript-v500-optional">
                  <Icon icon={faDumbbell} size="lg" />
                  Stronger types throughout; even plugins
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
                  styles.outlineButton,
                  "button button--primary button--outline button--lg",
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
