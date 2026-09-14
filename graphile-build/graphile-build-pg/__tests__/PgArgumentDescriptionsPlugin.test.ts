/* eslint-disable graphile-export/export-instances */
import type { PgResourceOptions, PgResourceParameter } from "@dataplan/pg";
import {
  makeRegistryBuilder,
  PgExecutor,
  pgResourceOptions,
  recordCodec,
  TYPES,
} from "@dataplan/pg";
import { constant } from "grafast";
import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLString,
} from "grafast/graphql";
import { buildSchema, defaultPreset as buildPreset } from "graphile-build";
import sql from "pg-sql2";

import { defaultPreset, PgArgumentDescriptionsPlugin } from "../src/index.ts";

function describeParameters(
  resourceOptions: PgResourceOptions,
  tags: GraphileBuild.PgSmartTagsDict,
  modes?: string[],
) {
  const hook =
    PgArgumentDescriptionsPlugin.gather!.hooks!.pgProcedures_PgResourceOptions!;
  return hook({} as never, {
    serviceName: "main",
    resourceOptions,
    pgProc: {
      proargtypes: resourceOptions.parameters!.map(() => "25"),
      proallargtypes: modes?.map(() => "25"),
      proargmodes: modes,
      getTagsAndDescription: () => ({ tags }),
    } as never,
  });
}

const executor = new PgExecutor({
  name: "main",
  context: () => constant({}),
});

function makeFunction(name: string, parameters: PgResourceParameter[]) {
  return pgResourceOptions({
    name,
    executor,
    codec: TYPES.text,
    from: () => sql`unused()`,
    isUnique: true,
    parameters,
  });
}

test("maps SQL positions to inputs, preserving extensions and absent descriptions", async () => {
  const resource = makeFunction("example", [
    {
      name: "first",
      codec: TYPES.text,
      extensions: { argDescription: "Existing." },
    },
    { name: "last", codec: TYPES.text, extensions: { variant: "input" } },
    { name: null, codec: TYPES.text },
  ]);
  await describeParameters(
    resource,
    {
      arg0description: true,
      arg1description: "An output, not an input.",
      arg2description: ["The INOUT argument.", "Second line."],
      arg4description: "A TABLE output.",
    },
    ["i", "o", "b", "i", "t"],
  );
  expect(resource.parameters.map((param) => param.extensions)).toEqual([
    { argDescription: "Existing." },
    { variant: "input", argDescription: "The INOUT argument.\nSecond line." },
    undefined,
  ]);
});

test("describes query arguments, computed arguments and mutation input fields", async () => {
  expect(defaultPreset.plugins).toContain(PgArgumentDescriptionsPlugin);
  const rowCodec = recordCodec({
    name: "people",
    executor,
    identifier: sql`people`,
    attributes: { id: { codec: TYPES.int, notNull: true } },
  });
  const query = makeFunction("greet", [
    { name: "person_name", codec: TYPES.text, optional: true },
    { name: "unlabelled", codec: TYPES.text, optional: true },
  ]);
  const computed = makeFunction("people_greet", [
    { name: "person", codec: rowCodec },
    { name: null, codec: TYPES.text, optional: true },
  ]);
  const mutation = {
    ...makeFunction(
      "greet_mutation",
      query.parameters.map((param) => ({ ...param })),
    ),
    isMutation: true,
  };
  await describeParameters(query, {
    arg0description: ["Name to greet.", "Optional."],
  });
  await describeParameters(computed, {
    arg0description: "Hidden row.",
    arg1description: "Computed greeting.",
  });
  await describeParameters(mutation, { arg0description: "Mutation greeting." });
  const pgRegistry = makeRegistryBuilder()
    .addResource(
      pgResourceOptions({
        name: "people",
        executor,
        codec: rowCodec,
        from: sql`people`,
        uniques: [{ attributes: ["id"], isPrimary: true }],
      }),
    )
    .addResource(query)
    .addResource(computed)
    .addResource(mutation)
    .build();
  const schema = buildSchema(
    {
      extends: [buildPreset, defaultPreset],
    },
    { pgRegistry },
  );

  const args = schema.getQueryType()!.getFields().greet.args;
  expect(args.map(({ name, description }) => ({ name, description }))).toEqual([
    { name: "personName", description: "Name to greet.\nOptional." },
    { name: "unlabelled", description: undefined },
  ]);
  expect(args[0].type).toBe(GraphQLString);
  const person = schema.getType("Person") as GraphQLObjectType;
  expect(
    person
      .getFields()
      .greet.args.map(({ name, description }) => ({ name, description })),
  ).toEqual([{ name: "arg0", description: "Computed greeting." }]);
  const input = schema.getType("GreetMutationInput") as GraphQLInputObjectType;
  expect(input.getFields().personName.description).toBe("Mutation greeting.");
  expect(input.getFields().personName.type).toBe(GraphQLString);
  expect(input.getFields().unlabelled.description).toBeUndefined();
  expect(input.getFields().clientMutationId.description).toContain(
    "An arbitrary string value with no semantic meaning.",
  );
});
