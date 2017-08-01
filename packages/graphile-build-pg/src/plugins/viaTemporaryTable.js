// @flow

import sql from "pg-sql2";
import debugFactory from "debug";
import type { Client } from "pg";
import type { SQL, OpaqueSQLQuery } from "pg-sql2";

const debugSql = debugFactory("graphile-build-pg:sql");

/*
 * Originally we tried this with a CTE, but:
 *
 * > The sub-statements in WITH are executed concurrently with each other and
 * > with the main query. Therefore, when using data-modifying statements in
 * > WITH, the order in which the specified updates actually happen is
 * > unpredictable. All the statements are executed with the same snapshot (see
 * > Chapter 13), so they cannot "see" one another's effects on the target
 * > tables. This alleviates the effects of the unpredictability of the actual
 * > order of row updates, and means that RETURNING data is the only way to
 * > communicate changes between different WITH sub-statements and the main
 * > query.
 *
 * -- https://www.postgresql.org/docs/9.6/static/queries-with.html
 *
 * This caused issues with computed columns that themselves went off and
 * performed selects - because the data within those selects used the old
 * snapshot and thus returned stale data.
 *
 * To solve this, we tried using temporary tables to ensure the mutation and
 * the select execute in different statments. This worked, but temporary tables
 * require elevated priviliges and thus don't work everywhere. We needed a more
 * generic solution.
 *
 * In the end we settled for sending the data we received from the mutations
 * straight back into the PostgreSQL server. It's a bit wasteful but it works.
 *
 * If you can come up with a better solution please open a pull request!
 */

export default async function viaTemporaryTable(
  pgClient: Client,
  sqlTypeIdentifier: ?SQL,
  sqlMutationQuery: SQL,
  sqlResultSourceAlias: SQL,
  sqlResultQuery: SQL,
  isPgClassLike: boolean = true
) {
  async function performQuery(pgClient: Client, sqlQuery: OpaqueSQLQuery) {
    const { text, values } = sql.compile(sqlQuery);
    if (debugSql.enabled) debugSql(text);
    return pgClient.query(text, values);
  }

  if (!sqlTypeIdentifier) {
    // It returns void, just perform the query!
    return await performQuery(
      pgClient,
      sql.query`
      with ${sqlResultSourceAlias} as (
        ${sqlMutationQuery}
      ) ${sqlResultQuery}`
    );
  } else {
    const { rows } = await performQuery(
      pgClient,
      sql.query`
      with ${sqlResultSourceAlias} as (
        ${sqlMutationQuery}
      )
      select ${isPgClassLike
        ? sqlResultSourceAlias
        : sql.query`${sqlResultSourceAlias}.${sqlResultSourceAlias}`}::${sqlTypeIdentifier} from ${sqlResultSourceAlias}`
    );
    const values = rows.map(row => row[Object.keys(row)[0]]);
    return await performQuery(
      pgClient,
      sql.query`
      with ${sqlResultSourceAlias} as (
        select ${isPgClassLike
          ? sql.query`(str::${sqlTypeIdentifier}).*`
          : sql.query`str::${sqlTypeIdentifier} as ${sqlResultSourceAlias}`}
        from unnest((${sql.value(values)})::${sqlTypeIdentifier}[]) str
      )
      ${sqlResultQuery}`
    );
  }
}
