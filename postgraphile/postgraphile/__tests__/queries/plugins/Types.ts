import "graphile-config";

import { EXPORTABLE, extendSchema, gql } from "postgraphile/utils";

const withDifferentVarchar = EXPORTABLE(
  () =>
    function withDifferentVarchar(type: Record<string, unknown>) {
      return { ...type, varchar: "2" };
    },
  [],
);

const plugin = extendSchema((build) => {
  const { type_identity: typeIdentity } = build.input.pgRegistry.pgResources;
  const { each, first, lambda, list } = build.grafast;

  return {
    typeDefs: gql`
      extend type Query {
        typeIdentityBatch(types: [TypeInput!]!): [Type]
      }
    `,
    plans: {
      Query: {
        typeIdentityBatch: EXPORTABLE(
          (each, first, lambda, list, typeIdentity, withDifferentVarchar) =>
            function typeIdentityBatch(_$root, args) {
              const $type = first(args.getBaked("types"));
              const $types = list([
                $type,
                lambda($type, withDifferentVarchar, true),
              ]);
              return each($types, ($type) =>
                typeIdentity.executePositional($type),
              );
            },
          [each, first, lambda, list, typeIdentity, withDifferentVarchar],
        ),
      },
    },
  };
});

export const preset: GraphileConfig.Preset = {
  plugins: [plugin],
};
