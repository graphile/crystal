const {
  GraphQLNonNull,
  GraphQLID,
  GraphQLInterfaceType,
  getNullableType,
} = require("graphql");
const base64 = str => Buffer.from(String(str)).toString("base64");
const base64Decode = str => Buffer.from(String(str), "base64").toString("utf8");

module.exports = function NodePlugin(builder, { nodeIdFieldName = "nodeId" }) {
  builder.hook("build", build => {
    const nodeFetcherByTypeName = {};
    const nodeAliasByTypeName = {};
    const nodeTypeNameByAlias = {};
    return build.extend(build, {
      nodeIdFieldName,
      $$nodeType: Symbol("nodeType"),
      nodeFetcherByTypeName,
      getNodeIdForTypeAndIdentifiers(Type, ...identifiers) {
        return base64(
          JSON.stringify([this.getNodeAlias(Type), ...identifiers])
        );
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
    });
  });

  builder.hook("init", function defineNodeInterfaceType(
    _,
    { $$isQuery, $$nodeType, getTypeByName, buildObjectWithHooks }
  ) {
    buildObjectWithHooks(GraphQLInterfaceType, {
      name: "Node",
      resolveType: value => {
        if (value === $$isQuery) {
          return getTypeByName("Query");
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
    });
    return _;
  });

  builder.hook("GraphQLObjectType:interfaces", function addNodeIdToQuery(
    interfaces,
    { getTypeByName },
    { scope: { isRootQuery } }
  ) {
    if (!isRootQuery) {
      return interfaces;
    }
    return [...interfaces, getTypeByName("Node")];
  });

  builder.hook("GraphQLObjectType:fields", function addNodeIdToQuery(
    fields,
    {
      $$isQuery,
      $$nodeType,
      parseResolveInfo,
      getTypeByName,
      extend,
      nodeFetcherByTypeName,
      getNodeType,
    },
    { scope: { isRootQuery } }
  ) {
    if (!isRootQuery) {
      return fields;
    }
    return extend(fields, {
      [nodeIdFieldName]: {
        description:
          "A globally unique identifier. Can be used in various places throughout the system to identify this single value.",
        type: new GraphQLNonNull(GraphQLID),
        resolve() {
          return "query";
        },
      },
      node: {
        type: getTypeByName("Node"),
        args: {
          [nodeIdFieldName]: {
            type: new GraphQLNonNull(GraphQLID),
          },
        },
        async resolve(data, args, context, resolveInfo) {
          const nodeId = args[nodeIdFieldName];
          if (nodeId === "query") {
            return $$isQuery;
          }
          try {
            const [alias, ...identifiers] = JSON.parse(base64Decode(nodeId));
            const Type = getNodeType(alias);
            const resolver = nodeFetcherByTypeName[Type.name];
            const parsedResolveInfoFragment = parseResolveInfo(
              resolveInfo,
              {},
              Type
            );
            const node = await resolver(
              data,
              identifiers,
              context,
              parsedResolveInfoFragment,
              resolveInfo.returnType
            );
            node[$$nodeType] = Type;
            return node;
          } catch (e) {
            return null;
          }
        },
      },
    });
  });
};
