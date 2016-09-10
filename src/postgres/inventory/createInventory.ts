import { Inventory } from '../../interface'
import PGCatalog from '../introspection/PGCatalog'
import PGCollection from './collection/PGCollection'

/**
 * Creates an inventory from a `PGCatalog` (the result of a database
 * introspection).
 */
export default function createInventory (pgCatalog: PGCatalog): Inventory {
  const inventory = new Inventory()

  // Add all of our collections.
  for (const pgClass of pgCatalog.getClasses())
    inventory.addCollection(new PGCollection(pgCatalog, pgClass))

  return inventory
}
