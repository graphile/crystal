"use strict";
const interface_1 = require('../../../../interface');
const PgCatalog_1 = require('../../../introspection/PgCatalog');
const getTypeFromPgType_1 = require('../getTypeFromPgType');
test('will fail if creating a type that is not in the catalog', () => {
    const typeObject = {
        kind: 'type',
        id: '0',
    };
    const catalog1 = new PgCatalog_1.default([]);
    const catalog2 = new PgCatalog_1.default([typeObject]);
    expect(() => getTypeFromPgType_1.default(catalog1, typeObject)).toThrow();
    expect(() => getTypeFromPgType_1.default(catalog2, typeObject)).not.toThrow();
});
test('will create an object type from a composite type', () => {
    const typeObject = {
        kind: 'type',
        id: '0',
    };
    const namespaceObject = {
        kind: 'namespace',
        id: '1',
        name: 'namespace',
    };
    const compositeTypeObject = {
        kind: 'type',
        id: '2',
        name: 'object',
        description: 'yoyoyo',
        namespaceId: '1',
        type: 'c',
        classId: '3',
    };
    const classAObject = {
        kind: 'class',
        id: '3',
        typeId: '2',
    };
    const classBObject = {
        kind: 'class',
        id: '4',
    };
    const attributeA1Object = {
        kind: 'attribute',
        name: 'attributeA1',
        description: 'Hello, world!',
        classId: '3',
        num: '1',
        typeId: '0',
        isNotNull: false,
    };
    const attributeA2Object = {
        kind: 'attribute',
        name: 'attributeA2',
        classId: '3',
        num: '2',
        typeId: '0',
        isNotNull: true,
    };
    const attributeB1Object = {
        kind: 'attribute',
        classId: '4',
    };
    const catalog = new PgCatalog_1.default([
        typeObject,
        namespaceObject,
        compositeTypeObject,
        classAObject,
        classBObject,
        attributeA1Object,
        attributeA2Object,
        attributeB1Object,
    ]);
    const type = getTypeFromPgType_1.default(catalog, compositeTypeObject);
    expect(type instanceof interface_1.NullableType).toBe(true);
    const nonNullType = type.nonNullType;
    expect(nonNullType instanceof interface_1.ObjectType).toBe(true);
    expect(nonNullType.name).toBe(compositeTypeObject.name);
    expect(nonNullType.description).toBe(compositeTypeObject.description);
    expect(nonNullType.fields.has(attributeA1Object.name)).toBe(true);
    expect(nonNullType.fields.get(attributeA1Object.name).description).toBe(attributeA1Object.description);
    expect(nonNullType.fields.get(attributeA1Object.name).type instanceof interface_1.NullableType).toBe(true);
    expect(nonNullType.fields.has(attributeA2Object.name)).toBe(true);
    expect(nonNullType.fields.get(attributeA2Object.name).description).toBe(attributeA2Object.description);
    expect(nonNullType.fields.get(attributeA2Object.name).type instanceof interface_1.NullableType).toBe(false);
});
test('will create an alias type from a domain type', () => {
    const baseTypeObject = {
        kind: 'type',
        id: '0',
    };
    const domainTypeObject = {
        kind: 'type',
        id: '1',
        name: Symbol('name'),
        description: Symbol('description'),
        type: 'd',
        domainBaseTypeId: '0',
    };
    const catalog = new PgCatalog_1.default([baseTypeObject, domainTypeObject]);
    const baseType = getTypeFromPgType_1.default(catalog, baseTypeObject);
    const aliasType = getTypeFromPgType_1.default(catalog, domainTypeObject);
    expect(aliasType instanceof interface_1.NullableType).toBe(true);
    expect(aliasType.nonNullType instanceof interface_1.AliasType).toBe(true);
    expect(aliasType.nonNullType.name).toBe(domainTypeObject.name);
    expect(aliasType.nonNullType.description).toBe(domainTypeObject.description);
    expect(aliasType.nonNullType.baseType).toBe(baseType.nonNullType);
});
test('will create an alias type with a non-null domain type', () => {
    const baseTypeObject = {
        kind: 'type',
        id: '0',
    };
    const domainTypeObject = {
        kind: 'type',
        id: '1',
        name: Symbol('name'),
        description: Symbol('description'),
        type: 'd',
        domainBaseTypeId: '0',
        domainIsNotNull: true,
    };
    const catalog = new PgCatalog_1.default([baseTypeObject, domainTypeObject]);
    const baseType = getTypeFromPgType_1.default(catalog, baseTypeObject);
    const aliasType = getTypeFromPgType_1.default(catalog, domainTypeObject);
    expect(baseType instanceof interface_1.NullableType).toBe(true);
    expect(aliasType instanceof interface_1.AliasType).toBe(true);
    expect(aliasType.name).toBe(domainTypeObject.name);
    expect(aliasType.description).toBe(domainTypeObject.description);
    expect(aliasType.baseType instanceof interface_1.NullableType).toBe(false);
    expect(aliasType.baseType).toBe(baseType.nonNullType);
});
test('will create an enum type from an enum type', () => {
    const enumTypeObject = {
        kind: 'type',
        id: '1',
        name: Symbol('name'),
        description: Symbol('description'),
        type: 'e',
        enumVariants: ['a', 'b', 'c'],
    };
    const catalog = new PgCatalog_1.default([enumTypeObject]);
    const type = getTypeFromPgType_1.default(catalog, enumTypeObject);
    expect(type instanceof interface_1.NullableType).toBe(true);
    const enumType = type.nonNullType;
    expect(enumType instanceof interface_1.EnumType).toBe(true);
    expect(enumType.name).toBe(enumTypeObject.name);
    expect(enumType.description).toBe(enumTypeObject.description);
    expect(Array.from(enumType.variants)).toEqual(enumTypeObject.enumVariants);
});
test('will create list types from arrays', () => {
    const typeObject = {
        kind: 'type',
        id: '0',
    };
    const arrayTypeObject = {
        kind: 'type',
        id: '1',
        name: Symbol('name'),
        description: Symbol('description'),
        category: 'A',
        arrayItemTypeId: '0',
    };
    const catalog = new PgCatalog_1.default([typeObject, arrayTypeObject]);
    const itemType = getTypeFromPgType_1.default(catalog, typeObject);
    const nullableType = getTypeFromPgType_1.default(catalog, arrayTypeObject);
    expect(nullableType instanceof interface_1.NullableType).toBe(true);
    const type = nullableType.nonNullType;
    expect(type instanceof interface_1.ListType).toBe(true);
    expect(type.itemType).toBe(itemType);
});
test('will throw an error if list item type is not in catalog', () => {
    const arrayTypeObject = {
        kind: 'type',
        id: '1',
        name: Symbol('name'),
        description: Symbol('description'),
        category: 'A',
        arrayItemTypeId: '0',
    };
    const catalog = new PgCatalog_1.default([arrayTypeObject]);
    expect(() => getTypeFromPgType_1.default(catalog, arrayTypeObject)).toThrow();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0VHlwZUZyb21QZ1R5cGUtdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvdHlwZS9fX3Rlc3RzX18vZ2V0VHlwZUZyb21QZ1R5cGUtdGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNEJBQXdFLHVCQUN4RSxDQUFDLENBRDhGO0FBQy9GLDRCQUFzQixrQ0FDdEIsQ0FBQyxDQUR1RDtBQUN4RCxvQ0FBOEIsc0JBRTlCLENBQUMsQ0FGbUQ7QUFFcEQsSUFBSSxDQUFDLHlEQUF5RCxFQUFFO0lBQzlELE1BQU0sVUFBVSxHQUFHO1FBQ2pCLElBQUksRUFBRSxNQUFNO1FBQ1osRUFBRSxFQUFFLEdBQUc7S0FDUixDQUFBO0lBQ0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQkFBUyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ2xDLE1BQU0sUUFBUSxHQUFHLElBQUksbUJBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7SUFDNUMsTUFBTSxDQUFDLE1BQU0sMkJBQWlCLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDL0QsTUFBTSxDQUFDLE1BQU0sMkJBQWlCLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3JFLENBQUMsQ0FBQyxDQUFBO0FBRUYsSUFBSSxDQUFDLGtEQUFrRCxFQUFFO0lBQ3ZELE1BQU0sVUFBVSxHQUFHO1FBQ2pCLElBQUksRUFBRSxNQUFNO1FBQ1osRUFBRSxFQUFFLEdBQUc7S0FDUixDQUFBO0lBQ0QsTUFBTSxlQUFlLEdBQUc7UUFDdEIsSUFBSSxFQUFFLFdBQVc7UUFDakIsRUFBRSxFQUFFLEdBQUc7UUFDUCxJQUFJLEVBQUUsV0FBVztLQUNsQixDQUFBO0lBQ0QsTUFBTSxtQkFBbUIsR0FBRztRQUMxQixJQUFJLEVB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