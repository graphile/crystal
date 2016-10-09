import { GraphQLNonNull, GraphQLFieldConfig, GraphQLArgumentConfig, getNullableType } from 'graphql'
import { ObjectType } from '../../../../interface'
import { formatName, buildObject } from '../../../../graphql/utils'
import BuildToken from '../../../../graphql/schema/BuildToken'
import createConnectionGQLField from '../../../../graphql/schema/connection/createConnectionGQLField'
import transformGQLInputValue from '../../../../graphql/schema/transformGQLInputValue'
import { sql } from '../../../../postgres/utils'
import { PGCatalog, PGCatalogProcedure } from '../../../../postgres/introspection'
import PGClassObjectType from '../../../../postgres/inventory/type/PGClassObjectType'
import pgClientFromContext from '../../../../postgres/inventory/pgClientFromContext'
import transformPGValueIntoValue from '../../../../postgres/inventory/transformPGValueIntoValue'
import createPGProcedureFixtures from '../createPGProcedureFixtures'
import createPGProcedureSQLCall from '../createPGProcedureSQLCall'
import PGProcedurePaginator from '../PGProcedurePaginator'
import isPGProcedureComputedColumn from '../isPGProcedureComputedColumn'

/**
 * Creates the procedure fields for a given object type in our system which
 * will be used as “computed columns”. If the procedure passes the constraints
 * in `isPGProcedureComputedColumn`, it will be a computed field for that
 * Postgres class.
 */
// TODO: This is almost a straight copy/paste of
// `createPGProcedureQueryGQLFieldEntries`. Refactor these hooks man!
export default function createPGProcedureObjectTypeGQLFieldEntries (
  buildToken: BuildToken,
  objectType: ObjectType,
  pgCatalog: PGCatalog,
): Array<[string, GraphQLFieldConfig<ObjectType.Value, mixed>]> {
  // If this object type is not an instance of `PGObjectType`, we don’t add
  // any extra fields.
  if (!(objectType instanceof PGClassObjectType))
    return []

  return (
    pgCatalog.getProcedures()
      .filter(pgProcedure => isPGProcedureComputedColumn(pgCatalog, pgProcedure, objectType.pgClass))
      .map(pgProcedure => {
        const fieldName = formatName.field(pgProcedure.name.substring(objectType.pgClass.name.length + 1))
        return (
          pgProcedure.returnsSet
            ? createPGSetProcedureQueryGQLFieldEntry(buildToken, pgCatalog, pgProcedure, fieldName)
            : createPGSingleProcedureQueryGQLFieldEntry(buildToken, pgCatalog, pgProcedure, fieldName)
        )
      })
  )
}

/**
 * Creates a standard query field entry for a procedure. Will execute the
 * procedure with the provided arguments, and the source object as the first
 * argument.
 */
function createPGSingleProcedureQueryGQLFieldEntry (
  buildToken: BuildToken,
  pgCatalog: PGCatalog,
  pgProcedure: PGCatalogProcedure,
  fieldName: string,
): [string, GraphQLFieldConfig<mixed, mixed>] {
  const fixtures = createPGProcedureFixtures(buildToken, pgCatalog, pgProcedure)

  // Create our GraphQL input fields users will use to input data into our
  // procedure.
  const argEntries = fixtures.args.slice(1).map<[string, GraphQLArgumentConfig<mixed>]>(
    ({ name, gqlType }) =>
      [formatName.arg(name), {
        // TODO: description
        type: pgProcedure.isStrict ? new GraphQLNonNull(getNullableType(gqlType)) : gqlType,
      }]
  )

  return [fieldName, {
    description: pgProcedure.description,
    type: fixtures.return.gqlType,
    args: buildObject(argEntries),

    async resolve (source, args, context): Promise<mixed> {
      const client = pgClientFromContext(context)
      const input = [source, ...argEntries.map(([argName, { type }]) => transformGQLInputValue(type, args[argName]))]
      const query = sql.compile(sql.query`select to_json(${createPGProcedureSQLCall(fixtures, input)}) as value`)
      const { rows: [row] } = await client.query(query)
      return row ? transformPGValueIntoValue(fixtures.return.type, row['value']) : null
    },
  }]
}

/**
 * Creates a field for procedures that return a set of values. For these
 * procedures we create a connection field to allow for pagination with the
 * source argument as the first argument.
 */
function createPGSetProcedureQueryGQLFieldEntry (
  buildToken: BuildToken,
  pgCatalog: PGCatalog,
  pgProcedure: PGCatalogProcedure,
  fieldName: string,
): [string, GraphQLFieldConfig<mixed, mixed>] {
  const fixtures = createPGProcedureFixtures(buildToken, pgCatalog, pgProcedure)
  const paginator = new PGProcedurePaginator(fixtures)

  // Create our GraphQL input fields users will use to input data into our
  // procedure.
  const inputArgEntries = fixtures.args.slice(1).map<[string, GraphQLArgumentConfig<mixed>]>(
    ({ name, gqlType }) =>
      [formatName.arg(name), {
        // TODO: description
        type: pgProcedure.isStrict ? new GraphQLNonNull(getNullableType(gqlType)) : gqlType,
      }]
  )

  return [fieldName, createConnectionGQLField<mixed, Array<mixed>, mixed>(buildToken, paginator, {
    inputArgEntries,
    getPaginatorInput: (source, args) =>
      [source, ...inputArgEntries.map(([argName, { type }]) => transformGQLInputValue(type, args[argName]))],
  })]
}
