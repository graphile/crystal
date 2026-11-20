import type {
  GetPgResourceAttributes,
  PgOrderSpec,
  PgResource,
  PgSelectQueryBuilder,
  PgUnionAllQueryBuilder,
} from "@dataplan/pg";
import type { GraphQLEnumValueConfig } from "graphql";

import { EXPORTABLE } from "./exportable.ts";
import type { IdentifierPart } from "./parseIdentifierParts.ts";
import type { ScopedTableMatch, TableMatch } from "./resolveTableMatch.ts";
import { resolveTableMatch } from "./resolveTableMatch.ts";

type ArrayOrDirect<T> = T | Array<T>;

type OrderSpecWithoutDirection<
  TResource extends PgResource<any, any, any, any, any, any, any>,
> =
  PgOrderSpec<GetPgResourceAttributes<TResource>> extends infer TSpec
    ? TSpec extends unknown
      ? Omit<TSpec, "direction">
      : never
    : never;

type OrderBySpecIdentity<
  TResource extends PgResource<any, any, any, any, any, any, any> = PgResource<
    any,
    any,
    any,
    any,
    any
  >,
> =
  | (keyof GetPgResourceAttributes<TResource> & string) // Attribute name
  | OrderSpecWithoutDirection<TResource> // Expression
  | ((
      queryBuilder: PgSelectQueryBuilder<TResource>,
      info: { scope: unknown }, // The `info` argument to `EnumValueApplyResolver`
    ) => ArrayOrDirect<OrderSpecWithoutDirection<TResource>>); // Callback, allows for joins/etc

export interface MakeAddPgTableOrderByPluginOrders {
  [orderByEnumValue: string]: GraphQLEnumValueConfig;
}

type AnyPgResource = PgResource<any, any, any, any, any, any, any>;

type MatchService<TMatch extends TableMatch> =
  | IdentifierPart<NonNullable<TMatch["serviceName"]>>
  | (undefined extends TMatch["serviceName"] ? "main" : never);

type QualifiedTableMatch<TMatch> = TMatch extends TableMatch
  ? `${"serviceName" extends keyof TMatch ? MatchService<TMatch> : "main"}.${IdentifierPart<TMatch["schemaName"]>}.${IdentifierPart<TMatch["tableName"]>}`
  : TMatch;

type TableResourcesByIdentifier<TTables> = {
  [TTable in keyof TTables & string as IdentifierPart<TTable>]: TTables[TTable];
};

type TableResourceForSchema<
  TMatch,
  TSchema extends string,
  TTables,
> = TMatch extends `${IdentifierPart<TSchema>}.${infer TTable extends keyof TableResourcesByIdentifier<TTables> & string}`
  ? TableResourcesByIdentifier<TTables>[TTable]
  : never;

type TableResourceForSchemas<TMatch, TSchemas> = {
  [TSchema in keyof TSchemas & string]: TableResourceForSchema<
    TMatch,
    TSchema,
    TSchemas[TSchema]
  >;
}[keyof TSchemas & string];

type TableResourceForService<TMatch, TService extends string, TSchemas> =
  | (TMatch extends `${IdentifierPart<TService>}.${infer TRest}`
      ? TableResourceForSchemas<TRest, TSchemas>
      : never)
  | (TService extends "main"
      ? TableResourceForSchemas<TMatch, TSchemas>
      : never);

type ResourceForTableMatch<TMatch, TServices> = TMatch extends string
  ? {
      [TService in keyof TServices & string]: TableResourceForService<
        TMatch,
        TService,
        TServices[TService]
      >;
    }[keyof TServices & string] extends infer TResource
    ? [TResource] extends [never]
      ? AnyPgResource
      : TResource extends AnyPgResource
        ? TResource
        : AnyPgResource
    : never
  : AnyPgResource;

type TableResource<
  TScope extends keyof GraphileBuild.PluginScopes,
  TMatch,
> = GraphileBuild.PluginScopes[TScope] extends {
  pgTableResources: infer TServices;
}
  ? ResourceForTableMatch<QualifiedTableMatch<TMatch>, TServices>
  : AnyPgResource;

const counterByName = new Map<string, number>();

/**
 * The callback's order helper is typed to the table when generated resource
 * types are available. With an explicit scope type argument, also specify the
 * match type to retain table-specific inference.
 */
export function addPgTableOrderBy<
  TScope extends keyof GraphileBuild.PluginScopes = "default",
  const TMatch extends ScopedTableMatch<TScope> = ScopedTableMatch<TScope>,
>(
  match: TMatch,
  ordersGenerator: (
    build: GraphileBuild.ScopedBuild<TScope>,
    orderBy: typeof orderByAscDesc<TableResource<TScope, TMatch>>,
  ) => MakeAddPgTableOrderByPluginOrders,
  hint = `Adding orders with addPgTableOrderBy to ${typeof match === "string" ? match : `"${match.schemaName}"."${match.tableName}"`}`,
): GraphileConfig.Plugin {
  const { serviceName, schemaName, tableName } = resolveTableMatch(match);
  const baseDisplayName = `addPgTableOrderBy_${schemaName}_${tableName}`;
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
          const newValues = ordersGenerator(
            build as GraphileBuild.ScopedBuild<TScope>,
            orderByAscDesc<TableResource<TScope, TMatch>>,
          );

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

export function orderByAscDesc<
  TResource extends PgResource<any, any, any, any, any, any, any> = PgResource<
    any,
    any,
    any,
    any,
    any
  >,
>(
  baseName: string,
  attributeOrSqlFragment: NoInfer<OrderBySpecIdentity<TResource>>,
  uniqueOrOptions?: boolean | OrderByAscDescOptions,
): MakeAddPgTableOrderByPluginOrders;
export function orderByAscDesc(
  baseName: string,
  attributeOrSqlFragment: OrderBySpecIdentity,
  uniqueOrOptions: boolean | OrderByAscDescOptions = false,
): MakeAddPgTableOrderByPluginOrders {
  const options =
    typeof uniqueOrOptions === "boolean"
      ? { unique: uniqueOrOptions }
      : (uniqueOrOptions ?? {});
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
                nullable,
                attribute: attributeOrSqlFragment,
                direction: "ASC",
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
              function apply(
                queryBuilder: PgSelectQueryBuilder,
                info: { scope: unknown },
              ) {
                const specOrSpecs = attributeOrSqlFragment(queryBuilder, info);
                const specs = Array.isArray(specOrSpecs)
                  ? specOrSpecs
                  : [specOrSpecs];
                specs.forEach((spec) => {
                  queryBuilder.orderBy({
                    nulls: ascendingNulls,
                    nullable,
                    ...spec,
                    direction: "ASC",
                  } as PgOrderSpec);
                });
                if (unique) {
                  queryBuilder.setOrderIsUnique();
                }
              },
            [ascendingNulls, attributeOrSqlFragment, nullable, unique],
          )
        : ((spec = {
            nulls: ascendingNulls,
            nullable,
            ...attributeOrSqlFragment,
            direction: "ASC",
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
                nullable,
                attribute: attributeOrSqlFragment,
                direction: "DESC",
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
              function apply(
                queryBuilder: PgSelectQueryBuilder,
                info: { scope: unknown },
              ) {
                const specOrSpecs = attributeOrSqlFragment(queryBuilder, info);
                const specs = Array.isArray(specOrSpecs)
                  ? specOrSpecs
                  : [specOrSpecs];
                specs.forEach((spec) => {
                  queryBuilder.orderBy({
                    nulls: descendingNulls,
                    nullable,
                    ...spec,
                    direction: "DESC",
                  } as PgOrderSpec);
                });
                if (unique) {
                  queryBuilder.setOrderIsUnique();
                }
              },
            [attributeOrSqlFragment, descendingNulls, nullable, unique],
          )
        : ((spec = {
            nulls: descendingNulls,
            nullable,
            ...attributeOrSqlFragment,
            direction: "DESC",
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

/** @deprecated renamed to addPgTableOrderBy */
export const makeAddPgTableOrderByPlugin = addPgTableOrderBy;
