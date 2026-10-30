import "graphile-config";

import type { PgResource, PgWrapCallback } from "@dataplan/pg";
import { pgDeleteSingle, pgInsertSingle, pgUpdateSingle } from "@dataplan/pg";
import type { FieldArgs, Step } from "grafast";
import { EXPORTABLE, extendSchema, gql } from "postgraphile/utils";

type WrapCallback = PgWrapCallback<any, { context: Step<any> }, any>;

const runMutation: WrapCallback = EXPORTABLE(
  () =>
    async function runMutation(run, pgClient, { context }, queryBuilder) {
      const name = queryBuilder.getRaw("person_full_name");
      const formattedName = name.replace(/\b\w/g, (letter: string) =>
        letter.toUpperCase(),
      );
      queryBuilder.set("person_full_name", formattedName, true);
      const result = await run(pgClient);
      const row = result.rows[0];
      context.mutationResult = `Updated person ${row.id}'s name to "${row.person_full_name}"; ${JSON.stringify(row)}`;
      return result;
    },
  [],
);

const runDeleteMutation: WrapCallback = EXPORTABLE(
  () =>
    async function runDeleteMutation(run, pgClient, { context }) {
      const result = await run(pgClient);
      const row = result.rows[0];
      context.mutationResult = `Deleted person ${row.id} named "${row.person_full_name}"; ${JSON.stringify(row)}`;
      return result;
    },
  [],
);

const throwAfterMutation: WrapCallback = EXPORTABLE(
  () =>
    async function throwAfterMutation(run, pgClient) {
      await run(pgClient);
      throw new Error("Expected wrapper failure");
    },
  [],
);

const runNestedWrap1: WrapCallback = EXPORTABLE(
  () =>
    async function runNestedWrap1(run, pgClient, { context }, queryBuilder) {
      queryBuilder.set(
        "person_full_name",
        `${queryBuilder.getRaw("person_full_name")} (wrap1)`,
        true,
      );
      const result = await run(pgClient);
      context.mutationResult += " (wrap1)";
      return result;
    },
  [],
);

const runNestedWrap2: WrapCallback = EXPORTABLE(
  () =>
    async function runNestedWrap2(run, pgClient, { context }, queryBuilder) {
      queryBuilder.set(
        "person_full_name",
        `${queryBuilder.getRaw("person_full_name")} (wrap2)`,
        true,
      );
      const result = await run(pgClient);
      context.mutationResult += " (wrap2)";
      return result;
    },
  [],
);

const runNestedWrap3: WrapCallback = EXPORTABLE(
  () =>
    async function runNestedWrap3(run, pgClient, { context }, queryBuilder) {
      queryBuilder.set(
        "person_full_name",
        `${queryBuilder.getRaw("person_full_name")} (wrap3)`,
        true,
      );
      const result = await run(pgClient);
      context.mutationResult = `Updated person ${result.rows[0].id}'s name to "${result.rows[0].person_full_name}"; ${JSON.stringify(result.rows[0])} (wrap3)`;
      return result;
    },
  [],
);

const plugin = extendSchema((build) => {
  const people = build.input.pgRegistry.pgResources.person as PgResource<
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >;
  const { constant, context } = build.grafast;

  return {
    typeDefs: gql`
      extend type Mutation {
        wrappedCreatePerson(name: String!, email: String!): Int
        wrappedUpdatePerson(name: String!): Int
        wrappedDeletePerson: Int
        wrappedEmptyUpdatePerson: Int
        wrappedThrowingPerson: Int
        wrappedNestedPerson: Int
        wrappedMutationResult: String
      }
    `,
    plans: {
      Mutation: {
        wrappedCreatePerson: EXPORTABLE(
          (constant, context, people, pgInsertSingle, runMutation) =>
            function wrappedCreatePerson(
              _$root: any,
              { $name, $email }: FieldArgs<{ name: string; email: string }>,
            ) {
              const $person = pgInsertSingle(people, {
                id: constant(99999, false),
                person_full_name: $name,
                email: $email,
              });
              $person.wrap(
                (() => ({ context: context() })) as never,
                ["id", "person_full_name", "about"],
                runMutation,
              );
              return $person.get("id");
            },
          [constant, context, people, pgInsertSingle, runMutation],
        ),
        wrappedUpdatePerson: EXPORTABLE(
          (constant, context, people, pgUpdateSingle, runMutation) =>
            function wrappedUpdatePerson(
              _$root: any,
              { $name }: FieldArgs<{ name: string }>,
            ) {
              const $person = pgUpdateSingle(
                people,
                { id: constant(99999, false) },
                { person_full_name: $name },
              );
              $person.wrap(
                (() => ({ context: context() })) as never,
                ["id", "person_full_name", "about"],
                runMutation,
              );
              return $person.get("id");
            },
          [constant, context, people, pgUpdateSingle, runMutation],
        ),
        wrappedDeletePerson: EXPORTABLE(
          (constant, context, people, pgDeleteSingle, runDeleteMutation) =>
            function wrappedDeletePerson() {
              const $person = pgDeleteSingle(people, {
                id: constant(99999, false),
              });
              $person.wrap(
                (() => ({ context: context() })) as never,
                ["id", "person_full_name", "about"],
                runDeleteMutation,
              );
              return $person.get("id");
            },
          [constant, context, people, pgDeleteSingle, runDeleteMutation],
        ),
        wrappedEmptyUpdatePerson: EXPORTABLE(
          (constant, people, pgUpdateSingle) =>
            function wrappedEmptyUpdatePerson() {
              const $person = pgUpdateSingle(people, {
                id: constant(99999, false),
              });
              return $person.get("id");
            },
          [constant, people, pgUpdateSingle],
        ),
        wrappedThrowingPerson: EXPORTABLE(
          (constant, context, people, pgInsertSingle, throwAfterMutation) =>
            function wrappedThrowingPerson() {
              const $person = pgInsertSingle(people, {
                id: constant(99997, false),
                person_full_name: constant("Rollback Person", false),
                email: constant("rollback-mutation-wrapper@example.com", false),
              });
              $person.wrap(
                (() => ({ context: context() })) as never,
                ["id", "person_full_name", "about"],
                throwAfterMutation,
              );
              return $person.get("id");
            },
          [constant, context, people, pgInsertSingle, throwAfterMutation],
        ),
        wrappedNestedPerson: EXPORTABLE(
          (
            constant,
            context,
            people,
            pgInsertSingle,
            runNestedWrap1,
            runNestedWrap2,
            runNestedWrap3,
          ) =>
            function wrappedNestedPerson() {
              const $person = pgInsertSingle(people, {
                id: constant(99998, false),
                person_full_name: constant("Alice", false),
                email: constant("nested-mutation-wrapper@example.com", false),
              });
              const $context = context();
              const $dependencies = { context: $context };
              $person.wrap(
                $dependencies,
                ["id", "person_full_name", "about"],
                runNestedWrap1,
              );
              $person.wrap(
                $dependencies,
                ["id", "person_full_name", "about"],
                runNestedWrap2,
              );
              $person.wrap(
                $dependencies,
                ["id", "person_full_name", "about"],
                runNestedWrap3,
              );
              return $person.get("id");
            },
          [
            constant,
            context,
            people,
            pgInsertSingle,
            runNestedWrap1,
            runNestedWrap2,
            runNestedWrap3,
          ],
        ),
        wrappedMutationResult: EXPORTABLE(
          (context) =>
            function wrappedMutationResult() {
              return context().get("mutationResult" as never);
            },
          [context],
        ),
      },
    },
  };
});

export const preset: GraphileConfig.Preset = {
  plugins: [plugin],
};
