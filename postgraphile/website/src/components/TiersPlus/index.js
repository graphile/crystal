import Link from "@docusaurus/Link";
import styles from "@site/src/components/TiersPlus/styles.module.css";
import clsx from "clsx";

const TierList = [
  {
    title: "Private Advisor Offer",
    tagline: "Development support in your chat server & code repository",
    pricing: "$999",
    annual: "$9,999",
    was: "$1,500",
    link: "https://github.com/sponsors/benjie/sponsorships?tier_id=42012",
    buttonText: "",
    contact: "mailto:team@graphile.com?subject=Private%20Advisor%20enquiry",
    contactText: "",
    description: (
      <>
        <div className={styles.description}>
          Access development support for Graphile projects through the Private
          Advisor tier, giving your organization access to the knowledge and
          experience of the Graphile team for any issues you have with{" "}
          PostGraphile, Grafast and the wider Graphile suite, and other tools in
          the ecosystem such as TypeScript, SQL, Node.js, GraphQL and more. If
          you’re running any of the Graphile tools, you won’t find anyone more
          qualified to help.
        </div>
        <ul>
          <li>All the benefits of a Featured Sponsor and...</li>
          <li>One-to-one access to the Graphile team throughout the year </li>
          <li>
            <strong>Priority support straight from the maintainer</strong>
          </li>
          <li>
            Add the Graphile team to your chat server for timely responses
          </li>
          <li>Add the Graphile team to your GitHub/GitLab organization</li>
          <li>Reference your code verbatim</li>
          <li>Calls arranged as required</li>
          <li>NDA available</li>
          <li>
            <strong>Access to discounted consultancy packages</strong>
          </li>
          <li>
            The warm feeling that comes from knowing{" "}
            <strong>
              you’re making a significant difference to PostGraphile’s
              development and sustainability
            </strong>
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
  annual,
  was,
  contact,
  contactText,
}) {
  return (
    <div className={styles.tier}>
      <div className={styles.banner}>
        <div className={styles.info}>
          <h2 className={styles.title}>{title}</h2>
          <h3 className={styles.tagline}>
            <span className={styles.was}>{was}</span>{" "}
            <span className={styles.price}>{pricing}</span>&nbsp;
            <span className={styles.note}>/month</span>
          </h3>
          <h4 className={styles.tagline}>
            <span className={styles.note}>
              or <span className={styles.tagline}>{annual}</span>&nbsp;/year -
              annual discount applied
            </span>
          </h4>
        </div>
        <div className={styles.info}>
          <Link
            className={clsx("button button--primary button--lg", styles.button)}
            to={link}
          >
            {buttonText}
          </Link>
          <Link
            className={clsx(
              "button button--outline button--lg",
              styles.borderbutton,
            )}
            to={contact}
          >
            {contactText}
          </Link>
        </div>
      </div>
      <h3 className={styles.tagline}>{tagline}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function List() {
  return (
    <section className="padding-vert--sm">
      <div className={styles.tiers}>
        <div className={clsx(styles.tierRow)}>
          {TierList.map((props, idx) => (
            <Tier key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
