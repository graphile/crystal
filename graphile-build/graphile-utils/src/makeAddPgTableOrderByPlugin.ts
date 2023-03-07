import type { PgOrderSpec, PgSelectStep } from "@dataplan/pg";

import { EXPORTABLE } from "./exportable.js";

type OrderBySpecIdentity =
  | string // Column name
  | Omit<PgOrderSpec, "direction"> // Expression
  | ((
      step: PgSelectStep<any, any, any, any>,
    ) => Omit<PgOrderSpec, "direction">); // Callback, allows for joins/etc

export interface MakeAddPgTableOrderByPluginOrders {
  [orderByEnumValue: string]: {
    extensions: {
      graphile: {
        applyPlan($select: PgSelectStep<any, any, any, any>): void;
      };
    };
  };
}

const counterByName = new Map<string, number>();

export default function makeAddPgTableOrderByPlugin(
  schemaName: string,
  tableName: string,
  ordersGenerator: (
    build: GraphileBuild.Build,
  ) => MakeAddPgTableOrderByPluginOrders,
  hint = `Adding orders with makeAddPgTableOrderByPlugin to "${schemaName}"."${tableName}"`,
): GraphileConfig.Plugin {
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
            !table.columns ||
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
}

export function orderByAscDesc(
  baseName: string,
  columnOrSqlFragment: OrderBySpecIdentity,
  uniqueOrOptions: boolean | OrderByAscDescOptions = false,
): MakeAddPgTableOrderByPluginOrders {
  const options =
    typeof uniqueOrOptions === "boolean"
      ? { unique: uniqueOrOptions }
      : uniqueOrOptions ?? {};
  const { unique = false, nulls } = options;

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
  const ascendingNulls: Pick<PgOrderSpec, "nulls"> =
    typeof nulls === "undefined"
      ? {}
      : {
          nulls: ["first", "first-iff-ascending"].includes(nulls)
            ? "FIRST"
            : "LAST",
        };
  const descendingNulls: Pick<PgOrderSpec, "nulls"> =
    typeof nulls === "undefined"
      ? {}
      : {
          nulls: ["first", "last-iff-ascending"].includes(nulls)
            ? "FIRST"
            : "LAST",
        };

  type Plan = ($select: PgSelectStep<any, any, any, any>) => void;

  const ascendingPlan: Plan =
    typeof columnOrSqlFragment === "string"
      ? EXPORTABLE(
          (ascendingNulls, columnOrSqlFragment, unique) => function applyPlan($select) {
              $select.orderBy({
                ...ascendingNulls,
                attribute: columnOrSqlFragment,
                direction: "ASC",
              });
              if (unique) {
                $select.setOrderIsUnique();
              }
            },
          [ascendingNulls, columnOrSqlFragment, unique],
        )
      : typeof columnOrSqlFragment === "function"
      ? EXPORTABLE(
          (ascendingNulls, columnOrSqlFragment, unique) => function applyPlan($select) {
              $select.orderBy({
                ...ascendingNulls,
                ...columnOrSqlFragment($select),
                direction: "ASC",
              } as PgOrderSpec);
              if (unique) {
                $select.setOrderIsUnique();
              }
            },
          [ascendingNulls, columnOrSqlFragment, unique],
        )
      : EXPORTABLE(
          (ascendingNulls, columnOrSqlFragment, unique) => function applyPlan($select) {
              $select.orderBy({
                ...ascendingNulls,
                ...columnOrSqlFragment,
                direction: "ASC",
              } as PgOrderSpec);
              if (unique) {
                $select.setOrderIsUnique();
              }
            },
          [ascendingNulls, columnOrSqlFragment, unique],
        );
  const descendingPlan: Plan =
    typeof columnOrSqlFragment === "string"
      ? EXPORTABLE(
          (columnOrSqlFragment, descendingNulls, unique) => function applyPlan($select) {
              $select.orderBy({
                ...descendingNulls,
                attribute: columnOrSqlFragment,
                direction: "DESC",
              });
              if (unique) {
                $select.setOrderIsUnique();
              }
            },
          [columnOrSqlFragment, descendingNulls, unique],
        )
      : typeof columnOrSqlFragment === "function"
      ? EXPORTABLE(
          (columnOrSqlFragment, descendingNulls, unique) => function applyPlan($select) {
              $select.orderBy({
                ...descendingNulls,
                ...columnOrSqlFragment($select),
                direction: "DESC",
              } as PgOrderSpec);
              if (unique) {
                $select.setOrderIsUnique();
              }
            },
          [columnOrSqlFragment, descendingNulls, unique],
        )
      : EXPORTABLE(
          (columnOrSqlFragment, descendingNulls, unique) => function applyPlan($select) {
              $select.orderBy({
                ...descendingNulls,
                ...columnOrSqlFragment,
                direction: "DESC",
              } as PgOrderSpec);
              if (unique) {
                $select.setOrderIsUnique();
              }
            },
          [columnOrSqlFragment, descendingNulls, unique],
        );

  const orders: MakeAddPgTableOrderByPluginOrders = {
    [`${baseName}_ASC`]: {
      extensions: {
        graphile: {
          applyPlan: ascendingPlan,
        },
      },
    },
    [`${baseName}_DESC`]: {
      extensions: {
        graphile: {
          applyPlan: descendingPlan,
        },
      },
    },
  };

  return orders;
}
