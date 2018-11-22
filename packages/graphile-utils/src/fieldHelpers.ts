import { GraphQLResolveInfo } from "graphql";
import { Build, Context } from "graphile-build";
import { QueryBuilder, SQL } from "graphile-build-pg";

export type SelectGraphQLResultFromTable = (
  tableFragment: SQL,
  builderCallback: (alias: SQL, sqlBuilder: QueryBuilder) => void
) => Promise<any>;

export interface GraphileHelpers<TSource> {
  build: Build;
  fieldContext: Context<TSource>;
  selectGraphQLResultFromTable: SelectGraphQLResultFromTable;
}

export function makeFieldHelpers<TSource>(
  build: Build,
  fieldContext: Context<TSource>,
  context: any,
  resolveInfo: GraphQLResolveInfo
) {
  const { parseResolveInfo, pgQueryFromResolveData, pgSql: sql } = build;
  const { getDataFromParsedResolveInfoFragment } = fieldContext;
  const selectGraphQLResultFromTable: SelectGraphQLResultFromTable = async (
    tableFragment: SQL,
    builderCallback: (alias: SQL, sqlBuilder: QueryBuilder) => void
  ) => {
    const { pgClient } = context;
    const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
    const PayloadType = resolveInfo.returnType;
    const resolveData = getDataFromParsedResolveInfoFragment(
      parsedResolveInfoFragment,
      PayloadType
    );
    const tableAlias = sql.identifier(Symbol());
    const query = pgQueryFromResolveData(
      tableFragment,
      tableAlias,
      resolveData,
      {},
      (sqlBuilder: QueryBuilder) => builderCallback(tableAlias, sqlBuilder)
    );
    const { text, values } = sql.compile(query);
    const { rows } = await pgClient.query(text, values);
    return rows;
  };

  const graphileHelpers: GraphileHelpers<TSource> = {
    build,
    fieldContext,
    selectGraphQLResultFromTable,
  };
  return graphileHelpers;
}

export function requireColumn<Type>(
  build: Build,
  context: Context<Type>,
  method: "addArgDataGenerator" | "addDataGenerator",
  col: string,
  alias: string
): void {
  const { pgSql: sql } = build;
  context[method](() => ({
    pgQuery: (queryBuilder: QueryBuilder) => {
      queryBuilder.select(
        sql.query`${queryBuilder.getTableAlias()}.${sql.identifier(col)}`,
        alias
      );
    },
  }));
}

export function requireChildColumn<Type>(
  build: Build,
  context: Context<Type>,
  col: string,
  alias: string
): void {
  return requireColumn(build, context, "addArgDataGenerator", col, alias);
}

export function requireSiblingColumn<Type>(
  build: Build,
  context: Context<Type>,
  col: string,
  alias: string
): void {
  return requireColumn(build, context, "addDataGenerator", col, alias);
}
