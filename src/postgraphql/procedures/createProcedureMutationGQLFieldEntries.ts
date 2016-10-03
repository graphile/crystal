import pluralize = require('pluralize')
import {
  GraphQLInputType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLFieldConfig,
  GraphQLInputFieldConfig,
  getNullableType,
} from 'graphql'
import { Inventory, Type, NullableType, ListType } from '../../interface'
import { formatName } from '../../graphql/utils'
import BuildToken from '../../graphql/schema/BuildToken'
import getGQLType from '../../graphql/schema/getGQLType'
import createMutationGQLField from '../../graphql/schema/createMutationGQLField'
import { PGCatalog, PGCatalogProcedure, PGCatalogType } from '../../postgres/introspection'
import PGCollection from '../../postgres/inventory/collection/PGCollection'
import getTypeFromPGType from '../../postgres/inventory/type/getTypeFromPGType'

/**
 * Creates mutation field entries for all of our volatile Postgres procedures.
 * May return an empty array if there are not volatile procedures.
 */
export default function createProcedureMutationGQLFieldEntries (
  buildToken: BuildToken,
  pgCatalog: PGCatalog,
): Array<[string, GraphQLFieldConfig<mixed, mixed>]> {
  return (
    pgCatalog.getProcedures()
      .filter(pgProcedure => !pgProcedure.isStable)
      .map(pgProcedure => createProcedureMutationGQLFieldEntry(buildToken, pgCatalog, pgProcedure))
  )
}

/**
 * Creates a single mutation GraphQL field entry for our procedure. We use the
 * `createMutationGQLField` utility from the `graphql` package to do so.
 */
function createProcedureMutationGQLFieldEntry (
  buildToken: BuildToken,
  pgCatalog: PGCatalog,
  pgProcedure: PGCatalogProcedure,
): [string, GraphQLFieldConfig<mixed, mixed>] {
  const { inventory } = buildToken

  // Convert our return type into its appropriate forms.
  const pgReturnType = pgCatalog.assertGetType(pgProcedure.returnTypeId)
  const returnType = getTypeFromPGType(pgCatalog, pgReturnType, inventory)
  const gqlReturnType = getGQLType(buildToken, returnType, false)

  // Convert our args into their appropriate forms, also in this we create the
  // argument name if it does not exist.
  const argDefinitions = pgProcedure.argTypeIds.map<{
    argName: string,
    pgArgType: PGCatalogType,
    argType: Type<mixed>,
    gqlArgType: GraphQLInputType<mixed>,
  }>((typeId, i) => {
    const argName = pgProcedure.argNames[i] || `arg-${i}`
    const pgArgType = pgCatalog.assertGetType(typeId)
    const argType = getTypeFromPGType(pgCatalog, pgArgType, inventory)
    const gqlArgType = getGQLType(buildToken, argType, true)
    return { argName, pgArgType, argType, gqlArgType }
  })

  // Create our GraphQL input fields users will use to input data into our
  // procedure.
  const inputFields = argDefinitions.map<[string, GraphQLInputFieldConfig<mixed>]>(
    ({ argName, pgArgType, argType, gqlArgType }) =>
      [formatName.field(argName), {
        // TODO: description
        type: pgProcedure.isStrict ? new GraphQLNonNull(getNullableType(gqlArgType)) : gqlArgType,
      }]
  )

  return [formatName.field(pgProcedure.name), createMutationGQLField(buildToken, {
    name: pgProcedure.name,
    description: pgProcedure.description,

    inputFields,

    outputFields: [
      [formatName.field(pgProcedure.returnsSet
        // If we are returning a set, we should pluralize the name just in
        // case.
        ? pluralize(getTypeFieldName(returnType))
        : getTypeFieldName(returnType)
      ), {
          // If we are returning a set, we should wrap our type in a GraphQL
          // list.
          type: pgProcedure.returnsSet ? new GraphQLList(gqlReturnType) : gqlReturnType,
      }],
    ],

    // TODO: Execution
    execute: null as any,
  })]
}

/**
 * Gets the field name for any given type. Pluralizes the name of for item
 * types in list types.
 */
function getTypeFieldName (type: Type<mixed>): string {
  if (type instanceof NullableType)
    return getTypeFieldName(type.nonNullType)

  if (type instanceof ListType)
    return pluralize(getTypeFieldName(type.itemType))

  return type.getNamedType().name
}
