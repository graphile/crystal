import React from "react";
import clsx from "clsx";
import styles from "../index.module.css";
export default function FooterLayout({ style, links, logo, copyright }) {
  return (
    <div>
      <div className={styles.footerImage}></div>

      <footer
        className={clsx("footer", {
          "footer--dark": style === "dark",
        })}
      >
        <div className="container container-fluid">
          {links}
          {(logo || copyright) && (
            <div className="footer__bottom text--center">
              {logo && <div className="margin-bottom--sm">{logo}</div>}
              {copyright}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
