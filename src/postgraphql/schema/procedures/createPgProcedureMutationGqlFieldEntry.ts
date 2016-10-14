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
import createMutationGqlField from '../../../graphql/schema/createMutationGqlField'
import transformGqlInputValue from '../../../graphql/schema/transformGqlInputValue'
import createCollectionRelationTailGqlFieldEntries from '../../../graphql/schema/collection/createCollectionRelationTailGqlFieldEntries'
import { sql } from '../../../postgres/utils'
import { PgCatalog, PgCatalogProcedure } from '../../../postgres/introspection'
import PgCollection from '../../../postgres/inventory/collection/PgCollection'
import pgClientFromContext from '../../../postgres/inventory/pgClientFromContext'
import transformPgValueIntoValue from '../../../postgres/inventory/transformPgValueIntoValue'
import createPgProcedureFixtures from './createPgProcedureFixtures'
import createPgProcedureSqlCall from './createPgProcedureSqlCall'

/**
 * Creates a single mutation GraphQL field entry for our procedure. We use the
 * `createMutationGqlField` utility from the `graphql` package to do so.
 */
// TODO: test
export default function createPgProcedureMutationGqlFieldEntry (
  buildToken: BuildToken,
  pgCatalog: PgCatalog,
  pgProcedure: PgCatalogProcedure,
): [string, GraphQLFieldConfig<mixed, mixed>] {
  const { inventory } = buildToken
  const fixtures = createPgProcedureFixtures(buildToken, pgCatalog, pgProcedure)

  // See if the output type of this procedure is a single object, try to find a
  // `PgCollection` which has the same type. If it exists we add some extra
  // stuffs.
  const pgCollection = !pgProcedure.returnsSet
    ? inventory.getCollections().find(collection => collection instanceof PgCollection && collection.pgClass.typeId === fixtures.return.pgType.id)
    : null

  // Create our GraphQL input fields users will use to input data into our
  // procedure.
  const inputFields = fixtures.args.map<[string, GraphQLInputFieldConfig<mixed>]>(
    ({ name, gqlType }) =>
      [formatName.field(name), {
        // No description…
        type: pgProcedure.isStrict ? new GraphQLNonNull(getNullableType(gqlType)) : gqlType,
      }]
  )

  return [formatName.field(pgProcedure.name), createMutationGqlField<mixed>(buildToken, {
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

      // Add related objects if there is an associated `PgCollection`. This
      // helps in Relay 1.
      ...(pgCollection ? createCollectionRelationTailGqlFieldEntries(buildToken, pgCollection) : []),
    ],

    // Actually execute the procedure here.
    async execute (context, gqlInput): Promise<mixed> {
      const client = pgClientFromContext(context)

      // Turn our GraphQL input into an input tuple.
      const input = inputFields.map(([fieldName, { type }]) => transformGqlInputValue(type, gqlInput[fieldName]))

      // Craft our procedure call. A procedure name with arguments, like any
      // other function call. Input values must be coerced twice however.
      const procedureCall = createPgProcedureSqlCall(fixtures, input)

      const aliasIdentifier = Symbol()

      const query = sql.compile(
        // If the procedure returns a set, we must select a set of values.
        pgProcedure.returnsSet
          ? sql.query`select to_json(${sql.identifier(aliasIdentifier)}) as value from ${procedureCall} as ${sql.identifier(aliasIdentifier)}`
          : sql.query`select to_json(${procedureCall}) as value`
      )

      const { rows } = await client.query(query)
      const values = rows.map(({ value }) => transformPgValueIntoValue(fixtures.return.type, value))

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
