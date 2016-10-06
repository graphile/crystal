import { GraphQLNonNull, GraphQLFieldConfig, GraphQLArgumentConfig, getNullableType } from 'graphql'
import { Type } from '../../../../interface'
import { formatName, buildObject } from '../../../../graphql/utils'
import BuildToken from '../../../../graphql/schema/BuildToken'
import createConnectionGQLField from '../../../../graphql/schema/connection/createConnectionGQLField'
import { PGCatalog, PGCatalogProcedure } from '../../../../postgres/introspection'
import createPGProcedureFixtures from '../createPGProcedureFixtures'
import PGProcedurePaginator from '../PGProcedurePaginator'

/**
 * Creates all of the fields for query procedures. Query procedures that return
 * a set will expose a GraphQL connection.
 */
export default function createPGProcedureQueryGQLFieldEntries (
  buildToken: BuildToken,
  pgCatalog: PGCatalog,
): Array<[string, GraphQLFieldConfig<mixed, mixed>]> {
  return (
    pgCatalog.getProcedures()
      .filter(pgProcedure => pgProcedure.isStable)
      .map(pgProcedure =>
        pgProcedure.returnsSet
          ? createPGSetProcedureQueryGQLFieldEntry(buildToken, pgCatalog, pgProcedure)
          : createPGProcedureQueryGQLFieldEntry(buildToken, pgCatalog, pgProcedure)
      )
  )
}

/**
 * Creates a standard query field entry for a procedure. Will execute the
 * procedure with the provided arguments.
 */
function createPGProcedureQueryGQLFieldEntry (
  buildToken: BuildToken,
  pgCatalog: PGCatalog,
  pgProcedure: PGCatalogProcedure,
): [string, GraphQLFieldConfig<mixed, mixed>] {
  const fixtures = createPGProcedureFixtures(buildToken, pgCatalog, pgProcedure)

  // Create our GraphQL input fields users will use to input data into our
  // procedure.
  const argEntries = fixtures.args.map<[string, GraphQLArgumentConfig<mixed>]>(
    ({ inputName, gqlType }) =>
      [inputName, {
        // TODO: description
        type: pgProcedure.isStrict ? new GraphQLNonNull(getNullableType(gqlType)) : gqlType,
      }]
  )

  return [formatName.field(pgProcedure.name), {
    description: pgProcedure.description,
    type: fixtures.return.gqlType,
    args: buildObject(argEntries),
    resolve: null as any,
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
  const paginator = new PGProcedurePaginator(pgCatalog, pgProcedure, fixtures.return.type)

  // Create our GraphQL input fields users will use to input data into our
  // procedure.
  const inputArgEntries = fixtures.args.map<[string, GraphQLArgumentConfig<mixed>]>(
    ({ inputName, gqlType }) =>
      [inputName, {
        // TODO: description
        type: pgProcedure.isStrict ? new GraphQLNonNull(getNullableType(gqlType)) : gqlType,
      }]
  )

  return [formatName.field(pgProcedure.name), createConnectionGQLField(buildToken, paginator, { inputArgEntries })]
}
