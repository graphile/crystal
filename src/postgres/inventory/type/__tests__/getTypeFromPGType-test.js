import { ObjectType, NullableType, AliasType, EnumType, ListType } from '../../../../interface'
import PGCatalog from '../../../introspection/PGCatalog'
import getTypeFromPGType from '../getTypeFromPGType'

test('will fail if creating a type that is not in the catalog', () => {
  const typeObject = {
    kind: 'type',
    id: '0',
  }
  const catalog1 = new PGCatalog([])
  const catalog2 = new PGCatalog([typeObject])
  expect(() => getTypeFromPGType(catalog1, typeObject)).toThrow()
  expect(() => getTypeFromPGType(catalog2, typeObject)).not.toThrow()
})

test('will create an object type from a composite type', () => {
  const typeObject = {
    kind: 'type',
    id: '0',
  }
  const namespaceObject = {
    kind: 'namespace',
    id: '1',
    name: 'namespace',
  }
  const compositeTypeObject = {
    kind: 'type',
    id: '2',
    name: 'object',
    description: 'yoyoyo',
    namespaceId: '1',
    type: 'c',
    classId: '3',
  }
  const classAObject = {
    kind: 'class',
    id: '3',
    typeId: '2',
  }
  const classBObject = {
    kind: 'class',
    id: '4',
  }
  const attributeA1Object = {
    kind: 'attribute',
    name: 'attributeA1',
    description: 'Hello, world!',
    classId: '3',
    num: '1',
    typeId: '0',
    isNotNull: false,
  }
  const attributeA2Object = {
    kind: 'attribute',
    name: 'attributeA2',
    classId: '3',
    num: '2',
    typeId: '0',
    isNotNull: true,
  }
  const attributeB1Object = {
    kind: 'attribute',
    classId: '4',
  }

  const catalog = new PGCatalog([
    typeObject,
    namespaceObject,
    compositeTypeObject,
    classAObject,
    classBObject,
    attributeA1Object,
    attributeA2Object,
    attributeB1Object,
  ])

  const type = getTypeFromPGType(catalog, compositeTypeObject)
  expect(type instanceof NullableType).toBe(true)
  const nonNullType = type.nonNullType
  expect(nonNullType instanceof ObjectType).toBe(true)
  expect(nonNullType.name).toBe(compositeTypeObject.name)
  expect(nonNullType.description).toBe(compositeTypeObject.description)
  expect(nonNullType.fields.has(attributeA1Object.name)).toBe(true)
  expect(nonNullType.fields.get(attributeA1Object.name).description).toBe(attributeA1Object.description)
  expect(nonNullType.fields.get(attributeA1Object.name).type instanceof NullableType).toBe(true)
  expect(nonNullType.fields.has(attributeA2Object.name)).toBe(true)
  expect(nonNullType.fields.get(attributeA2Object.name).description).toBe(attributeA2Object.description)
  expect(nonNullType.fields.get(attributeA2Object.name).type instanceof NullableType).toBe(false)
})

test('will create an alias type from a domain type', () => {
  const baseTypeObject = {
    kind: 'type',
    id: '0',
  }
  const domainTypeObject = {
    kind: 'type',
    id: '1',
    name: Symbol('name'),
    description: Symbol('description'),
    type: 'd',
    domainBaseTypeId: '0',
  }

  const catalog = new PGCatalog([baseTypeObject, domainTypeObject])
  const baseType = getTypeFromPGType(catalog, baseTypeObject)
  const aliasType = getTypeFromPGType(catalog, domainTypeObject)
  expect(aliasType instanceof NullableType).toBe(true)
  expect(aliasType.nonNullType instanceof AliasType).toBe(true)
  expect(aliasType.nonNullType.name).toBe(domainTypeObject.name)
  expect(aliasType.nonNullType.description).toBe(domainTypeObject.description)
  expect(aliasType.nonNullType.baseType).toBe(baseType.nonNullType)
})

test('will create an alias type with a non-null domain type', () => {
  const baseTypeObject = {
    kind: 'type',
    id: '0',
  }
  const domainTypeObject = {
    kind: 'type',
    id: '1',
    name: Symbol('name'),
    description: Symbol('description'),
    type: 'd',
    domainBaseTypeId: '0',
    domainIsNotNull: true,
  }

  const catalog = new PGCatalog([baseTypeObject, domainTypeObject])
  const baseType = getTypeFromPGType(catalog, baseTypeObject)
  const aliasType = getTypeFromPGType(catalog, domainTypeObject)
  expect(baseType instanceof NullableType).toBe(true)
  expect(aliasType instanceof AliasType).toBe(true)
  expect(aliasType.name).toBe(domainTypeObject.name)
  expect(aliasType.description).toBe(domainTypeObject.description)
  expect(aliasType.baseType instanceof NullableType).toBe(false)
  expect(aliasType.baseType).toBe(baseType.nonNullType)
})

test('will create an enum type from an enum type', () => {
  const enumTypeObject = {
    kind: 'type',
    id: '1',
    name: Symbol('name'),
    description: Symbol('description'),
    type: 'e',
    enumVariants: ['a', 'b', 'c'],
  }

  const catalog = new PGCatalog([enumTypeObject])
  const type = getTypeFromPGType(catalog, enumTypeObject)
  expect(type instanceof NullableType).toBe(true)
  const enumType = type.nonNullType
  expect(enumType instanceof EnumType).toBe(true)
  expect(enumType.name).toBe(enumTypeObject.name)
  expect(enumType.description).toBe(enumTypeObject.description)
  expect(Array.from(enumType.variants)).toEqual(enumTypeObject.enumVariants)
})

test('will create list types from arrays', () => {
  const typeObject = {
    kind: 'type',
    id: '0',
  }
  const arrayTypeObject = {
    kind: 'type',
    id: '1',
    name: Symbol('name'),
    description: Symbol('description'),
    category: 'A',
    itemId: '0',
  }

  const catalog = new PGCatalog([typeObject, arrayTypeObject])
  const itemType = getTypeFromPGType(catalog, typeObject)
  const nullableType = getTypeFromPGType(catalog, arrayTypeObject)
  expect(nullableType instanceof NullableType).toBe(true)
  const type = nullableType.nonNullType
  expect(type instanceof ListType).toBe(true)
  expect(type.itemType).toBe(itemType)
})

test('will throw an error if list item type is not in catalog', () => {
  const arrayTypeObject = {
    kind: 'type',
    id: '1',
    name: Symbol('name'),
    description: Symbol('description'),
    category: 'A',
    itemId: '0',
  }
  const catalog = new PGCatalog([arrayTypeObject])
  expect(() => getTypeFromPGType(catalog, arrayTypeObject)).toThrow()
})
