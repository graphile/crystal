// @flow
import type {
  Plugin,
  Build,
  DataForType,
  Context,
  ContextGraphQLObjectTypeFields,
} from "../SchemaBuilder";
import resolveNode from "../resolveNode";
import type { ResolveTree } from "graphql-parse-resolve-info";
import type { GraphQLType, GraphQLInterfaceType } from "graphql";
import type { BuildExtensionQuery } from "./QueryPlugin";

const base64 = str => Buffer.from(String(str)).toString("base64");
const base64Decode = str => Buffer.from(String(str), "base64").toString("utf8");

export type NodeFetcher = (
  data: mixed,
  identifiers: Array<mixed>,
  context: mixed,
  parsedResolveInfoFragment: ResolveTree,
  type: GraphQLType,
  resolveData: DataForType
) => {};

export type BuildExtensionNode = {|
  nodeIdFieldName: string,
  $$nodeType: Symbol,
  nodeFetcherByTypeName: { [string]: NodeFetcher },
  getNodeIdForTypeAndIdentifiers(
    Type: GraphQLType,
    ...identifiers: Array<mixed>
  ): string,
  getTypeAndIdentifiersFromNodeId(
    nodeId: string
  ): {
    Type: GraphQLType,
    identifiers: Array<mixed>,
  },
  addNodeFetcherForTypeName(typeName: string, fetcher: NodeFetcher): void,
  getNodeAlias(typeName: string): string,
  getNodeType(alias: string): GraphQLType,
  setNodeAlias(typeName: string, alias: string): void,
|};

export default (function NodePlugin(
  builder,
  { nodeIdFieldName: inNodeIdFieldName }
) {
  const nodeIdFieldName: string = inNodeIdFieldName
    ? String(inNodeIdFieldName)
    : "id";
  builder.hook(
    "build",
    (build: Build): Build & BuildExtensionNode => {
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
              Type: this.getTypeByName(nodeTypeNameByAlias[alias] || alias),
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
            nodeAliasByTypeName[typeName] = alias;
            nodeTypeNameByAlias[alias] = typeName;
          },
        },
        `Adding 'Node' interface support to the Build`
      );
    }
  );

  builder.hook("init", function defineNodeInterfaceType(
    _: {},
    build: {| ...Build, ...BuildExtensionQuery, ...BuildExtensionNode |}
  ) {
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
    } = build;
    let Query;
    newWithHooks(
      GraphQLInterfaceType,
      {
        name: "Node",
        description: "An object with a globally unique `ID`.",
        resolveType: value => {
          if (value === $$isQuery) {
            if (!Query) Query = getTypeByName("Query");
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
  });

  builder.hook("GraphQLObjectType:interfaces", function addNodeIdToQuery(
    interfaces: Array<GraphQLInterfaceType>,
    build,
    context
  ) {
    const { getTypeByName } = build;
    const {
      scope: { isRootQuery },
    } = context;
    if (!isRootQuery) {
      return interfaces;
    }
    const Type = getTypeByName("Node");
    if (Type) {
      return [...interfaces, Type];
    } else {
      return interfaces;
    }
  });

  builder.hook(
    "GraphQLObjectType:fields",
    (
      fields: {},
      build: {| ...Build, ...BuildExtensionQuery, ...BuildExtensionNode |},
      context: {| ...Context, ...ContextGraphQLObjectTypeFields |}
    ) => {
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
            ({ getDataFromParsedResolveInfoFragment }) => ({
              description: "Fetches an object given its globally unique `ID`.",
              type: getTypeByName("Node"),
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
            }),
            {
              isRootNodeField: true,
            }
          ),
        },
        `Adding Relay Global Object Identification support to the root Query via 'node' and '${nodeIdFieldName}' fields`
      );
    }
  );
}: Plugin);
