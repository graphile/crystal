import Link from "@docusaurus/Link";
import styles from "@site/src/components/Tiers/styles.module.css";
import clsx from "clsx";

const TierList = [
  {
    title: "Supporter",
    tagline: "Thank you!",
    pricing: "$25",
    link: "https://github.com/sponsors/benjie/sponsorships?tier_id=369",
    buttonText: "",
    description: (
      <>
        <ul>
          <li>
            Your name on the{" "}
            <Link to="https://graphile.org/sponsor">
              Graphile Sponsors page
            </Link>
          </li>
          <li>
            Your name among those randomly featured in the PostGraphile CLI
          </li>
          <li>Post job opportunities to our Discord community</li>
          <li>PostGraphile stickers</li>
          <li>Access to the #supporter-lounge on Discord</li>
          <li>
            The warm feeling from knowing you’re supporting Open Source Software
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Production Sponsor",
    tagline: "Support sustainability",
    pricing: "$100",
    link: "https://github.com/sponsors/benjie/sponsorships?tier_id=368",
    buttonText: "",
    description: (
      <>
        <ul>
          <li>The Supporter tier benefits and...</li>
          <li>
            Access to <strong>private security announcements</strong>
          </li>
          <li>
            Free access to{" "}
            <strong>
              <Link to="/pricing">PostGraphile V4 Pro</Link>
            </strong>
          </li>
          <li>
            Access to{" "}
            <Link to="https://github.com/graphile-pro">
              <strong>graphile-pro</strong>
            </Link>
          </li>
          <li>
            Your name and <strong>avatar/logo</strong> featured on our websites,
            including this one
          </li>
          <li>
            Your name <strong>more frequently featured</strong> in the
            PostGraphile CLI
          </li>
          <li>
            The warm feeling that comes from knowing you’re making a difference
            to PostGraphile’s development and sustainability
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Featured Sponsor",
    tagline: "Get featured in the project",
    pricing: "$500",
    link: "https://github.com/sponsors/benjie/sponsorships?tier_id=367",
    buttonText: "",
    description: (
      <>
        <ul>
          <li>The Production tier benefits and...</li>
          <li>
            Your name and avatar/logo{" "}
            <strong>
              featured in the READMEs of Graphile’s main OSS projects
            </strong>{" "}
            (shown on GitHub and npm)
          </li>
          <li>
            Your name and <strong>avatar/logo prominently featured </strong>on
            our websites
          </li>
          <li>
            Your name <strong>even more frequently featured</strong> in the
            PostGraphile CLI
          </li>
          <li>
            Access to <strong>#vip-lounge</strong> on Discord
          </li>
          <li>
            Free access to{" "}
            <strong>
              <Link to="https://pgrita.com">pgRITA</Link>
            </strong>
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

function Tier({ title, tagline, link, buttonText, description, pricing }) {
  return (
    <div className={styles.tier}>
      <div className={styles.banner}>
        <h2 className={styles.title}>{title}</h2>
        <h3 className={styles.priceline}>
          <span className={styles.price}>{pricing}</span>
          <span className={styles.note}>/mo</span>
        </h3>
      </div>
      <Link
        className={clsx("button button--primary button--lg", styles.button)}
        to={link}
      >
        {buttonText}
      </Link>
      <h3 className={styles.tagline}>{tagline}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function List() {
  return (
    <section className={clsx("padding-vert--md")}>
      <div className={clsx("", styles.tiers)}>
        <div className={clsx(styles.tierRow)}>
          {TierList.map((props, idx) => (
            <Tier key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
