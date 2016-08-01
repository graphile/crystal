import test from 'ava'
import { ObjectType, NullableType, AliasType, EnumType, ListType } from '../../../catalog'
import PGCatalog from '../../introspection/PGCatalog'
import typeFromPGType from '../typeFromPGType'

test('will fail if creating a type that is not in the catalog', t => {
  const typeObject = {
    kind: 'type',
    id: '0',
  }
  const catalog1 = new PGCatalog([])
  const catalog2 = new PGCatalog([typeObject])
  t.throws(() => typeFromPGType(catalog1, typeObject))
  t.notThrows(() => typeFromPGType(catalog2, typeObject))
})

test('will create a an object type from a composite type', t => {
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
  t.true(type instanceof NullableType)
  const baseType = type.getBaseType()
  t.true(baseType instanceof ObjectType)
  t.is(baseType.getName(), compositeTypeObject.name)
  t.is(baseType.getDescription(), compositeTypeObject.description)
  const [field1, field2] = baseType.getFields()
  t.is(field1.getName(), attributeA1Object.name)
  t.is(field1.getDescription(), attributeA1Object.description)
  t.true(field1.getType() instanceof NullableType)
  t.is(field2.getName(), attributeA2Object.name)
  t.is(field2.getDescription(), attributeA2Object.description)
  t.false(field2.getType() instanceof NullableType)
})

test('will create an alias type from a domain type', t => {
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
  t.true(baseType instanceof NullableType)
  t.true(aliasType instanceof AliasType)
  t.is(aliasType.getName(), domainTypeObject.name)
  t.is(aliasType.getDescription(), domainTypeObject.description)
  t.true(aliasType.getBaseType() instanceof NullableType)
  t.is(aliasType.getBaseType(), baseType)
})

test('will create an alias type with a non-null domain type', t => {
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
  t.true(baseType instanceof NullableType)
  t.true(aliasType instanceof AliasType)
  t.is(aliasType.getName(), domainTypeObject.name)
  t.is(aliasType.getDescription(), domainTypeObject.description)
  t.false(aliasType.getBaseType() instanceof NullableType)
  t.is(aliasType.getBaseType(), baseType.getBaseType())
})

test('will create an enum type from an enum type', t => {
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
  t.true(enumType instanceof EnumType)
  t.is(enumType.getName(), enumTypeObject.name)
  t.is(enumType.getDescription(), enumTypeObject.description)
  t.deepEqual(enumType.getVariants(), enumTypeObject.enumVariants)
})

test('will create list types from arrays', t => {
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
  t.true(nullableType instanceof NullableType)
  const type = nullableType.getBaseType()
  t.true(type instanceof ListType)
  t.is(type.getItemType(), itemType)
})

test('will throw an error if list item type is not in catalog', t => {
  const arrayTypeObject = {
    kind: 'type',
    id: '1',
    name: Symbol('name'),
    description: Symbol('description'),
    category: 'A',
    itemId: '0',
  }
  const catalog = new PGCatalog([arrayTypeObject])
  t.throws(() => typeFromPGType(catalog, arrayTypeObject))
})
