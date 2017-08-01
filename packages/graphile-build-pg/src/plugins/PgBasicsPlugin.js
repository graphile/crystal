// @flow
import sql from "pg-sql2";
import type { Plugin } from "graphile-build";

export default (function PgBasicsPlugin(
  builder,
  { pgInflection, pgStrictFunctions = false }
) {
  builder.hook("build", build => {
    return build.extend(build, {
      pgSql: sql,
      pgInflection,
      pgStrictFunctions,
    });
  });
}: Plugin);
