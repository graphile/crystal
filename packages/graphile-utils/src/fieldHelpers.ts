import { QueryBuilder, SQL } from "graphile-build-pg";

export type SelectGraphQLResultFromTable = (
  tableFragment: SQL,
  builderCallback?: (alias: SQL, sqlBuilder: QueryBuilder) => void,
) => Promise<any>;

export interface GraphileHelpers {
  build: GraphileEngine.Build;
  fieldContext: GraphileEngine.ContextGraphQLObjectTypeFieldsField;
  selectGraphQLResultFromTable: SelectGraphQLResultFromTable;
}

export function makeFieldHelpers(
  build: GraphileEngine.Build,
  fieldContext: GraphileEngine.ContextGraphQLObjectTypeFieldsField,
  context: any,
  resolveInfo: import("graphql").GraphQLResolveInfo,
) {
  const { parseResolveInfo, pgQueryFromResolveData, pgSql: sql } = build;
  const { getDataFromParsedResolveInfoFragment, scope } = fieldContext;
  const { pgFieldIntrospection, isPgFieldConnection } = scope;

  const isConnection = !!isPgFieldConnection;

  const table =
    pgFieldIntrospection && pgFieldIntrospection.kind === "class"
      ? pgFieldIntrospection
      : null;
  const primaryKeyConstraint = table && table.primaryKeyConstraint;
  const primaryKeys =
    primaryKeyConstraint && primaryKeyConstraint.keyAttributes;

  const selectGraphQLResultFromTable: SelectGraphQLResultFromTable = async (
    tableFragment: SQL,
    builderCallback?: (alias: SQL, sqlBuilder: QueryBuilder) => void,
  ) => {
    const { pgClient } = context;
    const parsedResolveInfoFragment = parseResolveInfo(resolveInfo, true);
    const PayloadType = resolveInfo.returnType;

    const resolveData = getDataFromParsedResolveInfoFragment(
      parsedResolveInfoFragment,
      PayloadType,
    );
    const tableAlias = sql.identifier(Symbol());
    const query = pgQueryFromResolveData(
      tableFragment,
      tableAlias,
      resolveData,
      {
        withPaginationAsFields: isConnection,
      },
      (sqlBuilder: QueryBuilder) => {
        if (
          !isConnection &&
          primaryKeys &&
          build.options.subscriptions &&
          table
        ) {
          sqlBuilder.selectIdentifiers(table);
        }

        if (typeof builderCallback === "function") {
          builderCallback(tableAlias, sqlBuilder);
        }
      },
      context,
      resolveInfo.rootValue,
    );
    const { text, values } = sql.compile(query);
    const { rows } = await pgClient.query(text, values);
    if (isConnection) {
      return build.pgAddStartEndCursor(rows[0]);
    } else {
      const liveRecord =
        resolveInfo.rootValue && resolveInfo.rootValue.liveRecord;
      if (
        build.options.subscriptions &&
        !isConnection &&
        primaryKeys &&
        liveRecord
      ) {
        rows.forEach(
          (row: any) => row && liveRecord("pg", table, row.__identifiers),
        );
      }
      return rows;
    }
  };

  const graphileHelpers: GraphileHelpers = {
    build,
    fieldContext,
    selectGraphQLResultFromTable,
  };
  return graphileHelpers;
}

export function requireColumn(
  build: GraphileEngine.Build,
  context: GraphileEngine.ContextGraphQLObjectTypeFieldsField,
  method: "addArgDataGenerator" | "addDataGenerator",
  col: string,
  alias: string,
): void {
  const { pgSql: sql } = build;
  context[method](() => ({
    pgQuery: (queryBuilder: QueryBuilder) => {
      queryBuilder.select(
        sql`${queryBuilder.getTableAlias()}.${sql.identifier(col)}`,
        alias,
      );
    },
  }));
}

export function requireChildColumn(
  build: GraphileEngine.Build,
  context: GraphileEngine.ContextGraphQLObjectTypeFieldsField,
  col: string,
  alias: string,
): void {
  return requireColumn(build, context, "addArgDataGenerator", col, alias);
}

export function requireSiblingColumn(
  build: GraphileEngine.Build,
  context: GraphileEngine.ContextGraphQLObjectTypeFieldsField,
  col: string,
  alias: string,
): void {
  return requireColumn(build, context, "addDataGenerator", col, alias);
}
