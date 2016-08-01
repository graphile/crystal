import test from 'ava'
import ObjectType from '../ObjectType'
import BasicObjectType from '../BasicObjectType'

function mockField (name, isTypeOf) {
  return {
    getName: () => name,
    getType: () => ({ isTypeOf }),
  }
}

test('is instanceof ObjectType', t => {
  t.true(new BasicObjectType() instanceof ObjectType)
})

test('isTypeOf will be false for non-objects', t => {
  const objectType = new BasicObjectType()
  t.false(objectType.isTypeOf(undefined))
  t.false(objectType.isTypeOf(null))
  t.false(objectType.isTypeOf(true))
  t.false(objectType.isTypeOf(false))
  t.false(objectType.isTypeOf(42))
  t.false(objectType.isTypeOf(3.14))
  t.false(objectType.isTypeOf('hello'))
  t.false(objectType.isTypeOf(() => {}))
})

test('isTypeOf will return true for objects when there are no fields defined', t => {
  const objectType = new BasicObjectType()
  t.true(objectType.isTypeOf({}))
  t.true(objectType.isTypeOf({ a: 1, b: 2 }))
})

test('isTypeOf will check isTypeOf for all fields', t => {
  const fieldA = mockField('a', value => value === 1)
  const fieldB = mockField('b', value => value === 2)
  const fieldC = mockField('c', value => value === 3)
  const objectType = new BasicObjectType()
  objectType.addField(fieldA).addField(fieldB)
  t.true(objectType.isTypeOf({ a: 1, b: 2 }))
  t.false(objectType.isTypeOf({ a: 2, b: 2 }))
  t.false(objectType.isTypeOf({ a: 1, b: 1 }))
  t.false(objectType.isTypeOf({ a: 3, b: 3 }))
  objectType.addField(fieldC)
  t.false(objectType.isTypeOf({ a: 1, b: 2 }))
  t.true(objectType.isTypeOf({ a: 1, b: 2, c: 3 }))
})

test('isTypeOf will ignore extraneous fields on the value', t => {
  const fieldA = mockField('a', value => value === 1)
  const fieldB = mockField('b', value => value === 2)
  const objectType = new BasicObjectType()
  objectType.addField(fieldA).addField(fieldB)
  t.true(objectType.isTypeOf({ a: 1, b: 2 }))
  t.true(objectType.isTypeOf({ a: 1, b: 2, c: 3, d: 4 }))
})

test('createFromFieldValues will build an object from field entries', t => {
  const objectType = new BasicObjectType()
  t.deepEqual(objectType.createFromFieldValues([['a', 1], ['b', 2], ['c', 3]]), { a: 1, b: 2, c: 3 })
  t.deepEqual(objectType.createFromFieldValues([['a', 1], ['a', 2]]), { a: 2 })
})

test('createFromFieldValues will fail if an isTypeOf is false', t => {
  const fieldA = mockField('a', value => value === 1)
  const fieldB = mockField('b', value => value === 2)
  const objectType = new BasicObjectType()
  t.deepEqual(objectType.createFromFieldValues([['a', 1], ['b', 1]]), { a: 1, b: 1 })
  objectType.addField(fieldA).addField(fieldB)
  t.throws(() => objectType.createFromFieldValues([['a', 1], ['b', 1]]))
  t.deepEqual(objectType.createFromFieldValues([['a', 1], ['b', 2]]), { a: 1, b: 2 })
})

test('getFields will get fields added by addField', t => {
  const objectType = new BasicObjectType()
  const fields = [
    mockField('a'),
    mockField('b'),
    mockField('c'),
  ]
  t.deepEqual(objectType.getFields(), [])
  objectType.addField(fields[0]).addField(fields[1])
  t.deepEqual(objectType.getFields(), [fields[0], fields[1]])
  objectType.addField(fields[2])
  t.deepEqual(objectType.getFields(), fields)
})

test('addField will not add two fields of the same name', t => {
  const objectType = new BasicObjectType()
  objectType.addField(mockField('a'))
  t.throws(() => objectType.addField(mockField('a')))
  objectType.addField(mockField('b'))
  t.throws(() => objectType.addField(mockField('c')).addField(mockField('c')))
})
