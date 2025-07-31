import Link from "@docusaurus/Link";
import styles from "@site/src/components/TiersPlus/styles.module.css";
import clsx from "clsx";
import React from "react";

const TierList = [
  {
    title: "Monthly Plan",
    tagline: "Pay month-to-month with full flexibility",
    pricing: "$999",
    was: "$1,500",
    link: "https://github.com/sponsors/benjie/sponsorships?tier_id=42012",
    buttonText: "Start Monthly Plan",
    frequency: "/mo",
    comparison: "Cancel any time",
    badge: "Updated August 2025",
    description: (
      <>
        <ul>
          <li>
            Start today with <strong>payment through GitHub</strong>
          </li>
          <li>
            <strong>Flexible</strong>
          </li>
          <li>New lower price for 2025</li>
          <li>
            <strong>Access to discounted consultancy packages</strong>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Annual Plan",
    tagline: "Maximum savings with full year commitment",
    pricing: "$899",
    hint: "10% discount",
    //was: "$11,988",
    link: "mailto:team@graphile.com?subject=Private%20Advisor%20enquiry",
    buttonText: "Contact Graphile",
    frequency: "/mo",
    comparison: "Paid annually — $10,788/yr",
    badge: "Best Value — Save $1,200",
    featured: true,
    description: (
      <>
        <ul>
          <li>
            <strong>Lock in your rate</strong> for a full year
          </li>

          <li>
            <strong>Save money</strong> — pay once, enjoy the lowest rate
          </li>
          <li>
            <strong>One invoice, one payment</strong> — no monthly admin
            headaches
          </li>
          <li>
            <strong>Access to discounted consultancy packages</strong>
          </li>
          <li>
            <strong>Formal contract</strong> for your procurement process
          </li>
        </ul>
      </>
    ),
  },
];

function Tier({
  title,
  tagline,
  link,
  buttonText,
  description,
  pricing,
  was,
  frequency,
  comparison,
  badge,
  featured,
  hint,
}) {
  return (
    <div className={clsx(styles.tier, featured ? styles.featured : null)}>
      {badge ? <div className={styles.badge}>{badge}</div> : null}
      <div className={styles.banner}>
        <div className={styles.info}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.tagline}>{tagline}</div>
          <div className={styles.priceline}>
            {was ? <span className={styles.was}>{was}</span> : null}{" "}
            <span className={styles.price}>
              {pricing}
              <span className={styles.pricesub}>{frequency}</span>
            </span>
            {hint ? <span className={styles.hint}>{hint}</span> : null}
          </div>
          <div className={styles.qualifierline}>
            <span className={styles.note}>{comparison}</span>
          </div>
        </div>
        <div className={styles.info}>
          <Link
            className={clsx("button button--primary button--lg", styles.button)}
            to={link}
          >
            {buttonText}
          </Link>
        </div>
      </div>
      <div className={styles.description}>{description}</div>
    </div>
  );
}

export default function List() {
  return (
    <div className={styles.tiers}>
      <div className={clsx(styles.tierRow)}>
        {TierList.map((props, idx) => (
          <Tier key={idx} {...props} />
        ))}
      </div>
    </div>
  );
}
