import Link from "@docusaurus/Link";
import styles from "@site/src/components/Sponsor/styles.module.css";
import clsx from "clsx";
import React, { useContext } from "react";

import FallbackAvatar from "@site/static/img/avatar.svg";
import { SponsorContext } from "../../contexts/sponsor";

function Avatar({ src }) {
  return src ? (
    <img className={styles.avatar} src={src} />
  ) : (
    <FallbackAvatar className={styles.avatar} />
  );
}

function LinkTo({ href, name }) {
  return href ? (
    <Link className={styles.name} to={href}>
      {name}
    </Link>
  ) : (
    <div className={styles.name}>{name}</div>
  );
}

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
        <Avatar src={avatar ? "https://www.graphile.org" + avatar : null} />
      ) : null}

      <LinkTo href={href} name={name} />
    </div>
  );
}
