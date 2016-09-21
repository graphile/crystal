import { Inventory } from '../../interface'
import { PGCatalog, PGCatalogAttribute } from '../introspection'
import PGCollection from './collection/PGCollection'
import Options from './Options'

/**
 * Adds Postgres based objects created by introspection to an inventory.
 */
export default function addPGToInventory (
  inventory: Inventory,
  pgCatalog: PGCatalog,
  config: {
    renameIdToRowId?: boolean,
  } = {},
) {
  // Turn our config full of optional options, into an options object with the
  // appropriate defaults.
  const options: Options = {
    renameIdToRowId: config.renameIdToRowId || false,
  }

  // Add all of our collections. If a class is not selectable, it is probably a
  // compound type and we shouldn’t add a collection for it to our inventory.
  for (const pgClass of pgCatalog.getClasses())
    if (pgClass.isSelectable)
      inventory.addCollection(new PGCollection(options, pgCatalog, pgClass))
}
