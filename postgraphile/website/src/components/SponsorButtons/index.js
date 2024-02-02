import Link from "@docusaurus/Link";
import styles from "@site/src/components/SponsorButtons/styles.module.css";
import clsx from "clsx";
import React from "react";

export default function SponsorButtons() {
  return (
    <div className={clsx(styles.sponsorbuttons)}>
      <Link
        className={clsx(
          "button button--primary button--lg",
          styles.sponsorbutton,
        )}
        to="https://github.com/users/benjie/sponsorship"
      ></Link>
      <Link
        className={clsx(
          "button button--outline button--lg",
          styles.borderbutton,
        )}
        to="https://graphile.org"
      ></Link>
    </div>
  );
}
