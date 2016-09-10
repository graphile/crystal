import { ObjectType, NullableType, AliasType, EnumType, ListType } from '../../../interface'
import PGCatalog from '../../introspection/PGCatalog'
import typeFromPGType from '../typeFromPGType'

test('will fail if creating a type that is not in the catalog', () => {
  const typeObject = {
    kind: 'type',
    id: '0',
  }
  const catalog1 = new PGCatalog([])
  const catalog2 = new PGCatalog([typeObject])
  expect(() => typeFromPGType(catalog1, typeObject)).toThrow()
  expect(() => typeFromPGType(catalog2, typeObject)).not.toThrow()
})

test('will create a an object type from a composite type', () => {
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

  const type = typeFromPGType(catalog, compositeTypeObject)
  expect(type instanceof NullableType).toBe(true)
  const baseType = type.getBaseType()
  expect(baseType instanceof ObjectType).toBe(true)
  expect(baseType.getName()).toBe(compositeTypeObject.name)
  expect(baseType.getDescription()).toBe(compositeTypeObject.description)
  const [field1, field2] = baseType.getFields()
  expect(field1.getName()).toBe(attributeA1Object.name)
  expect(field1.getDescription()).toBe(attributeA1Object.description)
  expect(field1.getType() instanceof NullableType).toBe(true)
  expect(field2.getName()).toBe(attributeA2Object.name)
  expect(field2.getDescription()).toBe(attributeA2Object.description)
  expect(field2.getType() instanceof NullableType).toBe(false)
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
    baseTypeId: '0',
  }

  const catalog = new PGCatalog([baseTypeObject, domainTypeObject])
  const baseType = typeFromPGType(catalog, baseTypeObject)
  const aliasType = typeFromPGType(catalog, domainTypeObject)
  expect(baseType instanceof NullableType).toBe(true)
  expect(aliasType instanceof AliasType).toBe(true)
  expect(aliasType.getName()).toBe(domainTypeObject.name)
  expect(aliasType.getDescription()).toBe(domainTypeObject.description)
  expect(aliasType.getBaseType() instanceof NullableType).toBe(true)
  expect(aliasType.getBaseType()).toBe(baseType)
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
    baseTypeId: '0',
    isNotNull: true,
  }

  const catalog = new PGCatalog([baseTypeObject, domainTypeObject])
  const baseType = typeFromPGType(catalog, baseTypeObject)
  const aliasType = typeFromPGType(catalog, domainTypeObject)
  expect(baseType instanceof NullableType).toBe(true)
  expect(aliasType instanceof AliasType).toBe(true)
  expect(aliasType.getName()).toBe(domainTypeObject.name)
  expect(aliasType.getDescription()).toBe(domainTypeObject.description)
  expect(aliasType.getBaseType() instanceof NullableType).toBe(false)
  expect(aliasType.getBaseType()).toBe(baseType.getBaseType())
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
  const enumType = typeFromPGType(catalog, enumTypeObject)
  expect(enumType instanceof EnumType).toBe(true)
  expect(enumType.getName()).toBe(enumTypeObject.name)
  expect(enumType.getDescription()).toBe(enumTypeObject.description)
  expect(enumType.getVariants()).toEqual(enumTypeObject.enumVariants)
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
  const itemType = typeFromPGType(catalog, typeObject)
  const nullableType = typeFromPGType(catalog, arrayTypeObject)
  expect(nullableType instanceof NullableType).toBe(true)
  const type = nullableType.getBaseType()
  expect(type instanceof ListType).toBe(true)
  expect(type.getItemType()).toBe(itemType)
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
  expect(() => typeFromPGType(catalog, arrayTypeObject)).toThrow()
})
