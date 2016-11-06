"use strict";
jest.mock('../../../../interface/type/ObjectType');
jest.mock('../../../introspection/PgCatalog');
jest.mock('../../transformPgValueIntoValue');
jest.mock('../getTypeFromPgType');
const interface_1 = require('../../../../interface');
const ObjectType_1 = require('../../../../interface/type/ObjectType');
const PgCatalog_1 = require('../../../introspection/PgCatalog');
const transformPgValueIntoValue_1 = require('../../transformPgValueIntoValue');
const getTypeFromPgType_1 = require('../getTypeFromPgType');
const PgObjectType_1 = require('../PgObjectType');
transformPgValueIntoValue_1.default.mockImplementation((type, value) => value);
ObjectType_1.default.mockImplementation(function (config) {
    this.fields = config.fields;
});
test('it will call ObjectType with an appropriate config', () => {
    const pgCatalog = new PgCatalog_1.default();
    pgCatalog.assertGetType.mockImplementation(({ type }) => type);
    getTypeFromPgType_1.default.mockImplementation((pgCatalog, type) => type);
    const pgAttribute1 = { name: Symbol(), description: Symbol(), typeId: { type: Symbol() } };
    const pgAttribute2 = { name: Symbol(), description: Symbol(), typeId: { type: new interface_1.NullableType(Symbol()) } };
    const pgAttribute3 = { name: Symbol(), description: Symbol(), typeId: { type: new interface_1.NullableType(Symbol()) }, isNotNull: true };
    const name = Symbol();
    const description = Symbol();
    new PgObjectType_1.default({
        name,
        description,
        pgCatalog,
        pgAttributes: [pgAttribute1, pgAttribute2, pgAttribute3],
    });
    expect(pgCatalog.assertGetType.mock.calls).toEqual([[pgAttribute1.typeId], [pgAttribute2.typeId], [pgAttribute3.typeId]]);
    expect(getTypeFromPgType_1.default.mock.calls).toEqual([[pgCatalog, pgAttribute1.typeId.type], [pgCatalog, pgAttribute2.typeId.type], [pgCatalog, pgAttribute3.typeId.type]]);
    expect(ObjectType_1.default.mock.calls).toEqual([[{
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
            }]]);
});
test('it will allow fields with different names', () => {
    ObjectType_1.default.mockClear();
    const pgCatalog = new PgCatalog_1.default();
    const pgAttribute1 = { name: 'a' };
    const pgAttribute2 = { name: 'b' };
    const pgAttribute3 = { name: 'c' };
    new PgObjectType_1.default({
        pgCatalog,
        pgAttributes: [pgAttribute1, pgAttribute2, pgAttribute3],
    });
    new PgObjectType_1.default({
        pgCatalog,
        pgAttributes: new Map([
            ['x_a', pgAttribute1],
            ['x_b', pgAttribute2],
            ['x_c', pgAttribute3],
        ]),
    });
    expect(ObjectType_1.default.mock.calls).toEqual([
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
    ]);
});
test('getPgAttributeNameFromFieldName will get the attribute name from the field name', () => {
    const pgCatalog = new PgCatalog_1.default();
    const pgAttribute1 = { name: Symbol() };
    const pgAttribute2 = { name: Symbol() };
    const pgAttribute3 = { name: Symbol() };
    const type = new PgObjectType_1.default({
        pgCatalog,
        pgAttributes: new Map([
            ['a', pgAttribute1],
            ['b', pgAttribute2],
            ['c', pgAttribute3],
        ]),
    });
    expect(type.getPgAttributeNameFromFieldName('a')).toBe(pgAttribute1.name);
    expect(type.getPgAttributeNameFromFieldName('b')).toBe(pgAttribute2.name);
    expect(type.getPgAttributeNameFromFieldName('c')).toBe(pgAttribute3.name);
});
test('getFieldNameFromPgAttributeName will get the attribute name from the field name', () => {
    const pgCatalog = new PgCatalog_1.default();
    const pgAttribute1 = { name: Symbol() };
    const pgAttribute2 = { name: Symbol() };
    const pgAttribute3 = { name: Symbol() };
    const type = new PgObjectType_1.default({
        pgCatalog,
        pgAttributes: new Map([
            ['a', pgAttribute1],
            ['b', pgAttribute2],
            ['c', pgAttribute3],
        ]),
    });
    expect(type.getFieldNameFromPgAttributeName(pgAttribute1.name)).toBe('a');
    expect(type.getFieldNameFromPgAttributeName(pgAttribute2.name)).toBe('b');
    expect(type.getFieldNameFromPgAttributeName(pgAttribute3.name)).toBe('c');
});
test('$$transformPgValueIntoValue will transform a row object into an object map', () => {
    const pgCatalog = new PgCatalog_1.default();
    const pgAttribute1 = { name: 'a' };
    const pgAttribute2 = { name: 'b' };
    const pgAttribute3 = { name: 'c' };
    const type = new PgObjectType_1.default({
        pgCatalog,
        pgAttributes: new Map([
            ['x_a', pgAttribute1],
            ['x_b', pgAttribute2],
            ['x_c', pgAttribute3],
        ]),
    });
    type.fields.get('x_a').type = Symbol();
    type.fields.get('x_b').type = Symbol();
    type.fields.get('x_c').type = Symbol();
    expect(type[transformPgValueIntoValue_1.$$transformPgValueIntoValue]({ a: 1, b: 2, c: 3 }))
        .toEqual(new Map([['x_a', 1], ['x_b', 2], ['x_c', 3]]));
    expect(transformPgValueIntoValue_1.default.mock.calls)
        .toEqual([[type.fields.get('x_a').type, 1], [type.fields.get('x_b').type, 2], [type.fields.get('x_c').type, 3]]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdPYmplY3RUeXBlLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3R5cGUvX190ZXN0c19fL1BnT2JqZWN0VHlwZS10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUE7QUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQTtBQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUE7QUFFakMsNEJBQTZCLHVCQUM3QixDQUFDLENBRG1EO0FBQ3BELDZCQUF1Qix1Q0FDdkIsQ0FBQyxDQUQ2RDtBQUM5RCw0QkFBc0Isa0NBQ3RCLENBQUMsQ0FEdUQ7QUFDeEQsNENBQXVFLGlDQUN2RSxDQUFDLENBRHVHO0FBQ3hHLG9DQUE4QixzQkFDOUIsQ0FBQyxDQURtRDtBQUNwRCwrQkFBeUIsaUJBRXpCLENBQUMsQ0FGeUM7QUFFMUMsbUNBQXlCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFBO0FBRXBFLG9CQUFVLENBQUMsa0JBQWtCLENBQUMsVUFBVSxNQUFNO0lBQzVDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQTtBQUM3QixDQUFDLENBQUMsQ0FBQTtBQUVGLElBQUksQ0FBQyxvREFBb0QsRUFBRTtJQUN6RCxNQUFNLFNBQVMsR0FBRyxJQUFJLG1CQUFTLEVBQUUsQ0FBQTtJQUVqQyxTQUFTLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxJQUFJLENBQUMsQ0FBQTtJQUM5RCwyQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJ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