import type {
  PgOrderSpec,
  PgSelectQueryBuilder,
  PgUnionAllQueryBuilder,
} from "@dataplan/pg";
import type { GraphQLEnumValueConfig } from "graphql";

import { EXPORTABLE } from "./exportable.js";

type OrderBySpecIdentity =
  | string // Attribute name
  | Omit<PgOrderSpec, "direction"> // Expression
  | ((queryBuilder: PgSelectQueryBuilder) => Omit<PgOrderSpec, "direction">); // Callback, allows for joins/etc

export interface MakeAddPgTableOrderByPluginOrders {
  [orderByEnumValue: string]: GraphQLEnumValueConfig;
}

const counterByName = new Map<string, number>();

export function makeAddPgTableOrderByPlugin(
  match: {
    serviceName?: string;
    schemaName: string;
    tableName: string;
  },
  ordersGenerator: (
    build: GraphileBuild.Build,
  ) => MakeAddPgTableOrderByPluginOrders,
  hint = `Adding orders with makeAddPgTableOrderByPlugin to "${match.schemaName}"."${match.tableName}"`,
): GraphileConfig.Plugin {
  const { serviceName = "main", schemaName, tableName } = match;
  const baseDisplayName = `makeAddPgTableOrderByPlugin_${schemaName}_${tableName}`;
  let counter = counterByName.get(baseDisplayName);
  if (!counter) {
    counter = 0;
  }
  counter++;
  counterByName.set(baseDisplayName, counter);
  const displayName =
    counter === 1 ? baseDisplayName : `${baseDisplayName}_${counter}`;
  const plugin: GraphileConfig.Plugin = {
    name: displayName,
    version: "0.0.0",

    schema: {
      hooks: {
        GraphQLEnumType_values(values, build, context) {
          const { extend } = build;
          const {
            scope: { isPgRowSortEnum, pgCodec: table },
          } = context;

          if (
            !isPgRowSortEnum ||
            !table ||
            !table.attributes ||
            table.extensions?.pg?.serviceName !== serviceName ||
            table.extensions?.pg?.schemaName !== schemaName ||
            table.extensions?.pg?.name !== tableName
          ) {
            return values;
          }
          const newValues = ordersGenerator(build);

          return extend(values, newValues, hint);
        },
      },
    },
  };
  return plugin;
}

export type NullsSortMethod =
  | "first"
  | "last"
  | "first-iff-ascending"
  | "last-iff-ascending"
  | undefined;

export interface OrderByAscDescOptions {
  unique?: boolean;
  nulls?: NullsSortMethod;
  /**
   * If this expression/column is nullable, you must set this true otherwise
   * cursor pagination over null values will break. If `nulls` is specified,
   * we'll default this to true.
   */
  nullable?: boolean;
}

export function orderByAscDesc(
  baseName: string,
  attributeOrSqlFragment: OrderBySpecIdentity,
  uniqueOrOptions: boolean | OrderByAscDescOptions = false,
): MakeAddPgTableOrderByPluginOrders {
  const options =
    typeof uniqueOrOptions === "boolean"
      ? { unique: uniqueOrOptions }
      : uniqueOrOptions ?? {};
  const { unique = false, nulls, nullable = nulls != null } = options;

  if (typeof unique !== "boolean") {
    throw new Error(
      `Invalid value for "unique" passed to orderByAscDesc for ${baseName}. Unique must be a boolean.`,
    );
  }

  const isValidNullsOption = [
    "first",
    "last",
    "first-iff-ascending",
    "last-iff-ascending",
    undefined,
  ].includes(nulls);

  if (!isValidNullsOption) {
    throw new Error(
      `Invalid value for "nulls" passed to orderByAscDesc for ${baseName}. Nulls must be sorted by one of: undefined | "first" | "last" | "first-iff-ascending" | "last-iff-ascending".`,
    );
  }
  const ascendingNulls: PgOrderSpec["nulls"] =
    typeof nulls === "undefined"
      ? undefined
      : ["first", "first-iff-ascending"].includes(nulls)
      ? "FIRST"
      : "LAST";
  const descendingNulls: PgOrderSpec["nulls"] =
    typeof nulls === "undefined"
      ? undefined
      : ["first", "last-iff-ascending"].includes(nulls)
      ? "FIRST"
      : "LAST";

  let spec: PgOrderSpec;
  const ascendingCb =
    typeof attributeOrSqlFragment === "string"
      ? EXPORTABLE(
          (ascendingNulls, attributeOrSqlFragment, nullable, unique) =>
            function apply(
              queryBuilder: PgSelectQueryBuilder | PgUnionAllQueryBuilder,
            ) {
              queryBuilder.orderBy({
                nulls: ascendingNulls,
                attribute: attributeOrSqlFragment,
                direction: "ASC",
                nullable,
              });
              if (unique) {
                queryBuilder.setOrderIsUnique();
              }
            },
          [ascendingNulls, attributeOrSqlFragment, nullable, unique],
        )
      : typeof attributeOrSqlFragment === "function"
      ? EXPORTABLE(
          (ascendingNulls, attributeOrSqlFragment, nullable, unique) =>
            function apply(queryBuilder: PgSelectQueryBuilder) {
              queryBuilder.orderBy({
                nulls: ascendingNulls,
                ...attributeOrSqlFragment(queryBuilder),
                direction: "ASC",
                nullable,
              } as PgOrderSpec);
              if (unique) {
                queryBuilder.setOrderIsUnique();
              }
            },
          [ascendingNulls, attributeOrSqlFragment, nullable, unique],
        )
      : ((spec = {
          nulls: ascendingNulls,
          ...attributeOrSqlFragment,
          direction: "ASC",
          nullable,
        } as PgOrderSpec),
        EXPORTABLE(
          (spec, unique) =>
            function apply(queryBuilder: PgSelectQueryBuilder) {
              queryBuilder.orderBy(spec);
              if (unique) {
                queryBuilder.setOrderIsUnique();
              }
            },
          [spec, unique],
        ));
  const descendingCb =
    typeof attributeOrSqlFragment === "string"
      ? EXPORTABLE(
          (attributeOrSqlFragment, descendingNulls, nullable, unique) =>
            function apply(
              queryBuilder: PgSelectQueryBuilder | PgUnionAllQueryBuilder,
            ) {
              queryBuilder.orderBy({
                nulls: descendingNulls,
                attribute: attributeOrSqlFragment,
                direction: "DESC",
                nullable,
              });
              if (unique) {
                queryBuilder.setOrderIsUnique();
              }
            },
          [attributeOrSqlFragment, descendingNulls, nullable, unique],
        )
      : typeof attributeOrSqlFragment === "function"
      ? EXPORTABLE(
          (attributeOrSqlFragment, descendingNulls, nullable, unique) =>
            function apply(queryBuilder: PgSelectQueryBuilder) {
              queryBuilder.orderBy({
                nulls: descendingNulls,
                ...attributeOrSqlFragment(queryBuilder),
                direction: "DESC",
                nullable,
              } as PgOrderSpec);
              if (unique) {
                queryBuilder.setOrderIsUnique();
              }
            },
          [attributeOrSqlFragment, descendingNulls, nullable, unique],
        )
      : ((spec = {
          nulls: descendingNulls,
          ...attributeOrSqlFragment,
          direction: "DESC",
          nullable,
        } as PgOrderSpec),
        EXPORTABLE(
          (spec, unique) =>
            function apply(queryBuilder: PgSelectQueryBuilder) {
              queryBuilder.orderBy(spec);
              if (unique) {
                queryBuilder.setOrderIsUnique();
              }
            },
          [spec, unique],
        ));

  const orders: MakeAddPgTableOrderByPluginOrders = {
    [`${baseName}_ASC`]: {
      extensions: {
        grafast: {
          apply: ascendingCb,
        },
      },
    },
    [`${baseName}_DESC`]: {
      extensions: {
        grafast: {
          apply: descendingCb,
        },
      },
    },
  };
  return orders;
}
