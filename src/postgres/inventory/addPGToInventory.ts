import { Inventory } from '../../interface'
import PGCatalog from '../introspection/PGCatalog'
import PGCollection from './collection/PGCollection'

/**
 * Adds Postgres based objects created by introspection to an inventory.
 */
export default function addPGToInventory (inventory: Inventory, pgCatalog: PGCatalog) {
  // Add all of our collections.
  for (const pgClass of pgCatalog.getClasses())
    inventory.addCollection(new PGCollection(pgCatalog, pgClass))
}
