import { sql } from '../../utils'

export default (resolveInfo, aliasIdentifier) => {
  if (!resolveInfo) {
    console.error("This won't work much longer! Just a hack to keep the tests working")
    return sql.query`to_json(${sql.identifier(aliasIdentifier)})`
  }
  const {parentType, variableValues} = resolveInfo
  const fieldNodes = resolveInfo.fieldNodes || resolveInfo.fieldASTs
  if (fieldNodes.length !== 1) throw new Error("FIXME! Field nodes doesn't have length 1?!")
  const [queryAST] = fieldNodes
  const fieldName = queryAST.name.value
  const field = parentType._fields[fieldName]
  if (!field) throw new Error("Couldn't fetch field!")
  const {nodeGqlType, nodeQueryAST} = getNodeTypeFromRelayType(stripNonNullType(field.type), queryAST)

  // Get REQUESTED expressions (from the GQL query)
  if (nodeQueryAST.selectionSet) {
    nodeQueryAST.selectionSet.selections.forEach(
      selectionQueryAST => {
        if (selectionQueryAST.kind === 'Field') {
          const fieldName = selectionQueryAST.name.value
          const field = nodeGqlType._fields[fieldName]
          const gqlType = stripNonNullType(field.type)
          const args = {}
          if (nodeQueryAST.arguments.length) {
            for (let arg of nodeQueryASTNode.arguments) {
              args[arg.name.value] = parseArgValue(arg.value, variableValues)
            }
          }
        }
      }
    );
  }

  // XXX: Get REQUIRED expressions (e.g. for __id / pagination / etc)

  return sql.query`to_json(${sql.identifier(aliasIdentifier)})`
}

function getNodeTypeFromRelayType(type, queryASTNode) {
  const nodeGqlType = stripNonNullType(type._fields.edges.type.ofType._fields.node.type)
  const edges = queryASTNode.selectionSet.selections.find(selection => selection.name.value === 'edges')
  const nodeQueryAST =
    edges
    ? edges.selectionSet.selections.find(selection => selection.name.value === 'node') || {}
    : {}
  return { nodeGqlType, nodeQueryAST }
}

function stripNonNullType(type) {
  return type.constructor.name === 'GraphQLNonNull' ? type.ofType : type
}

function parseArgValue(value, variableValues) {
  if (value.kind === 'Variable') {
    const variableName = value.name.value
    return variableValues[variableName]
  }

  let primitive = value.value
  // TODO parse other kinds of variables
  if (value.kind === 'IntValue') {
    primitive = parseInt(primitive)
  }
  return primitive
}
