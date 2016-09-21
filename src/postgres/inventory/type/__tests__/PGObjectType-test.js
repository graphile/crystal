jest.mock('../../../../interface/type/ObjectType')
jest.mock('../../../introspection/PGCatalog')
jest.mock('../../getTypeFromPGType')

import { NullableType } from '../../../../interface'
import ObjectType from '../../../../interface/type/ObjectType'
import PGCatalog from '../../../introspection/PGCatalog'
import getTypeFromPGType from '../../getTypeFromPGType'
import PGObjectType from '../PGObjectType'

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

test('it will rename `id` fields to `row_id` when instructed', () => {
  ObjectType.mockClear()

  const pgCatalog = new PGCatalog()
  const pgAttribute = { name: 'id' }

  new PGObjectType({
    pgCatalog,
    pgAttributes: [pgAttribute],
  })

  new PGObjectType({
    pgCatalog,
    pgAttributes: [pgAttribute],
    renameIdToRowId: true,
  })

  expect(ObjectType.mock.calls).toEqual([
    [{
      fields: new Map([
        ['id', { pgAttribute }],
      ]),
    }],
    [{
      fields: new Map([
        ['row_id', { pgAttribute }],
      ]),
    }],
  ])
})
