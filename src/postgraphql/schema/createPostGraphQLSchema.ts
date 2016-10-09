import { Client, ClientConfig, connect as connectPgClient } from 'pg'
import { GraphQLSchema } from 'graphql'
import { Inventory } from '../../interface'
import { introspectPGDatabase, addPGCatalogToInventory } from '../../postgres'
import { PGCatalog, PGCatalogClass, PGCatalogProcedure } from '../../postgres/introspection'
import PGClassObjectType from '../../postgres/inventory/type/PGClassObjectType'
import { createGraphQLSchema } from '../../graphql'
import createPGProcedureMutationGQLFieldEntry from './procedures/createPGProcedureMutationGQLFieldEntry'
import createPGProcedureQueryGQLFieldEntry from './procedures/createPGProcedureQueryGQLFieldEntry'
import createPGProcedureObjectTypeGQLFieldEntry from './procedures/createPGProcedureObjectTypeGQLFieldEntry'
import getPGProcedureComputedClass from './procedures/getPGProcedureComputedClass'

/**
 * Creates a PostGraphQL schema by looking at a Postgres client.
 */
export default async function createPostGraphQLSchema (
  clientOrConfig?: Client | ClientConfig | string,
  schemas: Array<string> = ['public'],
  options: {
    classicIds?: boolean,
    dynamicJson?: boolean,
  } = {},
): Promise<GraphQLSchema> {
  // Create our inventory.
  const inventory = new Inventory()
  let pgCatalog: PGCatalog

  // Introspect our Postgres database to get a catalog. If we weren’t given a
  // client, we will just connect a default client from the `pg` module.
  // TODO: test
  if (clientOrConfig instanceof Client) {
    const pgClient = clientOrConfig
    pgCatalog = await introspectPGDatabase(pgClient, schemas)
  }
  else {
    const pgClient = await connectPgClient(clientOrConfig || {})
    pgCatalog = await introspectPGDatabase(pgClient, schemas)
    pgClient.release()
  }

  // Add all of our Postgres constructs to that inventory.
  addPGCatalogToInventory(inventory, pgCatalog, {
    renameIdToRowId: options.classicIds,
  })

  // TODO: Move all procedure and procedure hook code somewhere else…

  // Create “sinks,” or places that our Postgres procedures will go. Each
  // “sink” represents a different location in our GraphQL schema where the
  // procedure may be exposed.
  const pgMutationProcedures: Array<PGCatalogProcedure> = []
  const pgQueryProcedures: Array<PGCatalogProcedure> = []
  const pgObjectTypeProcedures: Map<PGCatalogClass, Array<PGCatalogProcedure>> = new Map()

  // For all of the procedures in our catalog, find a place to put each one.
  for (const pgProcedure of pgCatalog.getProcedures()) {
    // If this procedure is unstable, it is a mutation. Add it to that list.
    if (!pgProcedure.isStable)
      pgMutationProcedures.push(pgProcedure)
    else {
      // Detect if this procedure is a computed procedure.
      const pgComputedClass = getPGProcedureComputedClass(pgCatalog, pgProcedure)

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
    _hooks: {
      mutationFieldEntries: _buildToken => pgMutationProcedures.map(pgProcedure => createPGProcedureMutationGQLFieldEntry(_buildToken, pgCatalog, pgProcedure)),
      queryFieldEntries: _buildToken => pgQueryProcedures.map(pgProcedure => createPGProcedureQueryGQLFieldEntry(_buildToken, pgCatalog, pgProcedure)),
      objectTypeFieldEntries: (objectType, _buildToken) =>
        objectType instanceof PGClassObjectType
          ? (pgObjectTypeProcedures.get(objectType.pgClass) || []).map(pgProcedure => createPGProcedureObjectTypeGQLFieldEntry(_buildToken, pgCatalog, pgProcedure))
          : [],
    },
  })

  return gqlSchema
}
