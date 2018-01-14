// @flow
import sql from "pg-sql2";
import type { Plugin } from "graphile-build";
import { version } from "../../package.json";

const defaultPgColumnFilter = (_attr, _build, _context) => true;

export default (function PgBasicsPlugin(
  builder,
  {
    pgInflection,
    pgStrictFunctions = false,
    pgColumnFilter = defaultPgColumnFilter,
  }
) {
  builder.hook("build", build => {
    return build.extend(build, {
      graphileBuildPgVersion: version,
      pgSql: sql,
      pgInflection,
      pgStrictFunctions,
      pgColumnFilter,
    });
  });
}: Plugin);
