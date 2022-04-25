import type { FC } from "react";

export const GraphileInspectFooter: FC = () => (
  <div style={{ padding: 7 }}>
    <a title="graphile.org" href="https://graphile.org/" target="new">
      graphile.org
    </a>{" "}
    |{" "}
    <a
      title="Graphile is supported by the community, please sponsor ongoing development"
      href="https://graphile.org/sponsor/"
      target="new"
    >
      Sponsor
    </a>{" "}
    |{" "}
    <a
      title="Get support from the team behind PostGraphile"
      href="https://graphile.org/support/"
      target="new"
    >
      Support
    </a>
  </div>
);
