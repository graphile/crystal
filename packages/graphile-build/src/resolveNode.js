export default async function resolveNode(
  nodeId,
  build,
  { getDataFromParsedResolveInfoFragment },
  data,
  context,
  resolveInfo
) {
  const {
    $$isQuery,
    $$nodeType,
    parseResolveInfo,
    nodeFetcherByTypeName,
    getTypeAndIdentifiersFromNodeId,
    graphql: { getNamedType },
  } = build;
  if (nodeId === "query") {
    return $$isQuery;
  }
  try {
    const { Type, identifiers } = getTypeAndIdentifiersFromNodeId(nodeId);
    if (!Type) {
      throw new Error("Type not found");
    }
    const resolver = nodeFetcherByTypeName[getNamedType(Type).name];
    const parsedResolveInfoFragment = parseResolveInfo(resolveInfo, {}, Type);
    const resolveData = getDataFromParsedResolveInfoFragment(
      parsedResolveInfoFragment,
      getNamedType(Type)
    );
    const node = await resolver(
      data,
      identifiers,
      context,
      parsedResolveInfoFragment,
      resolveInfo.returnType,
      resolveData
    );
    Object.defineProperty(node, $$nodeType, {
      enumerable: false,
      configurable: false,
      value: Type,
    });
    return node;
  } catch (e) {
    return null;
  }
}
