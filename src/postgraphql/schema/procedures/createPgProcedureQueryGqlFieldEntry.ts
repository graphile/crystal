import { GraphQLNonNull, GraphQLFieldConfig, GraphQLArgumentConfig, getNullableType } from 'graphql'
import { formatName, buildObject } from '../../../graphql/utils'
import BuildToken from '../../../graphql/schema/BuildToken'
import createConnectionGqlField from '../../../graphql/schema/connection/createConnectionGqlField'
import { sql } from '../../../postgres/utils'
import { PgCatalog, PgCatalogProcedure } from '../../../postgres/introspection'
import pgClientFromContext from '../../../postgres/inventory/pgClientFromContext'
import createPgProcedureFixtures from './createPgProcedureFixtures'
import createPgProcedureSqlCall from './createPgProcedureSqlCall'
import PgProcedurePaginator from './PgProcedurePaginator'

/**
 * Creates the fields for query procedures. Query procedures that return
 * a set will expose a GraphQL connection.
 */
export default function createPgProcedureQueryGqlFieldEntry (
  buildToken: BuildToken,
  pgCatalog: PgCatalog,
  pgProcedure: PgCatalogProcedure,
): [string, GraphQLFieldConfig<mixed, mixed>] {
  return (
    pgProcedure.returnsSet
      ? createPgSetProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure)
      : createPgSingleProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure)
  )
}

/**
 * Creates a standard query field entry for a procedure. Will execute the
 * procedure with the provided arguments.
 */
function createPgSingleProcedureQueryGqlFieldEntry (
  buildToken: BuildToken,
  pgCatalog: PgCatalog,
  pgProcedure: PgCatalogProcedure,
): [string, GraphQLFieldConfig<mixed, mixed>] {
  const fixtures = createPgProcedureFixtures(buildToken, pgCatalog, pgProcedure)

  if (fixtures.return === null) {
    throw new Error('Procedures with a void return type are not allowed in GraphQL queries.')
  }

  // Create our GraphQL input fields users will use to input data into our
  // procedure.
  const argEntries = fixtures.args.map<[string, GraphQLArgumentConfig]>(
    ({ name, gqlType }) =>
      [formatName.arg(name), {
        // No description…
        type: pgProcedure.isStrict ? new GraphQLNonNull(getNullableType(gqlType)) : gqlType,
      }],
  )

  return [formatName.field(pgProcedure.name), {
    description: pgProcedure.description,
    type: fixtures.return.gqlType,
    args: buildObject(argEntries),

    async resolve (_source, args, context): Promise<mixed> {
      const client = pgClientFromContext(context)
      const input = argEntries.map(([argName], i) => fixtures.args[i].fromGqlInput(args[argName]))
      const query = sql.compile(sql.query`select to_json(${createPgProcedureSqlCall(fixtures, input)}) as value`)
      const { rows: [row] } = await client.query(query)
      return row ? fixtures.return!.intoGqlOutput(fixtures.return!.type.transformPgValueIntoValue(row['value'])) : null
    },
  }]
}

/**
 * Creates a field for procedures that return a set of values. For these
 * procedures we create a connection field to allow for pagination.
 */
function createPgSetProcedureQueryGqlFieldEntry (
  buildToken: BuildToken,
  pgCatalog: PgCatalog,
  pgProcedure: PgCatalogProcedure,
): [string, GraphQLFieldConfig<mixed, mixed>] {
  const fixtures = createPgProcedureFixtures(buildToken, pgCatalog, pgProcedure)
  const paginator = new PgProcedurePaginator(fixtures)

  // Create our GraphQL input fields users will use to input data into our
  // procedure.
  const inputArgEntries = fixtures.args.map<[string, GraphQLArgumentConfig]>(
    ({ name, gqlType }) =>
      [formatName.arg(name), {
        // No description…
        type: pgProcedure.isStrict ? new GraphQLNonNull(getNullableType(gqlType)) : gqlType,
      }],
  )

  return [
    formatName.field(pgProcedure.name),
    createConnectionGqlField<mixed, Array<mixed>, mixed>(buildToken, paginator, {
      description: pgProcedure.description,
      inputArgEntries,
      getPaginatorInput: (_source, args) =>
        inputArgEntries.map(([argName], i) => fixtures.args[i].fromGqlInput(args[argName])),
    }),
  ]
}
