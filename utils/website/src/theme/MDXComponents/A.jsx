import React from "react";
import Link from "@docusaurus/Link";
import isInternalUrl from "@docusaurus/isInternalUrl";
import IconExternalLink from "@theme/Icon/ExternalLink";

const MDXA = ({ href, children, ...props }) => (
  <Link {...props} href={href}>
    {children}
    {!isInternalUrl(href) && <IconExternalLink />}
  </Link>
);

export default MDXA;
