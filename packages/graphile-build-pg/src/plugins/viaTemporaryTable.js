// @flow

import sql from "pg-sql2";
import debugFactory from "debug";
import type { Client } from "pg";
import type { SQL, OpaqueSQLQuery } from "pg-sql2";

const debugSql = debugFactory("graphile-build-pg:sql");

/*
   * Originally we tried this with a CTE, but:
   *
   * > The sub-statements in WITH are executed concurrently
   * > with each other and with the main query. Therefore, when
   * > using data-modifying statements in WITH, the order in
   * > which the specified updates actually happen is
   * > unpredictable. All the statements are executed with the
   * > same snapshot (see Chapter 13), so they cannot "see" one
   * > another's effects on the target tables. This alleviates
   * > the effects of the unpredictability of the actual order
   * > of row updates, and means that RETURNING data is the only
   * > way to communicate changes between different WITH
   * > sub-statements and the main query.
   *
   * -- https://www.postgresql.org/docs/9.6/static/queries-with.html
   *
   * This caused issues with computed columns that themselves
   * went off and performed selects - because the data within
   * those selects used the old snapshot and thus returned
   * stale data. To solve this, we now use temporary tables to
   * ensure the mutation and the select execute in different
   * statments.
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
    const sqlTemporaryTableAlias = sql.identifier(
      `__temporary_${String(Math.random()).replace(/[^0-9]+/g, "")}__`
    );

    await performQuery(
      pgClient,
      sql.query`
      create temporary table ${sqlTemporaryTableAlias} (
        id serial not null,
        row ${sqlTypeIdentifier}
      ) on commit drop`
    );

    await performQuery(
      pgClient,
      sql.query`
      with ${sqlResultSourceAlias} as (
        ${sqlMutationQuery}
      )
      insert into ${sqlTemporaryTableAlias} (row)
      select ${isPgClassLike
        ? sqlResultSourceAlias
        : sql.query`${sqlResultSourceAlias}.${sqlResultSourceAlias}`}::${sqlTypeIdentifier} from ${sqlResultSourceAlias}`
    );
    const results = await performQuery(
      pgClient,
      sql.query`
      with ${sqlResultSourceAlias} as (
        select ${isPgClassLike
          ? sql.query`(${sqlTemporaryTableAlias}.row).*`
          : sql.query`${sqlTemporaryTableAlias}.row as ${sqlResultSourceAlias}`} from ${sqlTemporaryTableAlias} order by id asc
      )
      ${sqlResultQuery}`
    );
    await performQuery(
      pgClient,
      sql.query`drop table ${sqlTemporaryTableAlias};`
    );
    return results;
  }
}
