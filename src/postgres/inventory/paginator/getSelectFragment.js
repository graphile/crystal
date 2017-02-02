import { sql } from '../../utils'

export default (resolveInfo, aliasIdentifier) => {
  if (!resolveInfo) {
    console.error("This won't work much longer! Just a hack to keep the tests working")
    return sql.query`to_json(${sql.identifier(aliasIdentifier)})`
  }
  const {parentType, variableValues, fragments} = resolveInfo
  const fieldNodes = resolveInfo.fieldNodes || resolveInfo.fieldASTs
  const fields = [];
  fieldNodes.forEach(
    queryAST => {
      const fieldName = queryAST.name.value
      const field = parentType._fields[fieldName]
      if (!field) throw new Error("Couldn't fetch field!")
      const {nodeGqlType, nodeQueryAST} = getNodeTypeFromRelayType(stripNonNullType(field.type), queryAST)
      // Get REQUESTED expressions (from the GQL query)
      addSelectionsToFields(fields, nodeQueryAST, nodeGqlType, fragments, variableValues)
      // XXX: Get REQUIRED expressions (e.g. for __id / pagination / etc)
    }
  );

  return sql.query`to_json(${sql.identifier(aliasIdentifier)})`
}

function addSelectionsToFields(fields, selectionsQueryAST, gqlType, fragments, variableValues) {
  if (!selectionsQueryAST.selectionSet) {
    return;
  }
  selectionsQueryAST.selectionSet.selections.forEach(
    selectionQueryAST => {
      if (selectionQueryAST.kind === 'Field') {
        const fieldName = selectionQueryAST.name.value
        const field = gqlType._fields[fieldName]
        const fieldGqlType = stripNonNullType(field.type)
        const args = {}
        if (selectionQueryAST.arguments.length) {
          for (let arg of selectionQueryAST.arguments) {
            args[arg.name.value] = parseArgValue(arg.value, variableValues)
          }
        }
        if (field.sqlExpression) {
          fields.push(field.sqlExpression(args));
        }
      } else if (selectionQueryAST.kind === 'InlineFragment') {
        const selectionNameOfType = selectionQueryAST.typeCondition.name.value
        const sameType = selectionNameOfType === gqlType.name
        const interfaceType = gqlType._interfaces.map(iface => iface.name).indexOf(selectionNameOfType) >= 0
        if (sameType || interfaceType) {
          addSelectionsToFields(fields, selectionQueryAST.selectionSet.selections, gqlType, fragments, variableValues)
        }
      } else if (selectionQueryAST.kind === 'FragmentSpread') {
        const fragmentName = selectionQueryAST.name.value
        const fragment = fragments[fragmentName]
        const fragmentNameOfType = fragment.typeCondition.name.value
        const sameType = fragmentNameOfType === gqlType.name
        const interfaceType = gqlType._interfaces.map(iface => iface.name).indexOf(fragmentNameOfType) >= 0
        if (sameType || interfaceType) {
          addSelectionsToFields(fields, fragment.selectionSet.selections, gqlType, fragments, variableValues)
        }
      } else {
        throw new Error(`${selectionQueryAST.kind} not supported`);
      }
    }
  );
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
