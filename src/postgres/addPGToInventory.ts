import { PoolConfig, Pool } from 'pg'
import { Inventory } from '../interface'
import { introspectDatabase } from './introspection'
import addPGCatalogToInventory, { PGCatalogToInventoryConfig } from './inventory/addPGCatalogToInventory'
import { createPGContextAssignment } from './inventory/pgContext'

// TODO: This does so much, test it and have it do less…
// TODO: Refactor!
export default async function addPGToInventory (
  inventory: Inventory,
  config: PoolConfig & PGCatalogToInventoryConfig & { schemas: Array<string> },
) {
  const pool = new Pool(config)
  const client = await pool.connect()
  const pgCatalog = await introspectDatabase(client, config.schemas)
  client.release()
  addPGCatalogToInventory(inventory, pgCatalog)
  inventory.addContextAssignment(createPGContextAssignment(pool))
}
