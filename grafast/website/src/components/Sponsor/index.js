import Link from "@docusaurus/Link";
import styles from "@site/src/components/Sponsor/styles.module.css";
import clsx from "clsx";
import React, { useContext } from "react";

import { SponsorContext } from "../../contexts/sponsor";

export default function Sponsor({
  name,
  avatar,
  href,
  contributor,
  business,
  plain,
}) {
  const level = useContext(SponsorContext);
  const showAvatar = level === "featured" || level === "leaders";
  return (
    <div
      className={clsx(
        "",
        styles.sponsor,
        styles[level],
        contributor ? styles.contributor : null,
        business ? styles.business : null,
        plain ? styles.plain : null,
      )}
    >
      {showAvatar ? (
        <img
          className={styles.avatar}
          src={"https://www.graphile.org" + avatar}
        />
      ) : null}

      <Link
        className={styles.name}
        to={href ?? "https://www.graphile.org/sponsor"}
      >
        {name}
      </Link>
    </div>
  );
}
