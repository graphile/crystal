import { useLocation } from "@docusaurus/router";
import OriginalNavBarItem from "@theme-original/NavbarItem";
import React from "react";

export default function NavbarItem(props) {
  const { docsPluginId = "graphile-build", type } = props;
  const { pathname } = useLocation();

  if (
    type === "docsVersionDropdown" &&
    !pathname.startsWith(`/${docsPluginId}/`)
  ) {
    return null;
  }

  return (
    <>
      <OriginalNavBarItem {...props} />
    </>
  );
}
