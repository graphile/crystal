import "graphile-build";

import type { Plugin } from "graphile-plugin";

import { version } from "../index";

declare module "graphile-plugin" {
  interface GatherHelpers {
    pg: {
      getIntrospection(): void;
    };
  }
}

export const PgIntrospectionPlugin: Plugin = {
  name: "PgIntrospectionPlugin",
  description:
    "Introspects PostgreSQL databases and makes the results available to other plugins",
  version: version,
  gather: {
    namespace: "pg",
    helpers: {
      getIntrospection(_opts) {},
    },
  },
};
