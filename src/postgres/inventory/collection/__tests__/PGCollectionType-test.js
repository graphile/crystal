jest.mock('../../typeFromPGType')

import { NullableType } from '../../../../interface'
import PGCatalog from '../../../introspection/PGCatalog'
import typeFromPGType from '../../typeFromPGType'
import PGCollectionType from '../PGCollectionType'

test('getName will use the class’s name', () => {
  const name = Symbol('name')
  expect(new PGCollectionType(new PGCatalog([]), { name }).getName()).toBe(name)
})

test('fromRow will turn an object into a value that can’t pass another types isTypeOf', () => {
  const type1 = new PGCollectionType(new PGCatalog([]), {})
  const type2 = new PGCollectionType(new PGCatalog([]), {})
  expect(type1.isTypeOf(type1.fromRow(Symbol('row')))).toBe(true)
  expect(type2.isTypeOf(type2.fromRow(Symbol('row')))).toBe(true)
  expect(type1.isTypeOf(type2.fromRow(Symbol('row')))).toBe(false)
  expect(type2.isTypeOf(type1.fromRow(Symbol('row')))).toBe(false)
})

test('toRow will turn an object created by fromRow back into a row', () => {
  const row = Symbol('row')
  const type = new PGCollectionType(new PGCatalog([]), {})
  expect(type.toRow(type.fromRow(row))).toBe(row)
})

test('getFields will return return fields with the correct name', () => {
  const attribute = { name: Symbol('name') }
  const catalog = new PGCatalog([])
  catalog.getClassAttributes = jest.fn(() => [attribute])
  catalog.assertGetType = jest.fn(typeId => typeId)
  const type = new PGCollectionType(catalog, {})
  expect(type.getFields().length).toBe(1)
  expect(type.getFields()[0].getName()).toBe(attribute.name)
})

test('getFields will return fields in the correct order', () => {
  const attribute1 = { num: 1, name: 'a' }
  const attribute2 = { num: 2, name: 'b' }
  const attribute3 = { num: 3, name: 'c' }
  const catalog = new PGCatalog([])
  catalog.getClassAttributes = jest.fn(() => [attribute2, attribute3, attribute1])
  catalog.assertGetType = jest.fn(typeId => typeId)
  const type = new PGCollectionType(catalog, {})
  expect(type.getFields().map(field => field.getName())).toEqual([attribute1.name, attribute2.name, attribute3.name])
})

test('getFields will return with the correct description', () => {
  const attribute1 = { name: 'a', description: Symbol('description') }
  const attribute2 = { name: 'b' }
  const attribute3 = { name: 'c', description: 'Hello, world!' }
  const catalog = new PGCatalog([])
  catalog.getClassAttributes = jest.fn(() => [attribute1, attribute2, attribute3])
  catalog.assertGetType = jest.fn(typeId => typeId)
  const type = new PGCollectionType(catalog, {})
  expect(type.getFields().map(field => field.getDescription())).toEqual([attribute1.description, attribute2.description, attribute3.description])
})

test('getFields will use the right type', () => {
  const attribute1 = { name: 'a', typeId: new NullableType(Symbol('type')) }
  const attribute2 = { name: 'b', typeId: new NullableType(Symbol('type')), isNotNull: true }
  const attribute3 = { name: 'c', typeId: Symbol('type') }
  const catalog = new PGCatalog([])
  catalog.getClassAttributes = jest.fn(() => [attribute1, attribute2, attribute3])
  catalog.assertGetType = jest.fn(typeId => typeId)
  typeFromPGType.mockClear()
  typeFromPGType.mockImplementation((catalog, typeId) => typeId)
  const type = new PGCollectionType(catalog, {})
  expect(type.getFields()[0].getType()).toBe(attribute1.typeId)
  expect(type.getFields()[1].getType()).toBe(attribute2.typeId.getBaseType())
  expect(type.getFields()[2].getType()).toBe(attribute3.typeId)
  expect(catalog.assertGetType.mock.calls).toEqual([[attribute1.typeId], [attribute2.typeId], [attribute3.typeId]])
  expect(typeFromPGType.mock.calls).toEqual([[catalog, attribute1.typeId], [catalog, attribute2.typeId], [catalog, attribute3.typeId]])
})

test('createFromFieldValues will fail to construct an object with extra properties', () => {
  expect(() => new PGCollectionType(new PGCatalog([]), {}).createFromFieldValues(new Map([]))).not.toThrow()
  expect(() => new PGCollectionType(new PGCatalog([]), {}).createFromFieldValues(new Map([['a', 1], ['b', 2]]))).toThrow()
})

test('createFromFieldValues will correctly use fields to construct an object', () => {
  const isTypeOf1 = jest.fn(value => value === 1)
  const isTypeOf2 = jest.fn(value => value === 2)

  const type = new PGCollectionType(new PGCatalog([]), {})

  type._fields = new Map([
    ['a', {
      getName: () => 'a',
      getType: () => ({ isTypeOf: isTypeOf1 }),
      getPGAttribute: () => ({ name: 'a' }),
    }],
    ['b', {
      getName: () => 'b',
      getType: () => ({ isTypeOf: isTypeOf2 }),
      getPGAttribute: () => ({ name: 'b' }),
    }],
  ])

  expect(() => type.createFromFieldValues(new Map([]))).toThrow()
  expect(() => type.createFromFieldValues(new Map([['a', 1]]))).toThrow()
  expect(() => type.createFromFieldValues(new Map([['a', 1], ['b', 2]]))).not.toThrow()
  expect(() => type.createFromFieldValues(new Map([['a', 2], ['b', 1]]))).toThrow()
  expect(() => type.createFromFieldValues(new Map([['a', 1], ['b', 2], ['c', 3]]))).toThrow()
})
