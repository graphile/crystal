// @flow
import sql from "pg-sql2";
import type { SQL } from "pg-sql2";

export const sqlJsonBuildObjectFromFragments = (
  fragments: Array<{ sqlFragment: SQL, alias: Symbol | string }>
) => {
  return sql.fragment`
    json_build_object(
      ${sql.join(
        fragments.map(
          ({ sqlFragment, alias }) =>
            sql.fragment`${sql.literal(alias)}, ${sqlFragment}`
        ),
        ",\n"
      )}
    )`;
};
