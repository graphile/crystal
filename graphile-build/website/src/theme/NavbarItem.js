import { useLocation } from "@docusaurus/router";
import OriginalNavBarItem from "@theme-original/NavbarItem";
import React from "react";

export default function NavbarItem(props) {
  const { docsPluginId = "graphile-build", type } = props;
  const { pathname } = useLocation();

  const expectedPath = `/${docsPluginId}/`;
  console.log(expectedPath, pathname);

  if (type === "docsVersionDropdown" && !pathname.startsWith(expectedPath)) {
    return null;
  }

  return (
    <>
      <OriginalNavBarItem {...props} />
    </>
  );
}
