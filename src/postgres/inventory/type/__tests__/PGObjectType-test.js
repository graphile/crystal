jest.mock('../../../../interface/type/ObjectType')
jest.mock('../../../introspection/PGCatalog')
jest.mock('../../transformPGValueIntoValue')
jest.mock('../getTypeFromPGType')

import { NullableType } from '../../../../interface'
import ObjectType from '../../../../interface/type/ObjectType'
import PGCatalog from '../../../introspection/PGCatalog'
import transformPGValueIntoValue, { $$transformPGValueIntoValue } from '../../transformPGValueIntoValue'
import getTypeFromPGType from '../getTypeFromPGType'
import PGObjectType from '../PGObjectType'

transformPGValueIntoValue.mockImplementation((type, value) => value)

ObjectType.mockImplementation(function (config) {
  this.fields = config.fields
})

test('it will call ObjectType with an appropriate config', () => {
  const pgCatalog = new PGCatalog()

  pgCatalog.assertGetType.mockImplementation(({ type }) => type)
  getTypeFromPGType.mockImplementation((pgCatalog, type) => type)

  const pgAttribute1 = { name: Symbol(), description: Symbol(), typeId: { type: Symbol() } }
  const pgAttribute2 = { name: Symbol(), description: Symbol(), typeId: { type: new NullableType(Symbol()) } }
  const pgAttribute3 = { name: Symbol(), description: Symbol(), typeId: { type: new NullableType(Symbol()) }, isNotNull: true }

  const name = Symbol()
  const description = Symbol()

  new PGObjectType({
    name,
    description,
    pgCatalog,
    pgAttributes: [pgAttribute1, pgAttribute2, pgAttribute3],
  })

  expect(pgCatalog.assertGetType.mock.calls).toEqual([[pgAttribute1.typeId], [pgAttribute2.typeId], [pgAttribute3.typeId]])
  expect(getTypeFromPGType.mock.calls).toEqual([[pgCatalog, pgAttribute1.typeId.type], [pgCatalog, pgAttribute2.typeId.type], [pgCatalog, pgAttribute3.typeId.type]])

  expect(ObjectType.mock.calls).toEqual([[{
    name,
    description,
    fields: new Map([
      [pgAttribute1.name, {
        description: pgAttribute1.description,
        type: pgAttribute1.typeId.type,
        pgAttribute: pgAttribute1,
      }],
      [pgAttribute2.name, {
        description: pgAttribute2.description,
        type: pgAttribute2.typeId.type,
        pgAttribute: pgAttribute2,
      }],
      [pgAttribute3.name, {
        description: pgAttribute3.description,
        type: pgAttribute3.typeId.type.nonNullType,
        pgAttribute: pgAttribute3,
      }]
    ]),
  }]])
})

test('it will allow fields with different names', () => {
  ObjectType.mockClear()

  const pgCatalog = new PGCatalog()
  const pgAttribute1 = { name: 'a' }
  const pgAttribute2 = { name: 'b' }
  const pgAttribute3 = { name: 'c' }

  new PGObjectType({
    pgCatalog,
    pgAttributes: [pgAttribute1, pgAttribute2, pgAttribute3],
  })

  new PGObjectType({
    pgCatalog,
    pgAttributes: new Map([
      ['x_a', pgAttribute1],
      ['x_b', pgAttribute2],
      ['x_c', pgAttribute3],
    ]),
  })

  expect(ObjectType.mock.calls).toEqual([
    [{
      fields: new Map([
        ['a', { pgAttribute: pgAttribute1 }],
        ['b', { pgAttribute: pgAttribute2 }],
        ['c', { pgAttribute: pgAttribute3 }],
      ]),
    }],
    [{
      fields: new Map([
        ['x_a', { pgAttribute: pgAttribute1 }],
        ['x_b', { pgAttribute: pgAttribute2 }],
        ['x_c', { pgAttribute: pgAttribute3 }],
      ]),
    }],
  ])
})

test('getPGAttributeNameFromFieldName will get the attribute name from the field name', () => {
  const pgCatalog = new PGCatalog()
  const pgAttribute1 = { name: Symbol() }
  const pgAttribute2 = { name: Symbol() }
  const pgAttribute3 = { name: Symbol() }

  const type = new PGObjectType({
    pgCatalog,
    pgAttributes: new Map([
      ['a', pgAttribute1],
      ['b', pgAttribute2],
      ['c', pgAttribute3],
    ]),
  })

  expect(type.getPGAttributeNameFromFieldName('a')).toBe(pgAttribute1.name)
  expect(type.getPGAttributeNameFromFieldName('b')).toBe(pgAttribute2.name)
  expect(type.getPGAttributeNameFromFieldName('c')).toBe(pgAttribute3.name)
})

test('getFieldNameFromPGAttributeName will get the attribute name from the field name', () => {
  const pgCatalog = new PGCatalog()
  const pgAttribute1 = { name: Symbol() }
  const pgAttribute2 = { name: Symbol() }
  const pgAttribute3 = { name: Symbol() }

  const type = new PGObjectType({
    pgCatalog,
    pgAttributes: new Map([
      ['a', pgAttribute1],
      ['b', pgAttribute2],
      ['c', pgAttribute3],
    ]),
  })

  expect(type.getFieldNameFromPGAttributeName(pgAttribute1.name)).toBe('a')
  expect(type.getFieldNameFromPGAttributeName(pgAttribute2.name)).toBe('b')
  expect(type.getFieldNameFromPGAttributeName(pgAttribute3.name)).toBe('c')
})

test('$$transformPGValueIntoValue will transform a row object into an object map', () => {
  const pgCatalog = new PGCatalog()
  const pgAttribute1 = { name: 'a' }
  const pgAttribute2 = { name: 'b' }
  const pgAttribute3 = { name: 'c' }

  const type = new PGObjectType({
    pgCatalog,
    pgAttributes: new Map([
      ['x_a', pgAttribute1],
      ['x_b', pgAttribute2],
      ['x_c', pgAttribute3],
    ]),
  })

  type.fields.get('x_a').type = Symbol()
  type.fields.get('x_b').type = Symbol()
  type.fields.get('x_c').type = Symbol()

  expect(type[$$transformPGValueIntoValue]({ a: 1, b: 2, c: 3 }))
    .toEqual(new Map([['x_a', 1], ['x_b', 2], ['x_c', 3]]))

  expect(transformPGValueIntoValue.mock.calls)
    .toEqual([[type.fields.get('x_a').type, 1], [type.fields.get('x_b').type, 2], [type.fields.get('x_c').type, 3]])
})
