import { Inventory } from '../../interface'
import PGCatalog from '../introspection/PGCatalog'
import PGCollection from './collection/PGCollection'

/**
 * Adds Postgres based objects created by introspection to an inventory.
 */
export default function addPGToInventory (inventory: Inventory, pgCatalog: PGCatalog) {
  // Add all of our collections. If a class is not selectable, it is probably a
  // compound type and we shouldn’t add a collection for it to our inventory.
  for (const pgClass of pgCatalog.getClasses())
    if (pgClass.isSelectable)
      inventory.addCollection(new PGCollection(pgCatalog, pgClass))
}
