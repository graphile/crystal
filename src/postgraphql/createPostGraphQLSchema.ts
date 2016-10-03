import { Client, connect } from 'pg'
import { GraphQLSchema } from 'graphql'
import { Inventory } from '../interface'
import { introspectPGDatabase, addPGCatalogToInventory } from '../postgres'
import { createGraphQLSchema } from '../graphql'

export default async function createPostGraphQLSchema (
  config: {
    // TODO: Accept connection strings, configs, clients, and `PGCatalog`s.
    pgClient: Client,
    pgSchemas?: Array<string>,
    relay1Ids?: boolean,
  },
): Promise<GraphQLSchema> {
  // Create our inventory.
  const inventory = new Inventory()

  // Introspect our Postgres database to get a catalog.
  const pgCatalog = await introspectPGDatabase(
    config.pgClient,
    config.pgSchemas || ['public'],
  )

  // Add all of our Postgres constructs to that inventory.
  addPGCatalogToInventory(inventory, pgCatalog, {
    renameIdToRowId: config.relay1Ids,
  })

  // Actually create our GraphQL schema.
  const gqlSchema = createGraphQLSchema(inventory, {
    nodeIdFieldName: config.relay1Ids ? 'id' : '__id',
  })

  return gqlSchema
}
