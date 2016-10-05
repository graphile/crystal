import pluralize = require('pluralize')
import {
  GraphQLNonNull,
  GraphQLList,
  GraphQLFieldConfig,
  GraphQLInputFieldConfig,
  getNullableType,
} from 'graphql'
import { Type, NullableType, ListType } from '../../interface'
import { formatName } from '../../graphql/utils'
import BuildToken from '../../graphql/schema/BuildToken'
import createMutationGQLField from '../../graphql/schema/createMutationGQLField'
import { PGCatalog, PGCatalogProcedure } from '../../postgres/introspection'
import createPGProcedureSignatureFixtures from './createPGProcedureSignatureFixtures'

/**
 * Creates mutation field entries for all of our volatile Postgres procedures.
 * May return an empty array if there are not volatile procedures.
 */
export default function createPGProcedureMutationGQLFieldEntries (
  buildToken: BuildToken,
  pgCatalog: PGCatalog,
): Array<[string, GraphQLFieldConfig<mixed, mixed>]> {
  return (
    pgCatalog.getProcedures()
      .filter(pgProcedure => !pgProcedure.isStable)
      .map(pgProcedure => createPGProcedureMutationGQLFieldEntry(buildToken, pgCatalog, pgProcedure))
  )
}

/**
 * Creates a single mutation GraphQL field entry for our procedure. We use the
 * `createMutationGQLField` utility from the `graphql` package to do so.
 */
function createPGProcedureMutationGQLFieldEntry (
  buildToken: BuildToken,
  pgCatalog: PGCatalog,
  pgProcedure: PGCatalogProcedure,
): [string, GraphQLFieldConfig<mixed, mixed>] {
  const signatureFixtures = createPGProcedureSignatureFixtures(buildToken, pgCatalog, pgProcedure)

  // Create our GraphQL input fields users will use to input data into our
  // procedure.
  const inputFields = signatureFixtures.args.map<[string, GraphQLInputFieldConfig<mixed>]>(
    ({ name, gqlType }) =>
      [formatName.field(name), {
        // TODO: description
        type: pgProcedure.isStrict ? new GraphQLNonNull(getNullableType(gqlType)) : gqlType,
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
        ? pluralize(getTypeFieldName(signatureFixtures.return.type))
        : getTypeFieldName(signatureFixtures.return.type)
      ), {
          // If we are returning a set, we should wrap our type in a GraphQL
          // list.
          type: pgProcedure.returnsSet
            ? new GraphQLList(signatureFixtures.return.gqlType)
            : signatureFixtures.return.gqlType,
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
