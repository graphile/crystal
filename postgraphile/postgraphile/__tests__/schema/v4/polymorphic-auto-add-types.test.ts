import { MutationPlugin, NodePlugin } from "graphile-build";

import * as core from "./core.js";

const HideApplicationsAndVulnerabilitiesPlugin: GraphileConfig.Plugin = {
  name: "HideApplicationsAndVulnerabilitiesPlugin",
  version: "0.0.0",

  schema: {
    entityBehavior: {
      pgResource: {
        override(behavior, entity) {
          const n = entity.name.toLowerCase();
          if (n.endsWith("applications") || n.endsWith("vulnerabilities")) {
            return [behavior, "-single", "-connection"] as any;
          }
          return behavior;
        },
      },
      pgResourceUnique: {
        override(behavior, [resource, unique]) {
          const n = resource.name.toLowerCase();
          if (n.endsWith("applications") || n.endsWith("vulnerabilities")) {
            return [behavior, "-single", "-connection"] as any;
          }
          return behavior;
        },
      },
      pgCodecRelation: {
        override(behavior, relation) {
          const n = relation.remoteResource.name.toLowerCase();
          if (n.endsWith("applications") || n.endsWith("vulnerabilities")) {
            return [behavior, "-single", "-connection"] as any;
          }
          return behavior;
        },
      },
    },
  },
};

test(
  "prints a schema for polymorphic",
  core.test(
    __filename,
    ["polymorphic"],
    {
      skipPlugins: [MutationPlugin, NodePlugin],
      appendPlugins: [HideApplicationsAndVulnerabilitiesPlugin],
    },
    (pgClient) => {
      return pgClient.query(
        `\
comment on table c.person_secret is E'@foreignKey (sekrit) references c.person (about)\\n@deprecated This is deprecated (comment on table c.person_secret).\\nTracks the person''s secret';
ALTER TABLE "c"."person" ADD UNIQUE ("about");
`,
      );
    },
  ),
);
