import { Inventory } from '../../interface'
import { PGCatalog, PGCatalogAttribute } from '../introspection'
import PGCollection from './collection/PGCollection'
import PGRelation from './collection/PGRelation'
import Options from './Options'

/**
 * Adds Postgres based objects created by introspection to an inventory.
 */
export default function addPGCatalogToInventory (
  inventory: Inventory,
  pgCatalog: PGCatalog,
  config: { renameIdToRowId?: boolean } = {},
): void {
  // Turn our config full of optional options, into an options object with the
  // appropriate defaults.
  const options: Options = {
    renameIdToRowId: config.renameIdToRowId || false,
  }

  // We save a reference to all our collections by their class’s id so that we
  // can reference them again later.
  const collectionByClassId = new Map<string, PGCollection>()

  // Add all of our collections. If a class is not selectable, it is probably a
  // compound type and we shouldn’t add a collection for it to our inventory.
  for (const pgClass of pgCatalog.getClasses()) {
    if (pgClass.isSelectable) {
      const collection = new PGCollection(options, pgCatalog, pgClass)
      inventory.addCollection(collection)
      collectionByClassId.set(pgClass.id, collection)
    }
  }

  // Add all of the relations that exist in our database to the inventory. We
  // discover relations by looking at foreign key constraints in Postgres.
  for (const pgConstraint of pgCatalog.getConstraints()) {
    if (pgConstraint.type === 'f') {
      // TODO: This implementation of relation could be better…
      inventory.addRelation(new PGRelation(
        collectionByClassId.get(pgConstraint.classId)!,

        // Here we get the collection key for our foreign table that has the
        // same key attribute numbers we are looking for.
        collectionByClassId.get(pgConstraint.foreignClassId)!.keys
          .find(key => {
            const numsA = pgConstraint.foreignKeyAttributeNums
            const numsB = key._pgConstraint.keyAttributeNums

            // Make sure that the length of `numsA` and `numsB` are the same.
            if (numsA.length !== numsB.length) return false

            // Make sure all of the items in `numsA` are also in `numsB` (order
            // does not matter).
            return numsA.reduce((last, num) => last && numsB.indexOf(num) !== -1, true)
          })!,

        pgConstraint,
      ))
    }
  }
}
