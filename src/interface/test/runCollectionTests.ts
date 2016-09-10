import ObjectType from '../type/object/ObjectType'
import Collection from '../collection/Collection'
import { jasmineAsync } from './utils'

/**
 * Runs tests on a collection and its associated objects.
 */
export default function runCollectionTests <TValue>(
  collection: Collection<TValue>,
  testContext: mixed,
  testValues: Array<TValue>,
) {
  describe(collection.getName(), () => {
    describe('getName', () => {
      it('will always return the same thing', () => {
        expect(collection.getName()).toBe(collection.getName())
      })
      it('will be a string', () => {
        expect(typeof collection.getName()).toBe('string')
      })
    })
    describe('getDescription', () => {
      it('will always return the same thing', () => {
        expect(collection.getDescription()).toBe(collection.getDescription())
      })
      it('will be a string or null/undefined', () => {
        expect(typeof collection.getDescription() === 'string' || collection.getDescription() == null).toBe(true)
      })
    })

    // The rest of our tests will require test values. Stop here if we don’t
    // have any test values.
    if (testValues.length === 0)
      return

    describe('getType', () => {
      it('will always return the same thing', () => {
        expect(collection.getType()).toBe(collection.getType())
      })
      it('will be an object type', () => {
        expect(collection.getType() instanceof ObjectType).toBe(true)
      })
      it('will be a valid type for all the test values', () => {
        testValues.forEach(testValue => {
          expect(collection.getType().isTypeOf(testValue)).toBe(true)
        })
      })
      it('can break down test values object into fields and build them back up and break them down again', () => {
        testValues.forEach(testValue1 => {
          const fieldValues1 = collection.getType().getFields().map<[string, mixed]>(field => [field.getName(), field.getFieldValueFromObject(testValue1)])
          const testValue2 = collection.getType().createFromFieldValues(new Map(fieldValues1))
          const fieldValues2 = collection.getType().getFields().map<[string, mixed]>(field => [field.getName(), field.getFieldValueFromObject(testValue2)])
          // Note how we break down `testValue1` into its fields
          // (`fieldValues1`), then we do the same for `testValue2` which was
          // creatted from `fieldValues1`. We then compare the resulting field
          // values. That’s to ensure better functionality coverage and we may
          // get false negatives if comparing the equality (even deep equality)
          // of `testValue1` and `testValue2`.
          expect(fieldValues1).toEqual(fieldValues2)
        })
      })
    })

    describe('getKeys', () => {
      it('returns an array', () => {
        expect(Array.isArray(collection.getKeys())).toBe(true)
      })
    })

    if (collection.getPrimaryKey()) {
      describe('getPrimaryKey', () => {
        it('is included in getKeys', () => {
          expect(collection.getKeys().indexOf(collection.getPrimaryKey()!)).toBeGreaterThan(-1)
        })
      })
    }

    if (collection.canCreate()) {
      describe('create', () => {
        it('will create our test values', jasmineAsync(async () => {
          // Here we test that all of our test values can be inserted in order.
          // We just want to make sure the `create` passes without a problem.
          await Promise.all(testValues.map(testValue => collection.create(testContext, testValue)))
        }))
      })
    }
  })
}
