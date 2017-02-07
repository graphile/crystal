import { sql } from '../../utils'
import { typeFromAST } from 'graphql'
import { getArgumentValues } from 'graphql/execution/values'

const QUERY = "QUERY"
const SQL_EXPRESSION = "SQL_EXPRESSION"

export function getFieldsFromResolveInfo(resolveInfo, aliasIdentifier, rawTargetGqlType) {
  const targetGqlType = stripNonNullType(rawTargetGqlType)
  const {parentType: parentGqlType, variableValues, fragments, schema} = resolveInfo
  const fieldNodes = resolveInfo.fieldNodes || resolveInfo.fieldASTs
  const fields = {}
  fieldNodes.forEach(
    queryAST => {
      parseASTIntoFields(fields, aliasIdentifier, schema, targetGqlType, fragments, variableValues, parentGqlType, queryAST)
    }
  );
  return fields;
}

export function getSelectFragmentFromFields(fields, aliasIdentifier) {
  const buildArgs = [];
  for (var k in fields) {
    const field = fields[k];
    const arg = {
      QUERY: field => field.query,
      SQL_EXPRESSION: field => {
        return field.sqlExpression(field.aliasIdentifier, field.fieldName, field.args, field.resolveInfo)
      },
    }[field.type](field);
    buildArgs.push(sql.literal(k), arg);
  }
  if (buildArgs.length === 0) {
    return sql.query`to_json(${sql.identifier(aliasIdentifier)})`
  } else {
    return sql.query`json_build_object(${sql.join(buildArgs, ', ')})`
  }
}

export default function getSelectFragment(resolveInfo, aliasIdentifier, targetGqlType) {
  if (!resolveInfo) {
    throw new Error("No resolve info!")
  }
  return getSelectFragmentFromFields(getFieldsFromResolveInfo(resolveInfo, aliasIdentifier, targetGqlType), aliasIdentifier)
}

function parseASTIntoFields(fields, aliasIdentifier, schema, targetGqlType, fragments, variableValues, parentGqlType, queryAST) {
  if (queryAST.kind === 'Field') {
    if (queryAST.name.value.startsWith("__") && queryAST.name.value !== "__id") {
      // Introspection related
      return;
    }
    const fieldName = queryAST.name.value
    const field = getFieldFromAST(queryAST, parentGqlType)
    const fieldGqlType = stripNonNullType(field.type)
    if (parentGqlType === targetGqlType) { // We're a subfield of the target; HOORAY!
      const args = getArgumentValues(field, queryAST, variableValues)
      const alias = queryAST.alias && queryAST.alias.value
      if (field.externalFieldNameDependencies) {
        field.externalFieldNameDependencies.forEach(
          externalFieldName => {
            fields[externalFieldName] = {
              type: QUERY,
              query: sql.query`${sql.identifier(aliasIdentifier)}.${sql.identifier(externalFieldName)}`,
            }
          }
        )
      }
      if (field.externalFieldName) {
        const sourceName = field.sourceName ? field.sourceName(aliasIdentifier, fieldName, args, alias) : field.externalFieldName
        fields[sourceName] = {
          type: QUERY,
          query: sql.query`${sql.identifier(aliasIdentifier)}.${sql.identifier(field.externalFieldName)}`,
        }
        return;
      } else if (field.sqlExpression) {
        const sourceName = field.sourceName ? field.sourceName(aliasIdentifier, fieldName, args, alias) : fieldName
        // XXX: is this sufficient?
        const resolveInfo = {
          parentType: fieldGqlType,
          variableValues,
          fragments,
          schema,
          fieldASTs: queryAST.selectionSet && queryAST.selectionSet.selections.slice(),
        }
        if (fields[sourceName]) {
          const existingEntry = fields[sourceName]
          for (var k in resolveInfo) {
            if (Object.prototype.hasOwnProperty.call(resolveInfo, k) && k !== 'fieldASTs' && (existingEntry.resolveInfo[k] !== resolveInfo[k])) {
              throw new Error(`Inconsistency detected ${k}`)
            }
          }
          if (existingEntry.sqlExpression !== field.sqlExpression
            || existingEntry.aliasIdentifier !== aliasIdentifier
            || existingEntry.fieldName !== fieldName) {
            throw new Error("Inconsistency detected!")
          }
          existingEntry.resolveInfo.fieldASTs.push(...resolveInfo.fieldASTs)
        } else {
          fields[sourceName] = {
            type: SQL_EXPRESSION,
            sqlExpression: field.sqlExpression,
            aliasIdentifier,
            fieldName,
            args,
            resolveInfo,
          };
        }
        return;
      }
    }
    // Not a child of targetGqlType, but maybe we're the type itself; or related to it?
    if (!isRelated(targetGqlType, fieldGqlType)) {
      // Not related so stop
      return
    }
    // It is related, so continue through it's selection sets
    queryAST.selectionSet && queryAST.selectionSet.selections.forEach(
      ast => {
        parseASTIntoFields(fields, aliasIdentifier, schema, targetGqlType, fragments, variableValues, stripNonNullType(stripListType(fieldGqlType)), ast)
      }
    )
  } else if (queryAST.kind === 'InlineFragment') {
    if (queryAST.typeCondition) {
      processFragment(queryAST);
    } else {
      queryAST.selectionSet && queryAST.selectionSet.selections.forEach(
        selection => parseASTIntoFields(fields, aliasIdentifier, schema, targetGqlType, fragments, variableValues, parentGqlType, selection)
      );
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
    const fragmentGqlType = stripNonNullType(typeFromAST(schema, fragment.typeCondition))

    if (isRelated(targetGqlType, fragmentGqlType)) {
      if (fragment.selectionSet) {
        fragment.selectionSet.selections.forEach(
          selection => parseASTIntoFields(fields, aliasIdentifier, schema, targetGqlType, fragments, variableValues, fragmentGqlType, selection)
        );
      }
    }
  }
}

function getFieldFromAST(ast, parentGqlType) {
  if (ast.kind === 'Field') {
    const fieldName = ast.name.value
    return parentGqlType._fields[fieldName]
  }
  return
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

function stripNonNullType(type) {
  return type.constructor.name === 'GraphQLNonNull' ? type.ofType : type
}

function stripListType(type) {
  return type.constructor.name === 'GraphQLList' ? type.ofType : type
}
