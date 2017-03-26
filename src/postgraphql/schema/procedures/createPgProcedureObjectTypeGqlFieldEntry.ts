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
 * Creates a procedure field for a given object type. We assume that the type
 * of the source is the correct type.
 */
// TODO: This is almost a straight copy/paste of
// `createPgProcedureQueryGqlFieldEntries`. Refactor these hooks man!
export default function createPgProcedureObjectTypeGqlFieldEntry (
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
 * procedure with the provided arguments, and the source object as the first
 * argument.
 */
function createPgSingleProcedureQueryGqlFieldEntry (
  buildToken: BuildToken,
  pgCatalog: PgCatalog,
  pgProcedure: PgCatalogProcedure,
): [string, GraphQLFieldConfig<mixed, mixed>] {
  const fixtures = createPgProcedureFixtures(buildToken, pgCatalog, pgProcedure)

  // Create our GraphQL input fields users will use to input data into our
  // procedure.
  const argEntries = fixtures.args.slice(1).map<[string, GraphQLArgumentConfig]>(
    ({ name, gqlType }) =>
      [formatName.arg(name), {
        // No description…
        type: pgProcedure.isStrict ? new GraphQLNonNull(getNullableType(gqlType)) : gqlType,
      }],
  )

  const fieldName = formatName.field(pgProcedure.name.substring(fixtures.args[0].pgType.name.length + 1))
  const sourceName = (_tbl, _fld, args, alias) => `${fieldName}###${alias || ''}`,
  return [fieldName, {
    description: pgProcedure.description,
    type: fixtures.return.gqlType,
    args: buildObject(argEntries),
    sourceName,
    sqlExpression: (aliasIdentifier, gqlFieldName, args, context) => {
      const input = [aliasIdentifier].concat(argEntries.map(([argName], i) => fixtures.args[i + 1].fromGqlInput(args[argName])))
      return sql.query`(${createPgProcedureSqlCall(fixtures, input, true)})`
    },

    async resolve (source, args, context, resolveInfo): Promise<mixed> {
      const fieldNodes = resolveInfo.fieldNodes || resolveInfo.fieldASTs
      const alias = fieldNodes[0].alias && fieldNodes[0].alias.value
      const attrName = sourceName(null, null, args, alias)
      if (source.has(attrName)) {
        const value = source.get(attrName)
        return value != null ? fixtures.return.intoGqlOutput(value) : null
      } else {
        // Subquery failed (e.g. computed function as subfield of compound type); fall back to old logic
        const client = pgClientFromContext(context)
        const input = [source, ...argEntries.map(([argName], i) => fixtures.args[i + 1].fromGqlInput(args[argName]))]
        const query = sql.compile(sql.query`select to_json(${createPgProcedureSqlCall(fixtures, input)}) as value`)
        const { rows: [row] } = await client.query(query)
        return row ? fixtures.return.intoGqlOutput(row['value']) : null
      }
    },
  }]
}

/**
 * Creates a field for procedures that return a set of values. For these
 * procedures we create a connection field to allow for pagination with the
 * source argument as the first argument.
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
  const inputArgEntries = fixtures.args.slice(1).map<[string, GraphQLArgumentConfig]>(
    ({ name, gqlType }) =>
      [formatName.arg(name), {
        // No description…
        type: pgProcedure.isStrict ? new GraphQLNonNull(getNullableType(gqlType)) : gqlType,
      }],
  )

  return [formatName.field(pgProcedure.name.substring(fixtures.args[0].pgType.name.length + 1)), createConnectionGqlField<mixed, Array<mixed>, mixed>(buildToken, paginator, {
    description: pgProcedure.description,
    inputArgEntries,
    getPaginatorInput: (source, args) =>
      [source, ...inputArgEntries.map(([argName], i) => fixtures.args[i + 1].fromGqlInput(args[argName]))],
    subquery: true,
  })]
}
