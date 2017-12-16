// @flow
import sql from "pg-sql2";
import type { Plugin } from "graphile-build";

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
      pgSql: sql,
      pgInflection,
      pgStrictFunctions,
      pgColumnFilter,
    });
  });
}: Plugin);
