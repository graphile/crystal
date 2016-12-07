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
// tslint:disable-next-line only-arrow-functions
ObjectType_1.default.mockImplementation(function (config) {
    // tslint:disable-next-line no-invalid-this
    this.fields = config.fields;
});
test('it will call ObjectType with an appropriate config', () => {
    const pgCatalog = new PgCatalog_1.default();
    pgCatalog.assertGetType.mockImplementation(({ type }) => type);
    getTypeFromPgType_1.default.mockImplementation((_, type) => type);
    const pgAttribute1 = { name: Symbol(), description: Symbol(), typeId: { type: Symbol() } };
    const pgAttribute2 = { name: Symbol(), description: Symbol(), typeId: { type: new interface_1.NullableType(Symbol()) } };
    const pgAttribute3 = { name: Symbol(), description: Symbol(), typeId: { type: new interface_1.NullableType(Symbol()) }, isNotNull: true };
    const name = Symbol();
    const description = Symbol();
    // tslint:disable-next-line no-unused-new
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
                        }],
                ]),
            }]]);
});
test('it will allow fields with different names', () => {
    ObjectType_1.default.mockClear();
    const pgCatalog = new PgCatalog_1.default();
    const pgAttribute1 = { name: 'a' };
    const pgAttribute2 = { name: 'b' };
    const pgAttribute3 = { name: 'c' };
    // tslint:disable-next-line no-unused-new
    new PgObjectType_1.default({
        pgCatalog,
        pgAttributes: [pgAttribute1, pgAttribute2, pgAttribute3],
    });
    // tslint:disable-next-line no-unused-new
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdPYmplY3RUeXBlLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3R5cGUvX190ZXN0c19fL1BnT2JqZWN0VHlwZS10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUE7QUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQTtBQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUE7QUFFakMsNEJBQTZCLHVCQUM3QixDQUFDLENBRG1EO0FBQ3BELDZCQUF1Qix1Q0FDdkIsQ0FBQyxDQUQ2RDtBQUM5RCw0QkFBc0Isa0NBQ3RCLENBQUMsQ0FEdUQ7QUFDeEQsNENBQXVFLGlDQUN2RSxDQUFDLENBRHVHO0FBQ3hHLG9DQUE4QixzQkFDOUIsQ0FBQyxDQURtRDtBQUNwRCwrQkFBeUIsaUJBRXpCLENBQUMsQ0FGeUM7QUFFMUMsbUNBQXlCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFBO0FBRXBFLGdEQUFnRDtBQUNoRCxvQkFBVSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsTUFBTTtJQUM1QywyQ0FBMkM7SUFDM0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFBO0FBQzdCLENBQUMsQ0FBQyxDQUFBO0FBRUYsSUFBSSxDQUFDLG9EQUFvRCxFQUFFO0lBQ3pELE1BQU0sU0FBUyxHQUFHLElBQUksbUJBQVMsRUFBRSxDQUFBO0lBRWpDLFNBQVMsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLElBQUksQ0FBQyxDQUFBO0lBQzlELDJCQUFpQixDQUFDLGtCQUFr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