import pluralize = require('pluralize')
import {
  GraphQLNonNull,
  GraphQLList,
  GraphQLFieldConfig,
  GraphQLInputFieldConfig,
  getNullableType,
} from 'graphql'
import { Type, switchType } from '../../../interface'
import { formatName } from '../../../graphql/utils'
import BuildToken from '../../../graphql/schema/BuildToken'
import createMutationGqlField from '../../../graphql/schema/createMutationGqlField'
import createCollectionRelationTailGqlFieldEntries from '../../../graphql/schema/collection/createCollectionRelationTailGqlFieldEntries'
import { sql } from '../../../postgres/utils'
import { PgCatalog, PgCatalogProcedure } from '../../../postgres/introspection'
import PgCollection from '../../../postgres/inventory/collection/PgCollection'
import createPgProcedureFixtures from './createPgProcedureFixtures'
import createPgProcedureSqlCall from './createPgProcedureSqlCall'
import { getEdgeGqlType, createOrderByGqlArg } from '../../../graphql/schema/connection/createConnectionGqlField'

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
  const inputFields = fixtures.args.map<[string, GraphQLInputFieldConfig]>(
    ({ name, gqlType }) =>
      [formatName.field(name), {
        // No description…
        type: pgProcedure.isStrict ? new GraphQLNonNull(getNullableType(gqlType)) : gqlType,
      }],
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
        : getTypeFieldName(fixtures.return.type),
      ), {
          // If we are returning a set, we should wrap our type in a GraphQL
          // list.
          type: pgProcedure.returnsSet
            ? new GraphQLList(fixtures.return.gqlType)
            : fixtures.return.gqlType,

          resolve: value => fixtures.return.intoGqlOutput(value),
      }],

      // An edge variant of the created value. Because we use cursor
      // based pagination, it is also helpful to get the cursor for the
      // value we just created (thus why this is in the form of an edge).
      // Also Relay 1 requires us to return the edge.
      //
      // We may deprecate this in the future if Relay 2 doesn’t need it.
      pgCollection && pgCollection.paginator && [formatName.field(`${pgCollection.type.name}-edge`), {
        description: `An edge for the type. May be used by Relay 1.`,
        type: getEdgeGqlType(buildToken, pgCollection.paginator),
        args: { orderBy: createOrderByGqlArg(buildToken, pgCollection.paginator) },
        resolve: (value, args) => ({
          paginator: pgCollection.paginator,
          ordering: args['orderBy'],
          cursor: null,
          value,
        }),
      }],

      // Add related objects if there is an associated `PgCollection`. This
      // helps in Relay 1.
      ...(pgCollection ? createCollectionRelationTailGqlFieldEntries(buildToken, pgCollection, { getCollectionValue: value => value }) : []),
    ],

    // Actually execute the procedure here.
    async execute (context, gqlInput): Promise<mixed> {
      // Turn our GraphQL input into an input tuple.
      const input = inputFields.map(([fieldName], i) => fixtures.args[i].fromGqlInput(gqlInput[fieldName]))

      // Craft our procedure call. A procedure name with arguments, like any
      // other function call. Input values must be coerced twice however.
      const procedureCall = createPgProcedureSqlCall(fixtures, input)

      const aliasIdentifier = Symbol()

      const query = sql.compile(
        // If the procedure returns a set, we must select a set of values.
        pgProcedure.returnsSet
          ? sql.query`select to_json(${sql.identifier(aliasIdentifier)}) as value from ${procedureCall} as ${sql.identifier(aliasIdentifier)}`
          : sql.query`select to_json(${procedureCall}) as value`,
      )

      const { rows } = await context.pgClient.query(query)
      const values = rows.map(({ value }) => fixtures.return.type.transformPgValueIntoValue(value))

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
function getTypeFieldName (_type: Type<mixed>): string {
  return switchType<string>(_type, {
    nullable: type => getTypeFieldName(type.nonNullType),
    list: type => pluralize(getTypeFieldName(type.itemType)),
    alias: type => type.name,
    enum: type => type.name,
    object: type => type.name,
    scalar: type => type.name,
  })
}
