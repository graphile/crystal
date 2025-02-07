import styles from "@site/src/css/common.module.css";
import React from "react";

export default function Spon() {
  return (
    <>
      <span className={styles.sponTag}>
        <a href="/sponsor">
          <span className={styles.firstLetter}>S</span>pon
        </a>
      </span>
    </>
  );
}
