import "graphile-config";

import { pgDeleteSingle, pgInsertSingle, pgUpdateSingle } from "@dataplan/pg";
import { EXPORTABLE, extendSchema, gql } from "postgraphile/utils";

const runMutation = EXPORTABLE(
  () =>
    async function runMutation(run, pgClient, { context }, queryBuilder) {
      const name = queryBuilder.getRaw("person_full_name");
      const formattedName = name.replace(/\b\w/g, (letter) =>
        letter.toUpperCase(),
      );
      queryBuilder.set("person_full_name", formattedName, true);
      const result = await run(pgClient);
      const row = result.rows[0];
      context.mutationResult = `Updated person ${row.id}'s name to "${row.person_full_name}"`;
      return result;
    },
  [],
);

const runDeleteMutation = EXPORTABLE(
  () =>
    async function runDeleteMutation(run, pgClient, { context }) {
      const result = await run(pgClient);
      const row = result.rows[0];
      context.mutationResult = `Deleted person ${row.id} named "${row.person_full_name}"`;
      return result;
    },
  [],
);

const plugin = extendSchema((build) => {
  const { person: people } = build.input.pgRegistry.pgResources;
  const { constant, context } = build.grafast;

  return {
    typeDefs: gql`
      extend type Mutation {
        wrappedCreatePerson(name: String!, email: String!): Int
        wrappedUpdatePerson(name: String!): Int
        wrappedDeletePerson: Int
        wrappedMutationResult: String
      }
    `,
    plans: {
      Mutation: {
        wrappedCreatePerson: EXPORTABLE(
          (constant, context, people, pgInsertSingle, runMutation) =>
            function wrappedCreatePerson(_$root, { $name, $email }) {
              const $person = pgInsertSingle(people, {
                id: constant(99999, false),
                person_full_name: $name,
                email: $email,
              });
              $person.wrap(
                () => ({ context: context() }),
                ["id", "person_full_name"],
                runMutation,
              );
              return $person.get("id");
            },
          [constant, context, people, pgInsertSingle, runMutation],
        ),
        wrappedUpdatePerson: EXPORTABLE(
          (constant, context, people, pgUpdateSingle, runMutation) =>
            function wrappedUpdatePerson(_$root, { $name }) {
              const $person = pgUpdateSingle(
                people,
                { id: constant(99999, false) },
                { person_full_name: $name },
              );
              $person.wrap(
                () => ({ context: context() }),
                ["id", "person_full_name"],
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
                () => ({ context: context() }),
                ["id", "person_full_name"],
                runDeleteMutation,
              );
              return $person.get("id");
            },
          [constant, context, people, pgDeleteSingle, runDeleteMutation],
        ),
        wrappedMutationResult: EXPORTABLE(
          (context) =>
            function wrappedMutationResult() {
              return context().get("mutationResult");
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
