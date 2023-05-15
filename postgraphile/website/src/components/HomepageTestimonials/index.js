import styles from "@site/src/components/HomepageTestimonials/styles.module.css";
import clsx from "clsx";
import React from "react";

const TestimonialList = [
  {
    author: "Max D.",
    title: "Software Consultant, London",
    src: "https://desiatov.com/why-graphql/",
    image: require("@site/static/img/testimonials/maxd.jpg").default,
    quote: (
      <>
        Recently I launched a few mobile and web apps using GraphQL, Great
        stuff, not least thanks to wonderful PostGraphile and Apollo. At this
        point, it&apos;s quite hard for me to come back and enjoy working with
        REST.
      </>
    ),
  },
  {
    author: "Chad F.",
    title: "Senior Technical Lead, Clevertech",
    image: require("@site/static/img/testimonials/chadf.png").default,
    src: "https://desiatov.com/why-graphql/",
    quote: (
      <>
        Thanks for making GraphQL something I can use on my project in a robust
        way with minimal effort. 500-1500 requests per second on a single server
        is pretty awesome.
      </>
    ),
  },
  {
    author: "Sam L.",
    title: "Full-stack Developer, Boston",
    image: require("@site/static/img/testimonials/saml.png").default,
    src: "",
    quote: (
      <>
        This project, Benjie&apos;s handling of it, the docs, support, and
        community is awesome all around. PostGraphile is a powerful, idomatic,
        and elegant tool.
      </>
    ),
  },
];

function Testimonial({ author, quote, title, image }) {
  return (
    <div className={clsx("col col--4", styles.testimonial)}>
      <div className="quote">
        <p>{quote}</p>
      </div>
      <div className={styles.credit}>
        <div className={styles.creditAvatar}>
          <img src={image} />
        </div>
        <div className={styles.creditAuthorDetails}>
          <div className={styles.creditAuthor}>
            <strong>{author}</strong>
          </div>
          <div className={styles.creditTitle}>{title}</div>
        </div>
      </div>
    </div>
  );
}

export default function HomepageTestimonials() {
  return (
    <section className={styles.testimonials}>
      <div className="container">
        <div className={clsx("row", styles.row)}>
          {TestimonialList.map((props, idx) => (
            <Testimonial key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
