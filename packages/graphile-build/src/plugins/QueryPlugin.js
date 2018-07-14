// @flow
import type { Plugin, Build } from "../SchemaBuilder";

export type BuildExtensionQuery = {|
  $$isQuery: Symbol,
|};

export default (async function QueryPlugin(builder) {
  builder.hook(
    "build",
    (build: Build): Build & BuildExtensionQuery =>
      build.extend(
        build,
        {
          $$isQuery: Symbol("isQuery"),
        },
        `Extending Build`
      )
  );
  builder.hook("GraphQLSchema", (schema: {}, build) => {
    const {
      $$isQuery,
      newWithHooks,
      extend,
      graphql: { GraphQLObjectType, GraphQLNonNull },
    } = build;
    const queryType = newWithHooks(
      GraphQLObjectType,
      {
        description:
          "The root query type which gives access points into the data universe.",
        name: "Query",
        isTypeOf: (value, _context, info) =>
          info.parentType == null || value === $$isQuery,
        fields: ({ Self }) => ({
          query: {
            description:
              "Exposes the root query type nested one level down. This is helpful for Relay 1 which can only query top level fields if they are in a particular form.",
            type: new GraphQLNonNull(Self),
            resolve() {
              return $$isQuery;
            },
          },
        }),
      },
      { isRootQuery: true },
      true
    );
    if (queryType) {
      return extend(
        schema,
        {
          query: queryType,
        },
        `Adding 'query' type to Schema`
      );
    } else {
      return schema;
    }
  });
}: Plugin);
