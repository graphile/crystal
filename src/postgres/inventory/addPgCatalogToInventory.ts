import { Inventory } from '../../interface'
import { PgCatalog } from '../introspection'
import PgCollection from './collection/PgCollection'
import PgRelation from './collection/PgRelation'
import Options from './Options'

/**
 * Adds Postgres based objects created by introspection to an inventory.
 */
export default function addPgCatalogToInventory (
  inventory: Inventory,
  pgCatalog: PgCatalog,
  config: { renameIdToRowId?: boolean } = {},
): void {
  // Turn our config full of optional options, into an options object with the
  // appropriate defaults.
  const options: Options = {
    renameIdToRowId: config.renameIdToRowId || false,
  }

  // We save a reference to all our collections by their class’s id so that we
  // can reference them again later.
  const collectionByClassId = new Map<string, PgCollection>()

  // Add all of our collections. If a class is not selectable, it is probably a
  // compound type and we shouldn’t add a collection for it to our inventory.
  //
  // We also won’t add collection classes if they exist outside a namespace we
  // support.
  for (const pgClass of pgCatalog.getClasses()) {
    if (pgClass.isSelectable && pgCatalog.getNamespace(pgClass.namespaceId)) {
      const collection = new PgCollection(options, pgCatalog, pgClass)
      inventory.addCollection(collection)
      collectionByClassId.set(pgClass.id, collection)
    }
  }

  // Add all of the relations that exist in our database to the inventory. We
  // discover relations by looking at foreign key constraints in Postgres.
  // TODO: This implementation of relations could be better…
  for (const pgConstraint of pgCatalog.getConstraints()) {
    if (pgConstraint.type === 'f') {
      const tailCollection = collectionByClassId.get(pgConstraint.classId)!

      // Here we get the collection key for our foreign table that has the
      // same key attribute numbers we are looking for.
      const headCollectionKey =
        collectionByClassId.get(pgConstraint.foreignClassId)!.keys
          .find(key => {
            const numsA = pgConstraint.foreignKeyAttributeNums
            const numsB = key.pgConstraint.keyAttributeNums

            // Make sure that the length of `numsA` and `numsB` are the same.
            if (numsA.length !== numsB.length) return false

            // Make sure all of the items in `numsA` are also in `numsB` (order
            // does not matter).
            return numsA.reduce((last, num) => last && numsB.indexOf(num) !== -1, true)
          })

      // If no collection key could be found, we need to throw an error.
      if (!headCollectionKey) {
        throw new Error(
          'No primary key or unique constraint found for the column(s) ' +
          `${pgCatalog.getClassAttributes(pgConstraint.foreignClassId, pgConstraint.foreignKeyAttributeNums).map(({ name }) => `'${name}'`).join(', ')} ` +
          'of table ' +
          `'${pgCatalog.assertGetClass(pgConstraint.foreignClassId).name}'. ` +
          'Cannot create a relation without such a constraint. Without this ' +
          'constraint referenced values are not ensured to be unique and ' +
          'lookups may not be performant.'
        )
      }

      inventory.addRelation(new PgRelation(tailCollection, headCollectionKey, pgConstraint))
    }
  }
}
