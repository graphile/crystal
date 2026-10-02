import "graphile-config";

import { EXPORTABLE, extendSchema, gql } from "postgraphile/utils";

const arrayLength = EXPORTABLE(
  () =>
    function arrayLength(array: readonly unknown[]): number {
      return array.length;
    },
  [],
);

const plugin = extendSchema((build) => {
  const { c_person: people } = build.input.pgRegistry.pgResources;
  const { lambda } = build.grafast;

  return {
    typeDefs: gql`
      extend type Query {
        personIdByNullableIdentifier(id: Int): Int
        peopleCountByNullableIdentifiers(id: Int, email: String!): Int!
      }
    `,
    plans: {
      Query: {
        personIdByNullableIdentifier: EXPORTABLE(
          (people) =>
            function personIdByNullableIdentifier(_$root, { $id }) {
              return people.get({ id: $id }).get("id");
            },
          [people],
        ),
        peopleCountByNullableIdentifiers: EXPORTABLE(
          (arrayLength, lambda, people) =>
            function peopleCountByNullableIdentifiers(_$root, { $id, $email }) {
              const $people = people.find({ id: $id, email: $email });
              return lambda($people.items(), arrayLength, true);
            },
          [arrayLength, lambda, people],
        ),
      },
    },
  };
});

export const preset: GraphileConfig.Preset = {
  plugins: [plugin],
};
