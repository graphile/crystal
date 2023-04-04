---
title: makeAddPgTableOrderByPlugin
---

# makeAddPgTableOrderByPlugin

Some of the types are unchanged between V4 and V5:

```ts
export interface OrderByAscDescOptions {
  unique?: boolean;
  nulls?: NullsSortMethod;
}

export type NullsSortMethod =
  | "first"
  | "last"
  | "first-iff-ascending"
  | "last-iff-ascending"
  | undefined;
```

The remaining (simplified) signatures for `makeAddPgTableOrderByPlugin` in V4 were:

```ts
// V4 signature
function makeAddPgTableOrderByPlugin(
  schemaName: string,
  tableName: string,
  ordersGenerator: (build: Build) => MakeAddPgTableOrderByPluginOrders,
  hint?: string,
): Plugin;

export interface MakeAddPgTableOrderByPluginOrders {
  [orderByEnumValue: string]: {
    value: {
      alias?: string;
      specs: Array<OrderSpec>;
      unique: boolean;
    };
  };
}

type OrderSpec =
  | [OrderBySpecIdentity, boolean]
  | [OrderBySpecIdentity, boolean, boolean];

type OrderBySpecIdentity =
  | string
  | SQL
  | ((options: { queryBuilder: QueryBuilder }) => SQL);

export function orderByAscDesc(
  baseName: string,
  columnOrSqlFragment: OrderBySpecIdentity,
  uniqueOrOptions: boolean | OrderByAscDescOptions = false,
): MakeAddPgTableOrderByPluginOrders;
```

In V5, the signature has changed a little.

The first change is trivial: we've combined the first two arguments into a
"match" object which also optionally accepts the `databaseName`.

The second change, however, is much more significant - order generation now
operates based on the Gra*fast* plan system (which operates based on "steps"
which represent all possible values) rather than V4's lookahead engine (which
deals in concrete runtime values).

The (simplified) new signatures are:

```ts
export function makeAddPgTableOrderByPlugin(
  match: {
    databaseName?: string;
    schemaName: string;
    tableName: string;
  },
  ordersGenerator: (
    build: GraphileBuild.Build,
  ) => MakeAddPgTableOrderByPluginOrders,
  hint?: string,
): GraphileConfig.Plugin;

export interface MakeAddPgTableOrderByPluginOrders {
  [orderByEnumValue: string]: {
    extensions: {
      graphile: {
        applyPlan($select: PgSelectStep): void;
      };
    };
  };
}

type OrderBySpecIdentity =
  | string // Column name
  | Omit<PgOrderSpec, "direction"> // Expression
  | (($select: PgSelectStep) => Omit<PgOrderSpec, "direction">); // Callback, allows for joins/etc

export function orderByAscDesc(
  baseName: string,
  columnOrSqlFragment: OrderBySpecIdentity,
  uniqueOrOptions: boolean | OrderByAscDescOptions = false,
): MakeAddPgTableOrderByPluginOrders;
```

## Example 1

V4:

```ts
const OrderByAveragePetIdPlugin = makeAddPgTableOrderByPlugin(
  "graphile_utils",
  "users",
  (build) => {
    const { pgSql: sql } = build;
    const sqlIdentifier = sql.identifier(Symbol("pet"));

    const customOrderBy = orderByAscDesc(
      "PET_ID_AVERAGE", // this is a ridiculous and unrealistic column but it will serve for testing purposes
      (helpers) => {
        const { queryBuilder } = helpers;

        const orderByFrag = sql.fragment`(
          select avg(${sqlIdentifier}.id)
          from graphile_utils.pets as ${sqlIdentifier}
          where ${sqlIdentifier}.user_id = ${queryBuilder.getTableAlias()}.id
        )`;

        return orderByFrag;
      },
      { nulls: "last-iff-ascending" },
    );

    return customOrderBy;
  },
);
```

V5:

```ts
const OrderByAveragePetIdPlugin = makeAddPgTableOrderByPlugin(
  { schemaName: "graphile_utils", tableName: "users" },
  (build) => {
    const { sql } = build;
    const sqlIdentifier = sql.identifier(Symbol("pet"));

    const customOrderBy = orderByAscDesc(
      "PET_ID_AVERAGE", // this is a ridiculous and unrealistic column but it will serve for testing purposes
      ($select) => {
        const orderByFrag = sql`(
            select avg(${sqlIdentifier}.id)
            from graphile_utils.pets as ${sqlIdentifier}
            where ${sqlIdentifier}.user_id = ${$select.alias}.id
          )`;

        return { fragment: orderByFrag, codec: TYPES.int };
      },
      { nulls: "last-iff-ascending" },
    );

    return customOrderBy;
  },
);
```

## Example 2

V4:

```ts
const OrderByMemberNamePlugin = makeAddPgTableOrderByPlugin(
  "app_public",
  "organization_memberships",
  ({ pgSql: sql }) => {
    const sqlIdentifier = sql.identifier(Symbol("member"));
    return orderByAscDesc(
      "MEMBER_NAME",
      // Order fragment callback:
      ({ queryBuilder }) => {
        return sql.fragment`(
          select ${sqlIdentifier}.name
          from app_public.users as ${sqlIdentifier}
          where ${sqlIdentifier}.id = ${queryBuilder.getTableAlias()}.user_id
          limit 1
        )`;
      },
    );
  },
);
```

V5:

```ts
const OrderByMemberNamePlugin = makeAddPgTableOrderByPlugin(
  { schemaName: "app_public", tableName: "organization_memberships" },
  ({ sql }) => {
    const sqlIdentifier = sql.identifier(Symbol("member"));
    return orderByAscDesc(
      "MEMBER_NAME",
      // Order spec callback:
      ($organizationMemberships) => {
        const fragment = sql.fragment`(
          select ${sqlIdentifier}.name
          from app_public.users as ${sqlIdentifier}
          where ${sqlIdentifier}.id = ${$organizationMemberships.alias}.user_id
          limit 1
        )`;
        return {
          fragment,
          codec: TYPES.text,
        };
      },
    );
  },
);
```

V5 (alternative solution, using joins which were not possible in V4):

```ts
const OrderByMemberNamePlugin = makeAddPgTableOrderByPlugin(
  { schemaName: "app_public", tableName: "organization_memberships" },
  (build) => {
    const {
      sql,
      input: {
        pgRegistry: { pgResources },
      },
    } = build;
    const usersSource = pgResources.find((s) => s.name === "users");
    if (!usersSource) throw new Error(`Couldn't find users source`);
    const sqlIdentifier = sql.identifier(Symbol("member"));
    return orderByAscDesc(
      "MEMBER_NAME",
      // Order spec callback:
      ($organizationMemberships) => {
        $organizationMemberships.join({
          type: "inner",
          source: usersSource.source as SQL,
          alias: sqlIdentifier,
          conditions: [
            sql`${sqlIdentifier}.id = ${$organizationMemberships.alias}.user_id`,
          ],
        });
        return {
          fragment: sql`${sqlIdentifier}.name`,
          codec: usersSource.codec.columns["name"].codec,
        };
      },
    );
  },
);
```
