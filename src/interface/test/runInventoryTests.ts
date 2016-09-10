import Inventory from '../Inventory'
import runCollectionTests from './runCollectionTests'

/**
 * Actually runs the tests for an inventory object. Make sure this runs in a
 * Jasmine environment!
 */
export default function runInventoryTests (
  inventory: Inventory,
  config: {
    collections: {
      testContext: mixed,
      testValues: Map<string, Array<mixed>>,
    },
  },
) {
  describe('inventory', () => {
    describe('collections', () => {
      inventory.getCollections().forEach(collection => {
        runCollectionTests(
          collection,
          config.collections.testContext,
          config.collections.testValues.get(collection.getName()) || [],
        )
      })
    })
  })
}
