import { Client } from 'pg'
import { Inventory } from '../interface'
import { introspectDatabase } from './introspection'
import addPGCatalogToInventory from './inventory/addPGCatalogToInventory'
import { createPGContextAssignment } from './inventory/pgContext'

// TODO: This does so much, test it and have it do less…
// TODO: Refactor!
export default async function addPGToInventory (
  inventory: Inventory,
  config: {
    pgClient: Client,
    schemas: Array<string>,
    renameIdToRowId?: boolean,
  },
) {
  const pgCatalog = await introspectDatabase(config.pgClient, config.schemas)
  addPGCatalogToInventory(inventory, pgCatalog)
}
