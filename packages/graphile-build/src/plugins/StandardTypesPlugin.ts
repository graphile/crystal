import {
  Plugin,
  Build,
  GraphileObjectTypeConfig,
  ScopeGraphQLObjectType,
} from "../SchemaBuilder";
import { Kind } from "graphql/language";

declare module "../SchemaBuilder" {
  interface ScopeGraphQLObjectType {
    isPageInfo?: true;
  }
}

export default (function StandardTypesPlugin(builder) {
  // XXX: this should be in an "init" plugin, but PgTypesPlugin requires it in build - fix that, then fix this
  builder.hook(
    "build",
    (build: Build): Build => {
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

      build.addType(Cursor, "graphile-build built-in");
      return build;
    },
    ["StandardTypes"]
  );

  builder.hook(
    "init",
    (_, build) => {
      const {
        newWithHooks,
        graphql: { GraphQLNonNull, GraphQLObjectType, GraphQLBoolean },
        inflection,
      } = build;
      const spec: GraphileObjectTypeConfig<any, any> = {
        name: inflection.builtin("PageInfo"),
        description: "Information about pagination in a connection.",
        fields({ fieldWithHooks }) {
          return {
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
              },
              { isPageInfoHasNextPageField: true }
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
              },
              { isPageInfoHasPreviousPageField: true }
            ),
          };
        },
      };
      const scope: ScopeGraphQLObjectType = {
        __origin: `graphile-build built-in`,
        isPageInfo: true,
      };
      // https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo
      /* const PageInfo = */
      newWithHooks(GraphQLObjectType, spec, scope);

      return _;
    },
    ["StandardTypes", "PageInfo"]
  );
} as Plugin);
