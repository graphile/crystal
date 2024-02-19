import styles from "@site/src/css/common.module.css";
import React from "react";

export default function Pro() {
  return (
    <>
      <span className={styles.proTag}>
        <a href="/pricing/">
          <span className={styles.firstLetter}>P</span>ro
        </a>
      </span>
    </>
  );
}
