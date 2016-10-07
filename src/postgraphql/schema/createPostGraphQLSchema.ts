import { Client, ClientConfig, connect } from 'pg'
import { GraphQLSchema } from 'graphql'
import { Inventory } from '../../interface'
import { introspectPGDatabase, addPGCatalogToInventory } from '../../postgres'
import { PGCatalog } from '../../postgres/introspection'
import { createGraphQLSchema } from '../../graphql'
import createPGProcedureMutationGQLFieldEntries from './procedures/hooks/createPGProcedureMutationGQLFieldEntries'
import createPGProcedureQueryGQLFieldEntries from './procedures/hooks/createPGProcedureQueryGQLFieldEntries'
import createPGProcedureObjectTypeGQLFieldEntries from './procedures/hooks/createPGProcedureObjectTypeGQLFieldEntries'

/**
 * Creates a PostGraphQL schema by looking at a Postgres client.
 */
export default async function createPostGraphQLSchema (
  clientOrConfig?: Client | ClientConfig | string,
  schemas: Array<string> = ['public'],
  options: {
    legacyIds?: boolean,
  } = {},
): Promise<GraphQLSchema> {
  // Create our inventory.
  const inventory = new Inventory()
  let pgCatalog: PGCatalog

  // Introspect our Postgres database to get a catalog. If we weren’t given a
  // client, we will just connect a default client from the `pg` module.
  // TODO: test
  if (clientOrConfig instanceof Client) {
    const client = clientOrConfig
    pgCatalog = await introspectPGDatabase(client, schemas)
  }
  else {
    const client = await connect(clientOrConfig || {})
    pgCatalog = await introspectPGDatabase(client, schemas)
    client.release()
  }

  // Add all of our Postgres constructs to that inventory.
  addPGCatalogToInventory(inventory, pgCatalog, {
    renameIdToRowId: options.legacyIds,
  })

  // Actually create our GraphQL schema.
  const gqlSchema = createGraphQLSchema(inventory, {
    nodeIdFieldName: options.legacyIds ? 'id' : '__id',
    _hooks: {
      mutationFieldEntries: _buildToken => createPGProcedureMutationGQLFieldEntries(_buildToken, pgCatalog),
      queryFieldEntries: _buildToken => createPGProcedureQueryGQLFieldEntries(_buildToken, pgCatalog),
      objectTypeFieldEntries: (objectType, _buildToken) => createPGProcedureObjectTypeGQLFieldEntries(_buildToken, objectType, pgCatalog),
    },
  })

  return gqlSchema
}
