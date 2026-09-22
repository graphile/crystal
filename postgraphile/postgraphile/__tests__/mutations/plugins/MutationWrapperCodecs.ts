import "graphile-config";

import { pgDeleteSingle, pgInsertSingle, pgUpdateSingle } from "@dataplan/pg";
import { EXPORTABLE, extendSchema, gql } from "postgraphile/utils";

const attributes = [
  "enabled",
  "json",
  "jsonb",
  "duration",
  "date",
  "tags",
  "nullable_json",
] as const;

const captureResult = EXPORTABLE(
  () =>
    async function captureResult(run, pgClient, _dependencies, queryBuilder) {
      const result = await run(pgClient);
      queryBuilder.setMeta("result", JSON.stringify(result.rows[0]));
      return result;
    },
  [],
);

const plugin = extendSchema((build) => {
  const { codec_values: resource } = build.input.pgRegistry.pgResources;
  const { constant } = build.grafast;

  return {
    typeDefs: gql`
      extend type Mutation {
        wrappedCreateCodecValues: String
        wrappedUpdateCodecValues(enabled: Boolean!): String
        wrappedDeleteCodecValues: String
      }
    `,
    plans: {
      Mutation: {
        wrappedCreateCodecValues: EXPORTABLE(
          (attributes, captureResult, constant, pgInsertSingle, resource) =>
            function wrappedCreateCodecValues() {
              const $row = pgInsertSingle(resource, {
                id: constant(1),
                enabled: constant(true),
              });
              $row.wrap(null, attributes, captureResult);
              return $row.getMeta("result");
            },
          [attributes, captureResult, constant, pgInsertSingle, resource],
        ),
        wrappedUpdateCodecValues: EXPORTABLE(
          (attributes, captureResult, constant, pgUpdateSingle, resource) =>
            function wrappedUpdateCodecValues(_$root, { $enabled }) {
              const $row = pgUpdateSingle(
                resource,
                { id: constant(1) },
                { enabled: $enabled },
              );
              $row.wrap(null, attributes, captureResult);
              return $row.getMeta("result");
            },
          [attributes, captureResult, constant, pgUpdateSingle, resource],
        ),
        wrappedDeleteCodecValues: EXPORTABLE(
          (attributes, captureResult, constant, pgDeleteSingle, resource) =>
            function wrappedDeleteCodecValues() {
              const $row = pgDeleteSingle(resource, { id: constant(1) });
              $row.wrap(null, attributes, captureResult);
              return $row.getMeta("result");
            },
          [attributes, captureResult, constant, pgDeleteSingle, resource],
        ),
      },
    },
  };
});

export const preset: GraphileConfig.Preset = {
  plugins: [plugin],
};
