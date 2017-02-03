import { sql } from '../../utils'
import { typeFromAST } from 'graphql'

function getFieldFromNode(ast, parentGqlType) {
  if (ast.kind === 'Field') {
    const fieldName = ast.name.value
    return parentGqlType._fields[fieldName]
  }
  return
}

export function getFieldsFromResolveInfo(resolveInfo, aliasIdentifier, rawTargetGqlType) {
  const targetGqlType = stripNonNullType(rawTargetGqlType)
  const {parentType: parentGqlType, variableValues, fragments, schema} = resolveInfo
  const fieldNodes = resolveInfo.fieldNodes || resolveInfo.fieldASTs
  const fields = {}
  fieldNodes.forEach(
    queryAST => {
      addSelectionsToFields(fields, aliasIdentifier, schema, targetGqlType, fragments, variableValues, parentGqlType, queryAST)
    }
  );
  // XXX: Get REQUIRED expressions (e.g. for __id / pagination / etc)
  if (true /* THIS IS A HACK, DO NOT USE THIS */) {
    Object.keys(targetGqlType._fields).forEach(
      attrName =>  {
        const fld = targetGqlType._fields[attrName]
        if ((attrName === "id" || attrName.endsWith("Id")) && fld.sqlExpression) {
          fields[fld.sqlName(aliasIdentifier)] = fld.sqlExpression(aliasIdentifier);
        }
      }
    )
  }
  return fields;
}

export function getSelectFragmentFromFields(fields) {
  const buildArgs = [];
  for (var k in fields) {
    buildArgs.push(sql.query`${sql.value(k)}::text`, fields[k]);
  }
  return sql.query`json_build_object(${sql.join(buildArgs, ', ')})`
}

export default function getSelectFragment(resolveInfo, aliasIdentifier, targetGqlType) {
  if (!resolveInfo) {
    if (!process.env.WHATEVER) console.error("This won't work much longer! Just a hack to keep the tests working")
    return sql.query`to_json(${sql.identifier(aliasIdentifier)})`
  }
  return getSelectFragmentFromFields(getFieldsFromResolveInfo(resolveInfo, aliasIdentifier, targetGqlType))
}

function addSelectionsToFields(fields, aliasIdentifier, schema, targetGqlType, fragments, variableValues, parentGqlType, queryAST) {
  if (queryAST.kind === 'Field') {
    if (queryAST.name.value.startsWith("__") && queryAST.name.value !== "__id") {
      // Introspection related
      return;
    }
    const field = getFieldFromNode(queryAST, parentGqlType)
    const fieldGqlType = stripNonNullType(field.type)
    if (parentGqlType === targetGqlType) { // We're a subfield of the target; HOORAY!
      const args = {}
      if (queryAST.arguments.length) {
        for (let arg of queryAST.arguments) {
          args[arg.name.value] = parseArgValue(arg.value, variableValues)
        }
      }
      const alias = queryAST.alias && queryAST.alias.value
      if (field.sqlExpression) {
        const sqlName = field.sqlName(aliasIdentifier, args, alias)
        fields[sqlName] = field.sqlExpression(aliasIdentifier, args);
      }
      return;
    }
    // Not a child of targetGqlType, but maybe we're the type itself; or related to it?
    if (!isRelated(targetGqlType, fieldGqlType)) {
      // Not related so stop
      return
    }
    // It is related, so continue through it's selection sets
    queryAST.selectionSet.selections.forEach(
      ast => {
        addSelectionsToFields(fields, aliasIdentifier, schema, targetGqlType, fragments, variableValues, stripNonNullType(stripListType(fieldGqlType)), ast)
      }
    )
  } else if (queryAST.kind === 'InlineFragment') {
    throw new Error("UNTESTED")
    const selectionNameOfType = queryAST.typeCondition.name.value
    const sameType = selectionNameOfType === targetGqlType.name
    const interfaceType = targetGqlType._interfaces.map(iface => iface.name).indexOf(selectionNameOfType) >= 0
    if (sameType || interfaceType) {
      addSelectionsToFields(fields, aliasIdentifier, schema, targetGqlType, fragments, variableValues, parentGqlType, queryAST)
    } else {
      console.log(`🔥 Skipping '${selectionNameOfType}'`)
    }
  } else if (queryAST.kind === 'FragmentSpread') {
    const fieldName = queryAST.name.value
    const fragmentName = fieldName;
    const fragment = fragments[fragmentName]
    processFragment(fragment)
  } else if (queryAST.kind === 'FragmentDefinition') {
    processFragment(queryAST)
  } else {
    throw new Error(`${queryAST.kind} not supported`);
  }

  function processFragment(fragment) {
    const fragmentNameOfType = fragment.typeCondition.name.value

    const fragmentGqlType = stripNonNullType(typeFromAST(schema, fragment.typeCondition))

    if (isRelated(targetGqlType, fragmentGqlType)) {
      if (fragment.selectionSet) {
        fragment.selectionSet.selections.forEach(
          selection => addSelectionsToFields(fields, aliasIdentifier, schema, targetGqlType, fragments, variableValues, fragmentGqlType, selection)
        );
      }
    }
  }
}

function isRelated(targetGqlType, rawOtherType) {
  // Think about interfaces?
  // const interfaceType = targetGqlType._interfaces && targetGqlType._interfaces.map(iface => iface.name).indexOf(fragmentNameOfType) >= 0
  const otherType = stripNonNullType(stripListType(stripNonNullType(rawOtherType)))
  const otherRelatedType = (otherType.constructor.name === 'GraphQLObjectType') && otherType._typeConfig.relatedGqlType
  const types = [
    otherType,
    otherRelatedType && stripNonNullType(otherRelatedType),
  ].filter(_ => _)
  return types.some(
    type => type === targetGqlType || type.name === 'Node'
  )
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

function stripListType(type) {
  return type.constructor.name === 'GraphQLList' ? type.ofType : type
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
