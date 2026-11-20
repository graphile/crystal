/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PgCodec, PgRegistry, PgResource } from "@dataplan/pg";
import { sql, TYPES } from "@dataplan/pg";
import { GraphQLInt } from "grafast/graphql";

import {
  addPgTableCondition,
  addPgTableOrderBy,
  orderByAscDesc,
  processSchema,
  scopedUtils,
} from "../dist/index.js";

type UserCodec = PgCodec<
  "users",
  { id: { codec: typeof TYPES.int; notNull: true } }
>;
type UserResource = PgResource<"users", UserCodec>;
type TestRegistry = PgRegistry & { generatedHelpersMarker: true };

type TestTableResources = {
  main: { public: { users: UserResource } };
  "read.only": { "other.schema": { 'other"users': UserResource } };
};

declare global {
  namespace GraphileBuild {
    interface PluginScope_default {
      pgTableResources: TestTableResources;
    }
    interface PluginScopes {
      generatedHelpersTest: {
        pgRegistry: TestRegistry;
        pgTableResources: {
          main: { public: { users: UserResource; api_users: UserResource } };
        };
        gather: {
          pgIntrospection: {
            main: {
              schemas: { public: { classes: { users: {}; api_users: {} } } };
            };
          };
        };
      };
    }
  }
}

// Compile-only assertions; executing these plugins requires a schema build.
function typecheckGeneratedHelpers() {
  const {
    addPgTableCondition: addApiCondition,
    addPgTableOrderBy: addApiOrderBy,
    extendSchema,
    wrapPlans,
  } = scopedUtils("generatedHelpersTest");

  extendSchema((build) => {
    const registry: TestRegistry = build.input.pgRegistry;
    return { typeDefs: "extend type Query { example: Int }" };
  });
  wrapPlans((build) => {
    const registry: TestRegistry = build.input.pgRegistry;
    return {};
  });

  processSchema<"generatedHelpersTest">((schema, build, context) => {
    const registry: TestRegistry = build.input.pgRegistry;
    const finalizeContext: GraphileBuild.ContextFinalize = context;
    // @ts-expect-error The generated registry marker is a boolean, not a string.
    const invalid: string = registry.generatedHelpersMarker;
    return schema;
  });
  processSchema((schema, build) => {
    const registry: PgRegistry = build.input.pgRegistry;
    // @ts-expect-error The default scope does not have the generated marker.
    registry.generatedHelpersMarker;
    return schema;
  });

  addPgTableCondition<"generatedHelpersTest", number>(
    "public.users",
    "minimumId",
    (build) => {
      const registry: TestRegistry = build.input.pgRegistry;
      return {
        type: GraphQLInt,
        apply(_$condition, value) {
          const input: number = value;
          // @ts-expect-error The input value is numeric.
          const invalid: string = value;
        },
      };
    },
    (value) => {
      const input: number = value;
      // @ts-expect-error The deprecated callback shares the same input type.
      const invalid: string = value;
      return null;
    },
  );

  addPgTableCondition("public.users", "matchesId", () => ({
    type: GraphQLInt,
    apply(condition) {
      const spec = {
        type: "attribute",
        attribute: "id",
        callback: (fragment: ReturnType<typeof sql>) => sql`${fragment} > 0`,
      } as const;
      condition.where(spec);
      condition.where(sql`true`);
      // @ts-expect-error The attribute must belong to users.
      condition.where({ ...spec, attribute: "missing" });
      const nested = condition.andPlan().orPlan().notPlan();
      nested.where(spec);
      // @ts-expect-error Boolean conditions share the table's attributes.
      nested.where({ ...spec, attribute: "missing" });
      condition
        .existsPlan({ tableExpression: sql.identifier("other") })
        .where({ ...spec, attribute: "other_id" });
    },
  }));

  addApiCondition("main.public.api_users", "matchesId", (build) => {
    const registry: TestRegistry = build.input.pgRegistry;
    return {
      type: GraphQLInt,
      apply(condition, value: number) {
        condition.where({
          type: "attribute",
          attribute: "id",
          callback: (fragment) => sql`${fragment} = ${sql.value(value)}`,
        });
        condition.where({
          type: "attribute",
          // @ts-expect-error The scope-bound helper infers the table's attributes.
          attribute: "missing",
          callback: (fragment) => fragment,
        });
      },
    };
  });

  addPgTableCondition<"generatedHelpersTest", number, "main.public.users">(
    "main.public.users",
    "explicitScope",
    () => ({
      type: GraphQLInt,
      extensions: {
        grafast: {
          apply(condition, value) {
            const input: number = value;
            condition.where({
              type: "attribute",
              // @ts-expect-error The extension callback has the same attributes.
              attribute: "missing",
              callback: (fragment) => fragment,
            });
          },
        },
      },
    }),
  );

  addPgTableCondition(
    "public.users",
    "legacy",
    () => ({ type: GraphQLInt }),
    (_value, { condition }) => {
      condition.where({
        type: "attribute",
        // @ts-expect-error The deprecated callback has the same attributes.
        attribute: "missing",
        callback: (fragment) => fragment,
      });
      return null;
    },
  );

  addPgTableCondition("untyped.users", "matchesId", () => ({
    type: GraphQLInt,
    apply(condition) {
      condition.where({
        type: "attribute",
        attribute: "any_attribute",
        callback: (fragment) => fragment,
      });
    },
  }));

  addPgTableOrderBy("public.users", (_build, orderBy) => {
    orderBy("ID", "id");
    // @ts-expect-error Only attributes of users are accepted.
    orderBy("MISSING", "missing");

    orderBy("ID", "id", { nulls: "last" });
    // @ts-expect-error Only attributes of users are accepted.
    orderBy("MISSING", "missing", { nulls: "last" });

    orderBy("ID", { attribute: "id", nulls: "LAST" });
    // @ts-expect-error The attribute is checked with explicit null ordering too.
    orderBy("MISSING", { attribute: "missing", nulls: "FIRST" });

    orderBy("ID", () => ({ attribute: "id", nulls: "LAST" }));
    // @ts-expect-error Callback specs are checked against the same resource.
    orderBy("MISSING", () => ({ attribute: "missing", nulls: "LAST" }));

    return orderBy("ID", (queryBuilder) => {
      queryBuilder.orderBy({ attribute: "id", direction: "ASC" });
      // @ts-expect-error The callback also receives a typed query builder.
      queryBuilder.orderBy({ attribute: "missing", direction: "ASC" });

      return { attribute: "id", nulls: "FIRST" };
    });
  });

  addPgTableOrderBy(
    {
      serviceName: "read.only",
      schemaName: "other.schema",
      tableName: 'other"users',
    },
    (_build, orderBy) => {
      // @ts-expect-error Object matches also resolve to the generated resource.
      orderBy("MISSING", "missing");
      return orderBy("ID", "id");
    },
  );

  addPgTableOrderBy(
    '"read.only"."other.schema"."other""users"',
    (_build, orderBy) => {
      // @ts-expect-error Quoted parts resolve to the same resource as the raw names.
      orderBy("MISSING", "missing");
      return orderBy("ID", "id");
    },
  );

  addApiOrderBy("main.public.api_users", (build, orderBy) => {
    const registry: TestRegistry = build.input.pgRegistry;
    // @ts-expect-error The match is inferred when the scope is passed as a value.
    orderBy("MISSING", "missing");
    return orderBy("ID", { attribute: "id", nulls: "LAST" });
  });

  // @ts-expect-error The named scope's gather types reject unknown tables.
  addApiOrderBy("public.missing", () => ({}));

  // @ts-expect-error Only scopes declared in PluginScopes are accepted.
  scopedUtils("unknownScope");

  addPgTableOrderBy<"generatedHelpersTest", "main.public.users">(
    "main.public.users",
    (build, orderBy) => {
      const registry: TestRegistry = build.input.pgRegistry;
      // @ts-expect-error An explicit scope and match resolve the resource.
      orderBy("MISSING", "missing");
      return orderBy("ID", "id");
    },
  );

  addPgTableOrderBy("untyped.users", (_build, orderBy) =>
    orderBy("UNTYPED", () => ({ attribute: "any_attribute", nulls: "LAST" })),
  );

  orderByAscDesc<UserResource>("ID", "id");
  // @ts-expect-error Only attributes of the selected resource are accepted.
  orderByAscDesc<UserResource>("MISSING", "missing");
  orderByAscDesc<UserResource>("ID", {
    attribute: "id",
    callback(expression, codec, nullable) {
      const intCodec: typeof TYPES.int = codec;
      const notNullable: false = nullable;
      return [expression, codec];
    },
  });
  // @ts-expect-error Attribute objects are checked too.
  orderByAscDesc<UserResource>("MISSING", { attribute: "missing" });
  orderByAscDesc<UserResource>("ID", (queryBuilder) => {
    queryBuilder.orderBy({ attribute: "id", direction: "ASC" });
    // @ts-expect-error The callback receives the resource-specific builder.
    queryBuilder.orderBy({ attribute: "missing", direction: "ASC" });
    return [
      { attribute: "id" },
      { fragment: queryBuilder.alias, codec: TYPES.int },
    ];
  });
  // @ts-expect-error Callback results must also reference valid attributes.
  orderByAscDesc<UserResource>("MISSING", () => ({ attribute: "missing" }));
  orderByAscDesc("UNTYPED", "any_attribute");
  orderByAscDesc("UNTYPED_CALLBACK", () => ({
    attribute: "any_attribute",
    nulls: "LAST",
  }));
  orderByAscDesc("UNTYPED_FRAGMENT", (queryBuilder) => ({
    fragment: sql`${queryBuilder.alias}.any_attribute`,
    codec: TYPES.int,
    nulls: "FIRST",
  }));
}

it("preserves callback arrays for typed ordering helpers", () => {
  const orders = orderByAscDesc<UserResource>("ID", () => [
    { attribute: "id" },
    { attribute: "id", nullable: true },
  ]);
  const queryBuilder = { orderBy: jest.fn() };
  for (const direction of ["ASC", "DESC"] as const) {
    queryBuilder.orderBy.mockClear();
    const apply = orders[`ID_${direction}`].extensions!.grafast!.apply!;
    (apply as (builder: typeof queryBuilder, info: { scope: object }) => void)(
      queryBuilder,
      { scope: {} },
    );
    expect(queryBuilder.orderBy.mock.calls.map(([spec]) => spec)).toEqual([
      { attribute: "id", direction, nullable: false },
      { attribute: "id", direction, nullable: true },
    ]);
  }
});
