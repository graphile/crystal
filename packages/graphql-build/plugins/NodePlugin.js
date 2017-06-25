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
    const nodeFetcherByType = new Map();
    return build.extend(build, {
      nodeIdFieldName,
      $$nodeType: Symbol("nodeType"),
      nodeFetcherByType,
      getNodeIdForTypeAndIdentifiers(Type, ...identifiers) {
        return base64(JSON.stringify([Type.name, ...identifiers]));
      },
      addNodeFetcherForType(Type, fetcher) {
        if (nodeFetcherByType.get(Type)) {
          throw new Error("There's already a fetcher for this type");
        }
        nodeFetcherByType.set(Type, fetcher);
      },
    });
  });

  builder.hook("init", function defineNodeInterfaceType(
    schema,
    { $$isQuery, $$nodeType, getTypeByName, buildObjectWithHooks }
  ) {
    return buildObjectWithHooks(GraphQLInterfaceType, {
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
          type: new GraphQLNonNull(GraphQLID),
        },
      },
    });
    return schema;
  });

  builder.hook("objectType:interfaces", function addNodeIdToQuery(
    interfaces,
    { parseResolveInfo, getTypeByName, extend, nodeFetcherByType },
    { scope: { isRootQuery } }
  ) {
    if (!isRootQuery) {
      return interfaces;
    }
    return [...interfaces, getTypeByName("Node")];
  });

  builder.hook("objectType:fields", function addNodeIdToQuery(
    fields,
    { $$isQuery, parseResolveInfo, getTypeByName, extend, nodeFetcherByType },
    { scope: { isRootQuery } }
  ) {
    if (!isRootQuery) {
      return fields;
    }
    return extend(fields, {
      [nodeIdFieldName]: {
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
        resolve(data, args, context, resolveInfo) {
          const nodeId = args[nodeIdFieldName];
          if (nodeId === "query") {
            return $$isQuery;
          }
          try {
            const [typeName, ...identifiers] = JSON.parse(base64Decode(nodeId));
            const Type = getTypeByName(typeName);
            const resolver = nodeFetcherByType.get(Type);
            const parsedResolveInfoFragment = parseResolveInfo(
              resolveInfo,
              Type
            );
            return resolver(
              data,
              identifiers,
              context,
              parsedResolveInfoFragment
            );
          } catch (e) {
            return null;
          }
        },
      },
    });
  });
};
