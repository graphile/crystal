import { GraphQLNonNull, GraphQLFieldConfig, GraphQLArgumentConfig, getNullableType } from 'graphql'
import { formatName, buildObject } from '../../../graphql/utils'
import BuildToken from '../../../graphql/schema/BuildToken'
import createConnectionGQLField from '../../../graphql/schema/connection/createConnectionGQLField'
import transformGQLInputValue from '../../../graphql/schema/transformGQLInputValue'
import { sql } from '../../../postgres/utils'
import { PGCatalog, PGCatalogProcedure } from '../../../postgres/introspection'
import pgClientFromContext from '../../../postgres/inventory/pgClientFromContext'
import transformPGValueIntoValue from '../../../postgres/inventory/transformPGValueIntoValue'
import createPGProcedureFixtures from './createPGProcedureFixtures'
import createPGProcedureSQLCall from './createPGProcedureSQLCall'
import PGProcedurePaginator from './PGProcedurePaginator'

/**
 * Creates the fields for query procedures. Query procedures that return
 * a set will expose a GraphQL connection.
 */
export default function createPGProcedureQueryGQLFieldEntry (
  buildToken: BuildToken,
  pgCatalog: PGCatalog,
  pgProcedure: PGCatalogProcedure,
): [string, GraphQLFieldConfig<mixed, mixed>] {
  return (
    pgProcedure.returnsSet
      ? createPGSetProcedureQueryGQLFieldEntry(buildToken, pgCatalog, pgProcedure)
      : createPGSingleProcedureQueryGQLFieldEntry(buildToken, pgCatalog, pgProcedure)
  )
}

/**
 * Creates a standard query field entry for a procedure. Will execute the
 * procedure with the provided arguments.
 */
function createPGSingleProcedureQueryGQLFieldEntry (
  buildToken: BuildToken,
  pgCatalog: PGCatalog,
  pgProcedure: PGCatalogProcedure,
): [string, GraphQLFieldConfig<mixed, mixed>] {
  const fixtures = createPGProcedureFixtures(buildToken, pgCatalog, pgProcedure)

  // Create our GraphQL input fields users will use to input data into our
  // procedure.
  const argEntries = fixtures.args.map<[string, GraphQLArgumentConfig<mixed>]>(
    ({ name, gqlType }) =>
      [formatName.arg(name), {
        // TODO: description
        type: pgProcedure.isStrict ? new GraphQLNonNull(getNullableType(gqlType)) : gqlType,
      }]
  )

  return [formatName.field(pgProcedure.name), {
    description: pgProcedure.description,
    type: fixtures.return.gqlType,
    args: buildObject(argEntries),

    async resolve (source, args, context): Promise<mixed> {
      const client = pgClientFromContext(context)
      const input = argEntries.map(([argName, { type }]) => transformGQLInputValue(type, args[argName]))
      const query = sql.compile(sql.query`select to_json(${createPGProcedureSQLCall(fixtures, input)}) as value`)
      const { rows: [row] } = await client.query(query)
      return row ? transformPGValueIntoValue(fixtures.return.type, row['value']) : null
    },
  }]
}

/**
 * Creates a field for procedures that return a set of values. For these
 * procedures we create a connection field to allow for pagination.
 */
function createPGSetProcedureQueryGQLFieldEntry (
  buildToken: BuildToken,
  pgCatalog: PGCatalog,
  pgProcedure: PGCatalogProcedure,
): [string, GraphQLFieldConfig<mixed, mixed>] {
  const fixtures = createPGProcedureFixtures(buildToken, pgCatalog, pgProcedure)
  const paginator = new PGProcedurePaginator(fixtures)

  // Create our GraphQL input fields users will use to input data into our
  // procedure.
  const inputArgEntries = fixtures.args.map<[string, GraphQLArgumentConfig<mixed>]>(
    ({ name, gqlType }) =>
      [formatName.arg(name), {
        // TODO: description
        type: pgProcedure.isStrict ? new GraphQLNonNull(getNullableType(gqlType)) : gqlType,
      }]
  )

  return [
    formatName.field(pgProcedure.name),
    createConnectionGQLField<mixed, Array<mixed>, mixed>(buildToken, paginator, {
      inputArgEntries,
      getPaginatorInput: (source, args) =>
        inputArgEntries.map(([argName, { type }]) => transformGQLInputValue(type, args[argName])),
    }),
  ]
}
