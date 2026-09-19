import "graphile-config";

import { pgInsertSingle } from "@dataplan/pg";
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

const plugin = extendSchema((build) => {
  const { c_person: people } = build.input.pgRegistry.pgResources;
  const { constant, context } = build.grafast;

  return {
    typeDefs: gql`
      extend type Mutation {
        wrappedCreatePerson(name: String!, email: String!): Int
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
              const $context = context();
              $person.wrap(
                { $context },
                ["id", "person_full_name"],
                runMutation,
              );
              return $person.get("id");
            },
          [constant, context, people, pgInsertSingle, runMutation],
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
