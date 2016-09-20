jest.mock('../getTypeFromPGType')
jest.mock('../../introspection/PGCatalog')

import { NullableType } from '../../../interface'
import PGCatalog from '../../introspection/PGCatalog'
import getTypeFromPGType from '../getTypeFromPGType'
import getTypeFromPGAttribute from '../getTypeFromPGAttribute'

afterEach(() => getTypeFromPGType.mockClear())

test('it will get the type from the catalog and use that', () => {
  const typeId = Symbol('typeId')
  const pgType = Symbol('pgType')
  const type = Symbol('type')

  const pgCatalog = new PGCatalog()
  pgCatalog.assertGetType.mockReturn(pgType)

  getTypeFromPGType.mockReturn(type)

  expect(getTypeFromPGAttribute(pgCatalog, { typeId })).toBe(type)

  expect(pgCatalog.assertGetType.mock.calls).toEqual([[typeId]])
  expect(getTypeFromPGType.mock.calls).toEqual([[pgCatalog, pgType]])
})

test('it will get the non nullable version when the attribute is not null', () => {
  const typeId = Symbol('typeId')
  const pgType = Symbol('pgType')
  const type = Symbol('type')
  const nullableType = new NullableType(type)

  const pgCatalog = new PGCatalog()
  pgCatalog.assertGetType.mockReturn(pgType)

  getTypeFromPGType.mockReturn(nullableType)

  expect(getTypeFromPGAttribute(pgCatalog, { typeId })).toBe(nullableType)
  expect(getTypeFromPGAttribute(pgCatalog, { typeId, isNotNull: true })).toBe(type)

  expect(pgCatalog.assertGetType.mock.calls).toEqual([[typeId], [typeId]])
  expect(getTypeFromPGType.mock.calls).toEqual([[pgCatalog, pgType], [pgCatalog, pgType]])
})
