import type { PgCodec, PgRegistry, PgResource } from "@dataplan/pg";
import { TYPES } from "@dataplan/pg";
import { GraphQLInt } from "grafast/graphql";

import {
  addPgTableCondition,
  orderByAscDesc,
  processSchema,
} from "../src/index.ts";

type UserCodec = PgCodec<
  "users",
  { id: { codec: typeof TYPES.int; notNull: true } }
>;
type UserResource = PgResource<"users", UserCodec>;
type TestRegistry = PgRegistry & { generatedHelpersMarker: true };

declare global {
  namespace GraphileBuild {
    interface PluginScopes {
      generatedHelpersTest: { pgRegistry: TestRegistry };
    }
  }
}

// Compile-only assertions; executing these plugins requires a schema build.
function typecheckGeneratedHelpers() {
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
