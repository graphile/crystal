// @flow
import type { Plugin, Build } from "../SchemaBuilder";
import { Kind } from "graphql/language";
import GraphQLJSON from "graphql-type-json";

export default (function StandardTypesPlugin(builder) {
  // XXX: this should be in an "init" plugin, but PgTypesPlugin requires it in build - fix that, then fix this
  builder.hook("build", (build: Build): Build => {
    const stringType = (name, description) =>
      new build.graphql.GraphQLScalarType({
        name,
        description,
        serialize: value => String(value),
        parseValue: value => String(value),
        parseLiteral: ast => {
          if (ast.kind !== Kind.STRING) {
            throw new Error("Can only parse string values");
          }
          return ast.value;
        },
      });

    const Cursor = stringType(
      "Cursor",
      "A location in a connection that can be used for resuming pagination."
    );
    build.addType(Cursor);
    const UUID = stringType(
      "UUID",
      "A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122)."
    );
    build.addType(UUID);
    build.addType(GraphQLJSON);
    return build;
  });
  builder.hook(
    "init",
    (
      _: {},
      {
        newWithHooks,
        graphql: { GraphQLNonNull, GraphQLObjectType, GraphQLBoolean },
      }
    ) => {
      // https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo
      /* const PageInfo = */
      newWithHooks(
        GraphQLObjectType,
        {
          name: "PageInfo",
          description: "Information about pagination in a connection.",
          fields: ({ fieldWithHooks }) => ({
            hasNextPage: fieldWithHooks(
              "hasNextPage",
              ({ addDataGenerator }) => {
                addDataGenerator(() => {
                  return {
                    calculateHasNextPage: true,
                  };
                });
                return {
                  description:
                    "When paginating forwards, are there more items?",
                  type: new GraphQLNonNull(GraphQLBoolean),
                };
              }
            ),
            hasPreviousPage: fieldWithHooks(
              "hasPreviousPage",
              ({ addDataGenerator }) => {
                addDataGenerator(() => {
                  return {
                    calculateHasPreviousPage: true,
                  };
                });
                return {
                  description:
                    "When paginating backwards, are there more items?",
                  type: new GraphQLNonNull(GraphQLBoolean),
                };
              }
            ),
          }),
        },
        {
          isPageInfo: true,
        }
      );
      return _;
    }
  );
}: Plugin);
