import { Client, ClientConfig, connect as connectPgClient } from 'pg'
import { GraphQLSchema, GraphQLInputType, GraphQLOutputType } from 'graphql'
import { Inventory, Type } from '../../interface'
import { introspectPgDatabase, addPgCatalogToInventory } from '../../postgres'
import { PgCatalog, PgCatalogClass, PgCatalogProcedure } from '../../postgres/introspection'
import getTypeFromPgType from '../../postgres/inventory/type/getTypeFromPgType'
import PgClassObjectType from '../../postgres/inventory/type/PgClassObjectType'
import { createGraphQLSchema } from '../../graphql'
import createPgProcedureMutationGqlFieldEntry from './procedures/createPgProcedureMutationGqlFieldEntry'
import createPgProcedureQueryGqlFieldEntry from './procedures/createPgProcedureQueryGqlFieldEntry'
import createPgProcedureObjectTypeGqlFieldEntry from './procedures/createPgProcedureObjectTypeGqlFieldEntry'
import getPgProcedureComputedClass from './procedures/getPgProcedureComputedClass'
import getPgTokenTypeFromIdentifier from './auth/getPgTokenTypeFromIdentifier'
import getJwtGqlType from './auth/getJwtGqlType'

/**
 * Creates a PostGraphQL schema by looking at a Postgres client.
 */
export default async function createPostGraphQLSchema (
  clientOrConfig?: Client | ClientConfig | string,
  schema: string | Array<string> = 'public',
  options: {
    classicIds?: boolean,
    dynamicJson?: boolean,
    jwtSecret?: string,
    jwtPgTypeIdentifier?: string,
    disableDefaultMutations?: boolean,
  } = {},
): Promise<GraphQLSchema> {
  // If our argument was not an array, make it one.
  const schemas = Array.isArray(schema) ? schema : [schema]

  // Create our inventory.
  const inventory = new Inventory()
  let pgCatalog: PgCatalog

  // Introspect our Postgres database to get a catalog. If we weren’t given a
  // client, we will just connect a default client from the `pg` module.
  // TODO: test
  if (clientOrConfig instanceof Client) {
    const pgClient = clientOrConfig
    pgCatalog = await introspectPgDatabase(pgClient, schemas)
  }
  else {
    const pgClient = await connectPgClient(clientOrConfig || {})
    pgCatalog = await introspectPgDatabase(pgClient, schemas)
    pgClient.end()
  }

  // Gets the Postgres token type from our provided identifier. Just null if
  // we don’t have a token type identifier.
  const jwtPgType = options.jwtPgTypeIdentifier
    ? getPgTokenTypeFromIdentifier(pgCatalog, options.jwtPgTypeIdentifier)
    : undefined

  // If a token type is defined, but the JWT secret is not. Throw an error.
  if (jwtPgType && !options.jwtSecret)
    throw new Error('Postgres token type is defined, but a JWT secret is not defined. Please provide a JWT secret.')

  // Add all of our Postgres constructs to that inventory.
  addPgCatalogToInventory(inventory, pgCatalog, {
    renameIdToRowId: options.classicIds,
  })

  // TODO: Move all procedure and procedure hook code somewhere else…

  // Create “sinks,” or places that our Postgres procedures will go. Each
  // “sink” represents a different location in our GraphQL schema where the
  // procedure may be exposed.
  const pgMutationProcedures: Array<PgCatalogProcedure> = []
  const pgQueryProcedures: Array<PgCatalogProcedure> = []
  const pgObjectTypeProcedures: Map<PgCatalogClass, Array<PgCatalogProcedure>> = new Map()

  // For all of the procedures in our catalog, find a place to put each one.
  for (const pgProcedure of pgCatalog.getProcedures()) {
    // If this procedure is unstable, it is a mutation. Add it to that list.
    if (!pgProcedure.isStable)
      pgMutationProcedures.push(pgProcedure)
    else {
      // Detect if this procedure is a computed procedure.
      const pgComputedClass = getPgProcedureComputedClass(pgCatalog, pgProcedure)

      // If it is not a computed procedure, add it to the normal query
      // procedure list.
      if (!pgComputedClass)
        pgQueryProcedures.push(pgProcedure)
      // If this does have a class for which it is a computed procedure, add it
      // to that class’s procedure array.
      else {
        // If this class does not yet have an array of procedures, create one.
        if (!pgObjectTypeProcedures.has(pgComputedClass))
          pgObjectTypeProcedures.set(pgComputedClass, [])

        // Actually add the procedure.
        pgObjectTypeProcedures.get(pgComputedClass)!.push(pgProcedure)
      }
    }
  }

  // Actually create our GraphQL schema.
  const gqlSchema = createGraphQLSchema(inventory, {
    nodeIdFieldName: options.classicIds ? 'id' : '__id',
    dynamicJson: options.dynamicJson,
    disableDefaultMutations: options.disableDefaultMutations,

    // If we have a JWT Postgres type, let us override the GraphQL output type
    // with our own.
    _typeOverrides: jwtPgType && new Map<Type<mixed>, { input?: GraphQLInputType<mixed>, output?: GraphQLOutputType<mixed> }>([
      [getTypeFromPgType(pgCatalog, jwtPgType), {
        // Throw an error if the user tries to use this as input.
        get input (): never { throw new Error(`Using the JWT Token type '${options.jwtPgTypeIdentifier}' as input is not yet implemented.`) },
        // Use our JWT GraphQL type as the output.
        output: getJwtGqlType(getTypeFromPgType(pgCatalog, jwtPgType), options.jwtSecret!),
      }],
    ]),

    _hooks: {
      // Extra field entries to go on the mutation type.
      mutationFieldEntries: _buildToken =>
        pgMutationProcedures.map(pgProcedure => createPgProcedureMutationGqlFieldEntry(_buildToken, pgCatalog, pgProcedure)),

      // Extra field entries to go on the query type.
      queryFieldEntries: _buildToken =>
        pgQueryProcedures.map(pgProcedure => createPgProcedureQueryGqlFieldEntry(_buildToken, pgCatalog, pgProcedure)),

      // Extra field entires to go on object types that also happen to be
      // classes.
      objectTypeFieldEntries: (objectType, _buildToken) =>
        objectType instanceof PgClassObjectType
          ? (pgObjectTypeProcedures.get(objectType.pgClass) || []).map(pgProcedure => createPgProcedureObjectTypeGqlFieldEntry(_buildToken, pgCatalog, pgProcedure))
          : [],
    },
  })

  return gqlSchema
}
