import pluralize = require('pluralize')
import {
  GraphQLNonNull,
  GraphQLList,
  GraphQLFieldConfig,
  GraphQLInputFieldConfig,
  getNullableType,
} from 'graphql'
import { Type, NullableType, ListType } from '../../../../interface'
import { formatName } from '../../../../graphql/utils'
import BuildToken from '../../../../graphql/schema/BuildToken'
import createMutationGQLField from '../../../../graphql/schema/createMutationGQLField'
import transformGQLInputValue from '../../../../graphql/schema/transformGQLInputValue'
import { sql } from '../../../../postgres/utils'
import { PGCatalog, PGCatalogProcedure } from '../../../../postgres/introspection'
import pgClientFromContext from '../../../../postgres/inventory/pgClientFromContext'
import transformPGValueIntoValue from '../../../../postgres/inventory/transformPGValueIntoValue'
import createPGProcedureFixtures from '../createPGProcedureFixtures'
import createPGProcedureSQLCall from '../createPGProcedureSQLCall'

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
  const fixtures = createPGProcedureFixtures(buildToken, pgCatalog, pgProcedure)

  // Create our GraphQL input fields users will use to input data into our
  // procedure.
  const inputFields = fixtures.args.map<[string, GraphQLInputFieldConfig<mixed>]>(
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
    ],

    // Actually execute the procedure here.
    async execute (context, gqlInput) {
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
