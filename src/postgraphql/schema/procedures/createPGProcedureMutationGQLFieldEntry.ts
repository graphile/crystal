import pluralize = require('pluralize')
import {
  GraphQLNonNull,
  GraphQLList,
  GraphQLFieldConfig,
  GraphQLInputFieldConfig,
  getNullableType,
} from 'graphql'
import { Type, NullableType, ListType } from '../../../interface'
import { formatName } from '../../../graphql/utils'
import BuildToken from '../../../graphql/schema/BuildToken'
import createMutationGQLField from '../../../graphql/schema/createMutationGQLField'
import transformGQLInputValue from '../../../graphql/schema/transformGQLInputValue'
import createCollectionRelationTailGQLFieldEntries from '../../../graphql/schema/collection/createCollectionRelationTailGQLFieldEntries'
import { sql } from '../../../postgres/utils'
import { PGCatalog, PGCatalogProcedure } from '../../../postgres/introspection'
import PGCollection from '../../../postgres/inventory/collection/PGCollection'
import pgClientFromContext from '../../../postgres/inventory/pgClientFromContext'
import transformPGValueIntoValue from '../../../postgres/inventory/transformPGValueIntoValue'
import createPGProcedureFixtures from './createPGProcedureFixtures'
import createPGProcedureSQLCall from './createPGProcedureSQLCall'

/**
 * Creates a single mutation GraphQL field entry for our procedure. We use the
 * `createMutationGQLField` utility from the `graphql` package to do so.
 */
// TODO: test
export default function createPGProcedureMutationGQLFieldEntry (
  buildToken: BuildToken,
  pgCatalog: PGCatalog,
  pgProcedure: PGCatalogProcedure,
): [string, GraphQLFieldConfig<mixed, mixed>] {
  const { inventory } = buildToken
  const fixtures = createPGProcedureFixtures(buildToken, pgCatalog, pgProcedure)

  // See if the output type of this procedure is a single object, try to find a
  // `PGCollection` which has the same type. If it exists we add some extra
  // stuffs.
  const pgCollection = !pgProcedure.returnsSet
    ? inventory.getCollections().find(collection => collection instanceof PGCollection && collection.pgClass.typeId === fixtures.return.pgType.id)
    : null

  // Create our GraphQL input fields users will use to input data into our
  // procedure.
  const inputFields = fixtures.args.map<[string, GraphQLInputFieldConfig<mixed>]>(
    ({ name, gqlType }) =>
      [formatName.field(name), {
        // TODO: description
        type: pgProcedure.isStrict ? new GraphQLNonNull(getNullableType(gqlType)) : gqlType,
      }]
  )

  return [formatName.field(pgProcedure.name), createMutationGQLField<mixed>(buildToken, {
    name: pgProcedure.name,
    description: pgProcedure.description,

    inputFields,

    outputFields: [
      [formatName.field(pgProcedure.returnsSet
        // If we are returning a set, we should pluralize the name just in
        // case.
        ? pluralize(getTypeFieldName(fixtures.return.type))
        : getTypeFieldName(fixtures.return.type)
      ), {
          // If we are returning a set, we should wrap our type in a GraphQL
          // list.
          type: pgProcedure.returnsSet
            ? new GraphQLList(fixtures.return.gqlType)
            : fixtures.return.gqlType,

          resolve: value => value,
      }],

      // Add related objects if there is an associated `PGCollection`. This
      // helps in Relay 1.
      ...(pgCollection ? createCollectionRelationTailGQLFieldEntries(buildToken, pgCollection) : []),
    ],

    // Actually execute the procedure here.
    async execute (context, gqlInput): Promise<mixed> {
      const client = pgClientFromContext(context)

      // Turn our GraphQL input into an input tuple.
      const input = inputFields.map(([fieldName, { type }]) => transformGQLInputValue(type, gqlInput[fieldName]))

      // Craft our procedure call. A procedure name with arguments, like any
      // other function call. Input values must be coerced twice however.
      const procedureCall = createPGProcedureSQLCall(fixtures, input)

      const aliasIdentifier = Symbol()

      const query = sql.compile(
        // If the procedure returns a set, we must select a set of values.
        pgProcedure.returnsSet
          ? sql.query`select to_json(${sql.identifier(aliasIdentifier)}) as value from ${procedureCall} as ${sql.identifier(aliasIdentifier)}`
          : sql.query`select to_json(${procedureCall}) as value`
      )

      const { rows } = await client.query(query)
      const values = rows.map(({ value }) => transformPGValueIntoValue(fixtures.return.type, value))

      // If we selected a set of values, return the full set. Otherwise only
      // return the one we queried.
      return pgProcedure.returnsSet ? values : values[0]
    },
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
