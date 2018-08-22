// @flow

import * as sql from "pg-sql2";
import debugFactory from "debug";
import type { Client } from "pg";
import type { SQL, SQLQuery } from "pg-sql2";

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
  async function performQuery(pgClient: Client, sqlQuery: SQLQuery) {
    // TODO: look into rowMode = 'array'
    const { text, values } = sql.compile(sqlQuery);
    if (debugSql.enabled) debugSql(text);
    return pgClient.query(text, values);
  }

  if (!sqlTypeIdentifier) {
    // It returns void, just perform the query!
    const { rows } = await performQuery(
      pgClient,
      sql.query`
      with ${sqlResultSourceAlias} as (
        ${sqlMutationQuery}
      ) ${sqlResultQuery}`
    );
    return rows;
  } else {
    /*
     * In this code we're converting the rows to a string representation within
     * PostgreSQL itself, then we can send it back into PostgreSQL and have it
     * re-interpret the results cleanly (using it's own serializer/parser
     * combination) so we should be fairly confident that it will work
     * correctly every time assuming none of the PostgreSQL types are broken.
     *
     * If you have a way to improve this, I'd love to see a PR - but please
     * make sure that the integration tests pass with your solution first as
     * there are a log of potential pitfalls!
     */
    const selectionField = isPgClassLike
      ? /*
         * This `when foo is null then null` check might *seem* redundant, but it
         * is not - e.g. the compound type `(,,,,,,,)::my_type` and
         * `null::my_type` differ; however the former also returns true to `foo
         * is null`. We use this check to coalesce both into the canonical `null`
         * representation to make it easier to deal with below.
         */
        sql.query`(case when ${sqlResultSourceAlias} is null then null else ${sqlResultSourceAlias} end)`
      : sql.query`(${sqlResultSourceAlias}.${sqlResultSourceAlias})::${sqlTypeIdentifier}`;
    const result = await performQuery(
      pgClient,
      sql.query`
      with ${sqlResultSourceAlias} as (
        ${sqlMutationQuery}
      )
      select (${selectionField})::text from ${sqlResultSourceAlias}`
    );
    const { rows } = result;
    const firstNonNullRow = rows.find(row => row !== null);
    // TODO: we should be able to have `pg` not interpret the results as
    // objects and instead just return them as arrays - then we can just do
    // `row[0]`. PR welcome!
    const firstKey = firstNonNullRow && Object.keys(firstNonNullRow)[0];
    const rawValues = rows.map(row => row && row[firstKey]);
    const values = rawValues.filter(rawValue => rawValue !== null);
    const convertFieldBack = isPgClassLike
      ? sql.query`(str::${sqlTypeIdentifier}).*`
      : sql.query`str::${sqlTypeIdentifier} as ${sqlResultSourceAlias}`;
    const { rows: filteredValuesResults } =
      values.length > 0
        ? await performQuery(
            pgClient,
            sql.query`\
              with ${sqlResultSourceAlias} as (
                select ${convertFieldBack}
                from unnest((${sql.value(values)})::text[]) str
              )
              ${sqlResultQuery}
              `
          )
        : { rows: [] };
    const finalRows = rawValues.map(
      rawValue =>
        /*
         * We can't simply return 'null' here because this is expected to have
         * come from PG, and that would never return 'null' for a row - only
         * the fields within said row. Using `__isNull` here is a simple
         * workaround to this, that's caught by `pg2gql`.
         */
        rawValue === null ? { __isNull: true } : filteredValuesResults.shift()
    );
    return finalRows;
  }
}
