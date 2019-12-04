import {
  Plugin,
  ResolvedLookAhead,
  Hook,
  ContextGraphQLObjectTypeInterfaces,
  GraphileResolverContext,
} from "../SchemaBuilder";
import { ResolveTree } from "graphql-parse-resolve-info";

const base64 = str => Buffer.from(String(str)).toString("base64");
const base64Decode = str => Buffer.from(String(str), "base64").toString("utf8");

export type NodeFetcher<T = any> = (
  data: unknown,
  identifiers: Array<unknown>,
  context: GraphileResolverContext,
  parsedResolveInfoFragment: ResolveTree,
  type: import("graphql").GraphQLType,
  resolveData: ResolvedLookAhead,
  resolveInfo: import("graphql").GraphQLResolveInfo
) => T;

declare module "../SchemaBuilder" {
  interface Build {
    nodeIdFieldName: string;
    $$nodeType: symbol;
    nodeFetcherByTypeName: { [a: string]: NodeFetcher };
    getNodeIdForTypeAndIdentifiers: (
      Type: import("graphql").GraphQLType,
      ...identifiers: Array<unknown>
    ) => string;
    getTypeAndIdentifiersFromNodeId: (
      nodeId: string
    ) => {
      Type: import("graphql").GraphQLType;
      identifiers: Array<unknown>;
    };

    addNodeFetcherForTypeName: (typeName: string, fetcher: NodeFetcher) => void;
    getNodeAlias: (typeName: string) => string;
    getNodeType: (alias: string) => import("graphql").GraphQLType;
    setNodeAlias: (typeName: string, alias: string) => void;
  }
}

export default (function NodePlugin(
  builder,
  { nodeIdFieldName: inNodeIdFieldName }
) {
  const nodeIdFieldName: string = inNodeIdFieldName
    ? String(inNodeIdFieldName)
    : "id";
  builder.hook(
    "build",
    build => {
      const nodeFetcherByTypeName = {};
      const nodeAliasByTypeName = {};
      const nodeTypeNameByAlias = {};
      return build.extend(
        build,
        {
          nodeIdFieldName,
          $$nodeType: Symbol("nodeType"),
          nodeFetcherByTypeName,
          getNodeIdForTypeAndIdentifiers(Type, ...identifiers) {
            return base64(
              JSON.stringify([this.getNodeAlias(Type), ...identifiers])
            );
          },
          getTypeAndIdentifiersFromNodeId(nodeId) {
            const [alias, ...identifiers] = JSON.parse(base64Decode(nodeId));
            return {
              Type: this.getNodeType(alias),
              identifiers,
            };
          },
          addNodeFetcherForTypeName(typeName, fetcher) {
            if (nodeFetcherByTypeName[typeName]) {
              throw new Error("There's already a fetcher for this type");
            }
            if (!fetcher) {
              throw new Error("No fetcher specified");
            }
            nodeFetcherByTypeName[typeName] = fetcher;
          },
          getNodeAlias(typeName) {
            return nodeAliasByTypeName[typeName] || typeName;
          },
          getNodeType(alias) {
            return this.getTypeByName(nodeTypeNameByAlias[alias] || alias);
          },
          setNodeAlias(typeName, alias) {
            if (
              nodeTypeNameByAlias[alias] &&
              nodeTypeNameByAlias[alias] !== typeName
            ) {
              // eslint-disable-next-line no-console
              console.warn(
                `SERIOUS WARNING: two GraphQL types (${typeName} and ${nodeTypeNameByAlias[alias]}) are trying to use the same node alias '${alias}' which may mean that the Relay Global Object Identification identifiers in your schema may not be unique. To solve this, you should skip the PgNodeAliasPostGraphile plugin, but note this will change all your existing Node IDs. For alternative solutions, get in touch via GitHub or Discord`
              );
            }
            nodeAliasByTypeName[typeName] = alias;
            nodeTypeNameByAlias[alias] = typeName;
          },
        },

        `Adding 'Node' interface support to the Build`
      );
    },
    ["Node"]
  );

  builder.hook(
    "init",
    function defineNodeInterfaceType(_, build) {
      const {
        $$isQuery,
        $$nodeType,
        getTypeByName,
        newWithHooks,
        graphql: {
          GraphQLNonNull,
          GraphQLID,
          GraphQLInterfaceType,
          getNullableType,
        },

        inflection,
      } = build;
      let Query;
      newWithHooks(
        GraphQLInterfaceType,
        {
          name: inflection.builtin("Node"),
          description: "An object with a globally unique `ID`.",
          resolveType: value => {
            if (value === $$isQuery) {
              if (!Query) Query = getTypeByName(inflection.builtin("Query"));
              return Query;
            } else if (value[$$nodeType]) {
              return getNullableType(value[$$nodeType]);
            }
          },
          fields: {
            [nodeIdFieldName]: {
              description:
                "A globally unique identifier. Can be used in various places throughout the system to identify this single value.",
              type: new GraphQLNonNull(GraphQLID),
            },
          },
        },

        {
          __origin: `graphile-build built-in (NodePlugin); you can omit this plugin if you like, but you'll lose compatibility with Relay`,
        }
      );

      return _;
    },
    ["Node"]
  );

  builder.hook(
    "GraphQLObjectType:interfaces",
    function addNodeIdToQuery(
      interfaces: Array<import("graphql").GraphQLInterfaceTypeConfig<any, any>>,
      build,
      context
    ) {
      const { getTypeByName, inflection } = build;
      const {
        scope: { isRootQuery },
      } = context;
      if (!isRootQuery) {
        return interfaces;
      }
      const Type = getTypeByName(inflection.builtin("Node"));
      if (!(Type instanceof build.graphql.GraphQLInterfaceType)) {
        console.error(
          "Expected 'Node' to be a GraphQLInterfaceType but it wasn't"
        );
        return interfaces;
      }
      if (Type) {
        return [...interfaces, Type];
      } else {
        return interfaces;
      }
    } as Hook<
      Array<import("graphql").GraphQLInterfaceTypeConfig<any, any>>,
      ContextGraphQLObjectTypeInterfaces
    >,
    ["Node"]
  );

  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, context) => {
      const {
        scope: { isRootQuery },
        fieldWithHooks,
      } = context;
      if (!isRootQuery) {
        return fields;
      }
      const {
        getTypeByName,
        extend,
        graphql: { GraphQLNonNull, GraphQLID },
        inflection,
        resolveNode,
      } = build;

      return extend(
        fields,
        {
          [nodeIdFieldName]: {
            description:
              "The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`.",
            type: new GraphQLNonNull(GraphQLID),
            resolve() {
              return "query";
            },
          },

          node: fieldWithHooks(
            "node",
            ({ getDataFromParsedResolveInfoFragment }) => {
              const Node = getTypeByName(inflection.builtin("Node"));
              if (!(Node instanceof build.graphql.GraphQLInterfaceType)) {
                throw new Error(
                  "Expected 'Node' to be a GraphQLInterfaceType but it wasn't"
                );
              }
              return {
                description:
                  "Fetches an object given its globally unique `ID`.",
                type: Node,
                args: {
                  [nodeIdFieldName]: {
                    description: "The globally unique `ID`.",
                    type: new GraphQLNonNull(GraphQLID),
                  },
                },

                resolve(data, args, context, resolveInfo) {
                  const nodeId = args[nodeIdFieldName];
                  return resolveNode(
                    nodeId,
                    build,
                    { getDataFromParsedResolveInfoFragment },
                    data,
                    context,
                    resolveInfo
                  );
                },
              };
            },

            {
              isRootNodeField: true,
            }
          ),
        },

        `Adding Relay Global Object Identification support to the root Query via 'node' and '${nodeIdFieldName}' fields`
      );
    },
    ["Node"]
  );
} as Plugin);
