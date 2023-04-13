import type { PgOrderSpec, PgSelectStep } from "@dataplan/pg";

import { EXPORTABLE } from "./exportable.js";

type OrderBySpecIdentity =
  | string // Attribute name
  | Omit<PgOrderSpec, "direction"> // Expression
  | (($select: PgSelectStep) => Omit<PgOrderSpec, "direction">); // Callback, allows for joins/etc

export interface MakeAddPgTableOrderByPluginOrders {
  [orderByEnumValue: string]: {
    extensions: {
      grafast: {
        applyPlan($select: PgSelectStep): void;
      };
    };
  };
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

  type Plan = ($select: PgSelectStep) => void;

  let spec: PgOrderSpec;
  const ascendingPlan: Plan =
    typeof attributeOrSqlFragment === "string"
      ? EXPORTABLE(
          (ascendingNulls, attributeOrSqlFragment, unique) =>
            function applyPlan($select) {
              $select.orderBy({
                nulls: ascendingNulls,
                attribute: attributeOrSqlFragment,
                direction: "ASC",
              });
              if (unique) {
                $select.setOrderIsUnique();
              }
            },
          [ascendingNulls, attributeOrSqlFragment, unique],
        )
      : typeof attributeOrSqlFragment === "function"
      ? EXPORTABLE(
          (ascendingNulls, attributeOrSqlFragment, unique) =>
            function applyPlan($select) {
              $select.orderBy({
                nulls: ascendingNulls,
                ...attributeOrSqlFragment($select),
                direction: "ASC",
              } as PgOrderSpec);
              if (unique) {
                $select.setOrderIsUnique();
              }
            },
          [ascendingNulls, attributeOrSqlFragment, unique],
        )
      : ((spec = {
          nulls: ascendingNulls,
          ...attributeOrSqlFragment,
          direction: "ASC",
        } as PgOrderSpec),
        EXPORTABLE(
          (spec, unique) =>
            function applyPlan($select) {
              $select.orderBy(spec);
              if (unique) {
                $select.setOrderIsUnique();
              }
            },
          [spec, unique],
        ));
  const descendingPlan: Plan =
    typeof attributeOrSqlFragment === "string"
      ? EXPORTABLE(
          (attributeOrSqlFragment, descendingNulls, unique) =>
            function applyPlan($select) {
              $select.orderBy({
                nulls: descendingNulls,
                attribute: attributeOrSqlFragment,
                direction: "DESC",
              });
              if (unique) {
                $select.setOrderIsUnique();
              }
            },
          [attributeOrSqlFragment, descendingNulls, unique],
        )
      : typeof attributeOrSqlFragment === "function"
      ? EXPORTABLE(
          (attributeOrSqlFragment, descendingNulls, unique) =>
            function applyPlan($select) {
              $select.orderBy({
                nulls: descendingNulls,
                ...attributeOrSqlFragment($select),
                direction: "DESC",
              } as PgOrderSpec);
              if (unique) {
                $select.setOrderIsUnique();
              }
            },
          [attributeOrSqlFragment, descendingNulls, unique],
        )
      : ((spec = {
          nulls: descendingNulls,
          ...attributeOrSqlFragment,
          direction: "DESC",
        } as PgOrderSpec),
        EXPORTABLE(
          (spec, unique) =>
            function applyPlan($select) {
              $select.orderBy(spec);
              if (unique) {
                $select.setOrderIsUnique();
              }
            },
          [spec, unique],
        ));

  const orders: MakeAddPgTableOrderByPluginOrders = {
    [`${baseName}_ASC`]: {
      extensions: {
        grafast: {
          applyPlan: ascendingPlan,
        },
      },
    },
    [`${baseName}_DESC`]: {
      extensions: {
        grafast: {
          applyPlan: descendingPlan,
        },
      },
    },
  };

  return orders;
}
