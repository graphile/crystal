jest.mock('../../../../interface/type/ObjectType')
jest.mock('../../../introspection/PgCatalog')
jest.mock('../../transformPgValueIntoValue')
jest.mock('../getTypeFromPgType')

import { NullableType } from '../../../../interface'
import ObjectType from '../../../../interface/type/ObjectType'
import PgCatalog from '../../../introspection/PgCatalog'
import transformPgValueIntoValue, { $$transformPgValueIntoValue } from '../../transformPgValueIntoValue'
import getTypeFromPgType from '../getTypeFromPgType'
import PgObjectType from '../PgObjectType'

transformPgValueIntoValue.mockImplementation((type, value) => value)

// tslint:disable-next-line only-arrow-functions
ObjectType.mockImplementation(function (config) {
  // tslint:disable-next-line no-invalid-this
  this.fields = config.fields
})

test('it will call ObjectType with an appropriate config', () => {
  const pgCatalog = new PgCatalog()

  pgCatalog.assertGetType.mockImplementation(({ type }) => type)
  getTypeFromPgType.mockImplementation((_, type) => type)

  const pgAttribute1 = { name: Symbol(), description: Symbol(), typeId: { type: Symbol() } }
  const pgAttribute2 = { name: Symbol(), description: Symbol(), typeId: { type: new NullableType(Symbol()) } }
  const pgAttribute3 = { name: Symbol(), description: Symbol(), typeId: { type: new NullableType(Symbol()) }, isNotNull: true }

  const name = Symbol()
  const description = Symbol()

  // tslint:disable-next-line no-unused-new
  new PgObjectType({
    name,
    description,
    pgCatalog,
    pgAttributes: [pgAttribute1, pgAttribute2, pgAttribute3],
  })

  expect(pgCatalog.assertGetType.mock.calls).toEqual([[pgAttribute1.typeId], [pgAttribute2.typeId], [pgAttribute3.typeId]])
  expect(getTypeFromPgType.mock.calls).toEqual([[pgCatalog, pgAttribute1.typeId.type], [pgCatalog, pgAttribute2.typeId.type], [pgCatalog, pgAttribute3.typeId.type]])

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
      }],
    ]),
  }]])
})

test('it will allow fields with different names', () => {
  ObjectType.mockClear()

  const pgCatalog = new PgCatalog()
  const pgAttribute1 = { name: 'a' }
  const pgAttribute2 = { name: 'b' }
  const pgAttribute3 = { name: 'c' }

  // tslint:disable-next-line no-unused-new
  new PgObjectType({
    pgCatalog,
    pgAttributes: [pgAttribute1, pgAttribute2, pgAttribute3],
  })

  // tslint:disable-next-line no-unused-new
  new PgObjectType({
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

test('getPgAttributeNameFromFieldName will get the attribute name from the field name', () => {
  const pgCatalog = new PgCatalog()
  const pgAttribute1 = { name: Symbol() }
  const pgAttribute2 = { name: Symbol() }
  const pgAttribute3 = { name: Symbol() }

  const type = new PgObjectType({
    pgCatalog,
    pgAttributes: new Map([
      ['a', pgAttribute1],
      ['b', pgAttribute2],
      ['c', pgAttribute3],
    ]),
  })

  expect(type.getPgAttributeNameFromFieldName('a')).toBe(pgAttribute1.name)
  expect(type.getPgAttributeNameFromFieldName('b')).toBe(pgAttribute2.name)
  expect(type.getPgAttributeNameFromFieldName('c')).toBe(pgAttribute3.name)
})

test('getFieldNameFromPgAttributeName will get the attribute name from the field name', () => {
  const pgCatalog = new PgCatalog()
  const pgAttribute1 = { name: Symbol() }
  const pgAttribute2 = { name: Symbol() }
  const pgAttribute3 = { name: Symbol() }

  const type = new PgObjectType({
    pgCatalog,
    pgAttributes: new Map([
      ['a', pgAttribute1],
      ['b', pgAttribute2],
      ['c', pgAttribute3],
    ]),
  })

  expect(type.getFieldNameFromPgAttributeName(pgAttribute1.name)).toBe('a')
  expect(type.getFieldNameFromPgAttributeName(pgAttribute2.name)).toBe('b')
  expect(type.getFieldNameFromPgAttributeName(pgAttribute3.name)).toBe('c')
})

test('$$transformPgValueIntoValue will transform a row object into an object map', () => {
  const pgCatalog = new PgCatalog()
  const pgAttribute1 = { name: 'a' }
  const pgAttribute2 = { name: 'b' }
  const pgAttribute3 = { name: 'c' }

  const type = new PgObjectType({
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

  expect(type[$$transformPgValueIntoValue]({ a: 1, b: 2, c: 3 }))
    .toEqual(new Map([['x_a', 1], ['x_b', 2], ['x_c', 3]]))

  expect(transformPgValueIntoValue.mock.calls)
    .toEqual([[type.fields.get('x_a').type, 1], [type.fields.get('x_b').type, 2], [type.fields.get('x_c').type, 3]])
})
