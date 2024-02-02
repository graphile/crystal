import styles from "@site/src/components/Sponsors/styles.module.css";
import clsx from "clsx";
import React from "react";

import { SponsorContext } from "../../contexts/sponsor";

export default function Sponsors({ children, level }) {
  return (
    <SponsorContext.Provider value={level}>
      <div className={clsx("", styles.sponsorContainer, styles[level])}>
        {children}
      </div>
    </SponsorContext.Provider>
  );
}
