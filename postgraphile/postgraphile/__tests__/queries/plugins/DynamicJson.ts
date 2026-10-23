import "graphile-config";

import { EXPORTABLE, extendSchema, gql } from "postgraphile/utils";

const plugin = extendSchema((build) => {
  const { json_identity: jsonIdentity } = build.input.pgRegistry.pgResources;
  const { each } = build.grafast;

  return {
    typeDefs: gql`
      extend type Query {
        jsonIdentityBatch(jsonArray: [JSON!]!): [JSON]
      }
    `,
    plans: {
      Query: {
        jsonIdentityBatch: EXPORTABLE(
          (each, jsonIdentity) =>
            function jsonIdentityBatch(_$root, { $jsonArray }) {
              return each($jsonArray, ($json) =>
                jsonIdentity.executePositional($json),
              );
            },
          [each, jsonIdentity],
        ),
      },
    },
  };
});

export const preset: GraphileConfig.Preset = {
  plugins: [plugin],
};
