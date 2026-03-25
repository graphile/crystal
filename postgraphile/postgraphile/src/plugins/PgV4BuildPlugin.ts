import "graphile-config";
import "graphile-build";
import "graphile-build-pg";

declare global {
  namespace GraphileBuild {
    interface Build {
      /** @deprecated Use build.sql instead */
      pgSql: GraphileBuild.Build["sql"];
    }
  }
  namespace GraphileConfig {
    interface Plugins {
      PgV4BuildPlugin: true;
    }
  }
}

export const PgV4BuildPlugin: GraphileConfig.Plugin = {
  name: "PgV4BuildPlugin",
  description:
    "For compatibility with PostGraphile v4 schemas, this plugin restores some properties removed from `build`",
  version: "0.0.0",

  schema: {
    hooks: {
      build: {
        after: ["PgBasicsPlugin"],
        callback(build) {
          build.pgSql = build.sql;
          return build;
        },
      },
    },
  },
};
