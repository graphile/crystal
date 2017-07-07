"use strict";
var _this = this;
var tslib_1 = require("tslib");
var createTestInParallel_1 = require("../../../../__tests__/utils/createTestInParallel");
var withPgClient_1 = require("../../../../__tests__/utils/withPgClient");
var pgPool_1 = require("../../../../__tests__/utils/pgPool");
var kitchenSinkSchemaSql_1 = require("../../../../__tests__/utils/kitchenSinkSchemaSql");
var utils_1 = require("../../../utils");
var introspection_1 = require("../../../introspection");
var pgClientFromContext_1 = require("../../pgClientFromContext");
var PgCollection_1 = require("../PgCollection");
// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;
/** @type {PgCatalog} */
var pgCatalog;
/** @type {PgCollection} */
var collection1;
/** @type {PgCollection} */
var collection2;
/** @type {PgCollection} */
var collection3;
beforeAll(withPgClient_1.default(function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var options;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, introspection_1.introspectDatabase(client, ['a', 'b', 'c'])];
            case 1:
                pgCatalog = _a.sent();
                options = {};
                collection1 = new PgCollection_1.default(options, pgCatalog, pgCatalog.getClassByName('c', 'person'));
                collection2 = new PgCollection_1.default(options, pgCatalog, pgCatalog.getClassByName('b', 'updatable_view'));
                collection3 = new PgCollection_1.default(options, pgCatalog, pgCatalog.getClassByName('c', 'compound_key'));
                return [2 /*return*/];
        }
    });
}); }));
{
    var testInParallel = createTestInParallel_1.default();
    testInParallel('name will be the plural form of the class name', function () {
        expect(collection1.name).toBe('people');
        expect(collection2.name).toBe('updatable_views');
    });
    testInParallel('type will have the correct null and non null fields', function () {
        expect(Array.from(collection1.type.fields.values()).map(function (_a) {
            var type = _a.type;
            return type.kind === 'NULLABLE';
        }))
            .toEqual([false, false, true, false, true]);
        expect(Array.from(collection2.type.fields.values()).map(function (_a) {
            var type = _a.type;
            return type.kind === 'NULLABLE';
        }))
            .toEqual([true, true, true, true]);
    });
    testInParallel('create will insert new rows into the database', withPgClient_1.default(function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var context, value1, value2, value3, values, pgQueryResult, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    context = (_a = {}, _a[pgClientFromContext_1.$$pgClient] = client, _a);
                    value1 = new Map([['name', 'John Smith'], ['about', 'Hello, world!'], ['email', 'john.smith@email.com']]);
                    value2 = new Map([['name', 'Sarah Smith'], ['email', 'sarah.smith@email.com']]);
                    value3 = new Map([['name', 'Budd Deey'], ['email', 'budd.deey@email.com']]);
                    client.query.mockClear();
                    return [4 /*yield*/, Promise.all([
                            collection1.create(context, value1),
                            collection1.create(context, value2),
                            collection1.create(context, value3),
                        ])];
                case 1:
                    values = _b.sent();
                    // Make sure that even though we created three objects, we only called the
                    // database with a single query. Thanks `dataloader`!
                    expect(client.query.mock.calls.length).toBe(1);
                    expect(typeof values[0].get('id')).toBe('number');
                    expect(typeof values[1].get('id')).toBe('number');
                    expect(typeof values[2].get('id')).toBe('number');
                    expect(values[0].get('created_at')).toBeTruthy();
                    expect(values[1].get('created_at')).toBeTruthy();
                    expect(values[2].get('created_at')).toBeTruthy();
                    expect(values[0].get('name')).toBe('John Smith');
                    expect(values[1].get('name')).toBe('Sarah Smith');
                    expect(values[2].get('name')).toBe('Budd Deey');
                    return [4 /*yield*/, client.query('select row_to_json(p) as object from c.person as p')];
                case 2:
                    pgQueryResult = _b.sent();
                    expect(pgQueryResult.rows.map(function (_a) {
                        var object = _a.object;
                        return object;
                    }))
                        .toEqual(values.map(utils_1.mapToObject));
                    return [2 /*return*/];
            }
        });
    }); }));
    test('create will only include relevant columns', withPgClient_1.default(function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var context, value1, value2, value3, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    context = (_a = {}, _a[pgClientFromContext_1.$$pgClient] = client, _a);
                    value1 = new Map([['name', 'John Smith'], ['email', 'john.smith@email.com']]);
                    value2 = new Map([['name', 'Sarah Smith'], ['email', 'sarah.smith@email.com']]);
                    value3 = new Map([['name', 'Budd Deey'], ['email', 'budd.deey@email.com']]);
                    client.query.mockClear();
                    return [4 /*yield*/, Promise.all([
                            collection1.create(context, value1),
                            collection1.create(context, value2),
                            collection1.create(context, value3),
                        ])];
                case 1:
                    _b.sent();
                    expect(client.query.mock.calls.length).toBe(1);
                    expect(client.query.mock.calls[0][0].text).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); }));
    // TODO: reimplement
    // test('paginator will have the same name and type', () => {
    //   expect(collection1.paginator.name).toBe(collection1.name)
    //   expect(collection1.paginator.type).toBe(collection1.type)
    //   expect(collection2.paginator.name).toBe(collection2.name)
    //   expect(collection2.paginator.type).toBe(collection2.type)
    // })
    // test('paginator will have the correct `orderings`', () => {
    //   expect(collection1.paginator.orderings).toEqual([
    //     { type: 'ATTRIBUTES', name: 'primary_key_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'id')] },
    //     { type: 'ATTRIBUTES', name: 'primary_key_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'id')] },
    //     { type: 'OFFSET', name: 'natural' },
    //     { type: 'ATTRIBUTES', name: 'id_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'id')] },
    //     { type: 'ATTRIBUTES', name: 'id_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'id')] },
    //     { type: 'ATTRIBUTES', name: 'name_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'name'), pgCatalog.getAttributeByName('c', 'person', 'id')] },
    //     { type: 'ATTRIBUTES', name: 'name_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'name'), pgCatalog.getAttributeByName('c', 'person', 'id')] },
    //     { type: 'ATTRIBUTES', name: 'about_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'about'), pgCatalog.getAttributeByName('c', 'person', 'id')] },
    //     { type: 'ATTRIBUTES', name: 'about_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'about'), pgCatalog.getAttributeByName('c', 'person', 'id')] },
    //     { type: 'ATTRIBUTES', name: 'email_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'email'), pgCatalog.getAttributeByName('c', 'person', 'id')] },
    //     { type: 'ATTRIBUTES', name: 'email_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'email'), pgCatalog.getAttributeByName('c', 'person', 'id')] },
    //     { type: 'ATTRIBUTES', name: 'created_at_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'created_at'), pgCatalog.getAttributeByName('c', 'person', 'id')] },
    //     { type: 'ATTRIBUTES', name: 'created_at_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'created_at'), pgCatalog.getAttributeByName('c', 'person', 'id')] },
    //   ])
    //   expect(collection2.paginator.orderings).toEqual([
    //     { type: 'OFFSET', name: 'natural' },
    //     { type: 'ATTRIBUTES', name: 'x_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('b', 'updatable_view', 'x')] },
    //     { type: 'ATTRIBUTES', name: 'x_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('b', 'updatable_view', 'x')] },
    //     { type: 'ATTRIBUTES', name: 'name_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('b', 'updatable_view', 'name')] },
    //     { type: 'ATTRIBUTES', name: 'name_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('b', 'updatable_view', 'name')] },
    //     { type: 'ATTRIBUTES', name: 'description_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('b', 'updatable_view', 'description')] },
    //     { type: 'ATTRIBUTES', name: 'description_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('b', 'updatable_view', 'description')] },
    //     { type: 'ATTRIBUTES', name: 'constant_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('b', 'updatable_view', 'constant')] },
    //     { type: 'ATTRIBUTES', name: 'constant_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('b', 'updatable_view', 'constant')] },
    //   ])
    //   expect(collection3.paginator.orderings).toEqual([
    //     { type: 'ATTRIBUTES', name: 'primary_key_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2')] },
    //     { type: 'ATTRIBUTES', name: 'primary_key_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2')] },
    //     { type: 'OFFSET', name: 'natural' },
    //     { type: 'ATTRIBUTES', name: 'person_id_2_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1')] },
    //     { type: 'ATTRIBUTES', name: 'person_id_2_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1')] },
    //     { type: 'ATTRIBUTES', name: 'person_id_1_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2')] },
    //     { type: 'ATTRIBUTES', name: 'person_id_1_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2')] },
    //     { type: 'ATTRIBUTES', name: 'extra_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'compound_key', 'extra'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2')] },
    //     { type: 'ATTRIBUTES', name: 'extra_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'compound_key', 'extra'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2')] },
    //   ])
    // })
    // test('paginator `defaultOrdering` will be the first ordering in `orderings`', () => {
    //   expect(collection1.paginator.defaultOrdering).toBe(collection1.paginator.orderings[0])
    //   expect(collection2.paginator.defaultOrdering).toBe(collection2.paginator.orderings[0])
    //   expect(collection3.paginator.defaultOrdering).toBe(collection3.paginator.orderings[0])
    // })
    testInParallel('paginator `count` will count all of the values in a collection with a condition', withPgClient_1.default(function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var context, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        return tslib_1.__generator(this, function (_x) {
            switch (_x.label) {
                case 0:
                    context = (_w = {}, _w[pgClientFromContext_1.$$pgClient] = client, _w);
                    _a = expect;
                    return [4 /*yield*/, collection1.paginator.count(context, true)];
                case 1:
                    _a.apply(void 0, [_x.sent()]).toBe(0);
                    _c = expect;
                    return [4 /*yield*/, collection2.paginator.count(context, true)];
                case 2:
                    _c.apply(void 0, [_x.sent()]).toBe(0);
                    _e = expect;
                    return [4 /*yield*/, collection3.paginator.count(context, true)];
                case 3:
                    _e.apply(void 0, [_x.sent()]).toBe(0);
                    return [4 /*yield*/, client.query("\n      insert into c.person (id, name, email, about, created_at) values\n        (1, 'John Smith', 'john.smith@email.com', null, null),\n        (2, 'Sara Smith', 'sara.smith@email.com', null, null),\n        (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human', null);\n    ")];
                case 4:
                    _x.sent();
                    return [4 /*yield*/, client.query("\n      insert into c.compound_key (person_id_1, person_id_2, extra) values\n        (1, 2, false),\n        (2, 1, true),\n        (3, 2, false),\n        (3, 1, true);\n    ")];
                case 5:
                    _x.sent();
                    _g = expect;
                    return [4 /*yield*/, collection1.paginator.count(context, true)];
                case 6:
                    _g.apply(void 0, [_x.sent()]).toBe(3);
                    _j = expect;
                    return [4 /*yield*/, collection2.paginator.count(context, true)];
                case 7:
                    _j.apply(void 0, [_x.sent()]).toBe(3);
                    _l = expect;
                    return [4 /*yield*/, collection3.paginator.count(context, true)];
                case 8:
                    _l.apply(void 0, [_x.sent()]).toBe(4);
                    _o = expect;
                    return [4 /*yield*/, collection2.paginator.count(context, false)];
                case 9:
                    _o.apply(void 0, [_x.sent()]).toBe(0);
                    _q = expect;
                    return [4 /*yield*/, collection3.paginator.count(context, false)];
                case 10:
                    _q.apply(void 0, [_x.sent()]).toBe(0);
                    _s = expect;
                    return [4 /*yield*/, collection3.paginator.count(context, { type: 'FIELD', name: 'person_id_1', condition: { type: 'EQUAL', value: 3 } })];
                case 11:
                    _s.apply(void 0, [_x.sent()]).toBe(2);
                    _u = expect;
                    return [4 /*yield*/, collection3.paginator.count(context, { type: 'FIELD', name: 'person_id_1', condition: { type: 'LESS_THAN', value: 2 } })];
                case 12:
                    _u.apply(void 0, [_x.sent()]).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); }));
}
// TODO: Test conditions.
var paginatorFixtures = [
    {
        name: 'people',
        getPaginator: function () { return collection1.paginator; },
        addValuesToClient: function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.query("\n        insert into c.person (id, name, email, about, created_at) values\n          (1, 'John Smith', 'john.smith@email.com', null, null),\n          (2, 'Sara Smith', 'sara.smith@email.com', null, null),\n          (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human', null),\n          (4, 'Hello World', 'hello.world@email.com', null, null);\n      ")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        allValues: [
            new Map([['id', 1], ['name', 'John Smith'], ['about', null], ['email', 'john.smith@email.com'], ['created_at', null]]),
            new Map([['id', 2], ['name', 'Sara Smith'], ['about', null], ['email', 'sara.smith@email.com'], ['created_at', null]]),
            new Map([['id', 3], ['name', 'Budd Deey'], ['about', 'Just a friendly human'], ['email', 'budd.deey@email.com'], ['created_at', null]]),
            new Map([['id', 4], ['name', 'Hello World'], ['about', null], ['email', 'hello.world@email.com'], ['created_at', null]]),
        ],
        orderingFixtures: [
            {
                name: 'ascending primary key',
                getOrdering: function () { return collection1.paginator.orderings.get('primary_key_asc'); },
                getValueCursor: function (value) { return [value.get('id')]; },
                compareValues: function (a, b) {
                    var aId = a.get('id');
                    var bId = b.get('id');
                    return aId === bId ? 0 : aId > bId ? 1 : -1;
                },
            },
            {
                name: 'descending primary key',
                getOrdering: function () { return collection1.paginator.orderings.get('primary_key_desc'); },
                getValueCursor: function (value) { return [value.get('id')]; },
                compareValues: function (a, b) {
                    var aId = a.get('id');
                    var bId = b.get('id');
                    return aId === bId ? 0 : aId < bId ? 1 : -1;
                },
            },
            {
                name: 'ascending emails',
                getOrdering: function () { return collection1.paginator.orderings.get('email_asc'); },
                getValueCursor: function (value) { return [value.get('email'), value.get('id')]; },
                compareValues: function (a, b) {
                    var aEmail = a.get('email');
                    var bEmail = b.get('email');
                    return aEmail === bEmail ? 0 : aEmail > bEmail ? 1 : -1;
                },
            },
            {
                name: 'descending emails',
                getOrdering: function () { return collection1.paginator.orderings.get('email_desc'); },
                getValueCursor: function (value) { return [value.get('email'), value.get('id')]; },
                compareValues: function (a, b) {
                    var aEmail = a.get('email');
                    var bEmail = b.get('email');
                    return aEmail === bEmail ? 0 : aEmail < bEmail ? 1 : -1;
                },
            },
            {
                name: 'offset',
                getOrdering: function () { return collection1.paginator.orderings.get('natural'); },
                getValueCursor: function (value, i) { return i + 1; },
                compareValues: null,
            },
        ],
    },
    {
        name: 'compound_keys',
        getPaginator: function () { return collection3.paginator; },
        addValuesToClient: function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.query("\n        insert into c.person (id, name, email, about, created_at) values\n          (1, 'John Smith', 'john.smith@email.com', null, null),\n          (2, 'Sara Smith', 'sara.smith@email.com', null, null),\n          (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human', null);\n      ")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, client.query("\n        insert into c.compound_key (person_id_1, person_id_2, extra) values\n          (1, 2, false),\n          (2, 1, true),\n          (3, 2, false),\n          (3, 1, true);\n      ")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        allValues: [
            new Map([['person_id_2', 2], ['person_id_1', 1], ['extra', false]]),
            new Map([['person_id_2', 1], ['person_id_1', 2], ['extra', true]]),
            new Map([['person_id_2', 2], ['person_id_1', 3], ['extra', false]]),
            new Map([['person_id_2', 1], ['person_id_1', 3], ['extra', true]]),
        ],
        orderingFixtures: [
            {
                name: 'ascending primary key',
                getOrdering: function () { return collection3.paginator.orderings.get('primary_key_asc'); },
                getValueCursor: function (value) { return [value.get('person_id_1'), value.get('person_id_2')]; },
                compareValues: function (a, b) {
                    var aId1 = a.get('person_id_1');
                    var aId2 = a.get('person_id_2');
                    var bId1 = b.get('person_id_1');
                    var bId2 = b.get('person_id_2');
                    return aId1 === bId1 ? aId2 === bId2 ? 0 : aId2 > bId2 ? 1 : -1 : aId1 > bId1 ? 1 : -1;
                },
            },
            {
                name: 'descending primary key',
                getOrdering: function () { return collection3.paginator.orderings.get('primary_key_desc'); },
                getValueCursor: function (value) { return [value.get('person_id_1'), value.get('person_id_2')]; },
                compareValues: function (a, b) {
                    var aId1 = a.get('person_id_1');
                    var aId2 = a.get('person_id_2');
                    var bId1 = b.get('person_id_1');
                    var bId2 = b.get('person_id_2');
                    return aId1 === bId1 ? aId2 === bId2 ? 0 : aId2 < bId2 ? 1 : -1 : aId1 < bId1 ? 1 : -1;
                },
            },
            {
                name: 'ascending extra',
                getOrdering: function () { return collection3.paginator.orderings.get('extra_asc'); },
                getValueCursor: function (value) { return [value.get('extra'), value.get('person_id_1'), value.get('person_id_2')]; },
                compareValues: function (a, b) {
                    var aExtra = a.get('extra');
                    var aId1 = a.get('person_id_1');
                    var aId2 = a.get('person_id_2');
                    var bExtra = b.get('extra');
                    var bId1 = b.get('person_id_1');
                    var bId2 = b.get('person_id_2');
                    return aExtra === bExtra ? aId1 === bId1 ? aId2 === bId2 ? 0 : aId2 > bId2 ? 1 : -1 : aId1 > bId1 ? 1 : -1 : aExtra > bExtra ? 1 : -1;
                },
            },
            {
                name: 'descending extra',
                getOrdering: function () { return collection3.paginator.orderings.get('extra_desc'); },
                getValueCursor: function (value) { return [value.get('extra'), value.get('person_id_1'), value.get('person_id_2')]; },
                compareValues: function (a, b) {
                    var aExtra = a.get('extra');
                    var aId1 = a.get('person_id_1');
                    var aId2 = a.get('person_id_2');
                    var bExtra = b.get('extra');
                    var bId1 = b.get('person_id_1');
                    var bId2 = b.get('person_id_2');
                    return aExtra === bExtra ? aId1 === bId1 ? aId2 === bId2 ? 0 : aId2 < bId2 ? 1 : -1 : aId1 < bId1 ? 1 : -1 : aExtra < bExtra ? 1 : -1;
                },
            },
            {
                name: 'natural',
                getOrdering: function () { return collection3.paginator.orderings.get('natural'); },
                getValueCursor: function (value, i) { return i + 1; },
                compareValues: null,
            },
        ],
    },
];
paginatorFixtures.forEach(function (paginatorFixture) {
    describe("paginator '" + paginatorFixture.name + "'", function () {
        var client;
        var context;
        beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, pgPool_1.default.connect()];
                    case 1:
                        client = _e.sent();
                        context = (_d = {}, _d[pgClientFromContext_1.$$pgClient] = client, _d);
                        return [4 /*yield*/, client.query('begin')];
                    case 2:
                        _e.sent();
                        _b = (_a = client).query;
                        return [4 /*yield*/, kitchenSinkSchemaSql_1.default];
                    case 3: return [4 /*yield*/, _b.apply(_a, [_e.sent()])];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, paginatorFixture.addValuesToClient(client)];
                    case 5:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.query('rollback')];
                    case 1:
                        _a.sent();
                        client.release();
                        return [2 /*return*/];
                }
            });
        }); });
        var allValues = paginatorFixture.allValues;
        var paginator;
        beforeAll(function () { return paginator = paginatorFixture.getPaginator(); });
        test('will count all of the values in the collection', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, paginator.count(context, true)];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).toBe(allValues.length);
                        return [2 /*return*/];
                }
            });
        }); });
        paginatorFixture.orderingFixtures.forEach(function (orderingFixture) {
            describe("ordering '" + orderingFixture.name + "'", function () {
                var testInParallel = createTestInParallel_1.default();
                var sortedValues = orderingFixture.compareValues ? allValues.slice().sort(orderingFixture.compareValues) : allValues.slice();
                var sortedValuesWithCursors = sortedValues.map(function (value, i) { return ({ value: value, cursor: orderingFixture.getValueCursor(value, i) }); });
                var ordering;
                beforeAll(function () { return ordering = orderingFixture.getOrdering(); });
                testInParallel('will read all of the values in the correct order', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var page, _a, _b;
                    return tslib_1.__generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, ordering.readPage(context, true, {})];
                            case 1:
                                page = _c.sent();
                                expect(page.values).toEqual(sortedValuesWithCursors);
                                _a = expect;
                                return [4 /*yield*/, Promise.all([page.hasNextPage(), page.hasPreviousPage()])];
                            case 2:
                                _a.apply(void 0, [_c.sent()]).toEqual([false, false]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                testInParallel('will read all values after an `afterCursor`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, page1, page2, _b, _c;
                    return tslib_1.__generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, Promise.all([
                                    ordering.readPage(context, true, { afterCursor: sortedValuesWithCursors[0].cursor }),
                                    ordering.readPage(context, true, { afterCursor: sortedValuesWithCursors[2].cursor }),
                                ])];
                            case 1:
                                _a = _d.sent(), page1 = _a[0], page2 = _a[1];
                                expect(page1.values).toEqual(sortedValuesWithCursors.slice(1));
                                expect(page2.values).toEqual(sortedValuesWithCursors.slice(3));
                                _b = expect;
                                return [4 /*yield*/, Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()])];
                            case 2:
                                _b.apply(void 0, [_d.sent()])
                                    .toEqual([false, true, false, true]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                testInParallel('will read all values before a `beforeCursor`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, page1, page2, _b, _c;
                    return tslib_1.__generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, Promise.all([
                                    ordering.readPage(context, true, { beforeCursor: sortedValuesWithCursors[1].cursor }),
                                    ordering.readPage(context, true, { beforeCursor: sortedValuesWithCursors[3].cursor }),
                                ])];
                            case 1:
                                _a = _d.sent(), page1 = _a[0], page2 = _a[1];
                                expect(page1.values).toEqual(sortedValuesWithCursors.slice(0, 1));
                                expect(page2.values).toEqual(sortedValuesWithCursors.slice(0, 3));
                                _b = expect;
                                return [4 /*yield*/, Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()])];
                            case 2:
                                _b.apply(void 0, [_d.sent()])
                                    .toEqual([true, false, true, false]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                testInParallel('will read all values between a `beforeCursor` and an `afterCursor`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, page1, page2, _b, _c;
                    return tslib_1.__generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, Promise.all([
                                    ordering.readPage(context, true, { afterCursor: sortedValuesWithCursors[0].cursor, beforeCursor: sortedValuesWithCursors[3].cursor }),
                                    ordering.readPage(context, true, { afterCursor: sortedValuesWithCursors[1].cursor, beforeCursor: sortedValuesWithCursors[2].cursor }),
                                ])];
                            case 1:
                                _a = _d.sent(), page1 = _a[0], page2 = _a[1];
                                expect(page1.values).toEqual(sortedValuesWithCursors.slice(1, 3));
                                expect(page2.values).toEqual([]);
                                _b = expect;
                                return [4 /*yield*/, Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()])];
                            case 2:
                                _b.apply(void 0, [_d.sent()])
                                    .toEqual([true, true, true, true]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                testInParallel('will read only the first few values when provided `first`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, page1, page2, _b, _c;
                    return tslib_1.__generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, Promise.all([
                                    ordering.readPage(context, true, { first: 1 }),
                                    ordering.readPage(context, true, { first: 3 }),
                                ])];
                            case 1:
                                _a = _d.sent(), page1 = _a[0], page2 = _a[1];
                                expect(page1.values).toEqual(sortedValuesWithCursors.slice(0, 1));
                                expect(page2.values).toEqual(sortedValuesWithCursors.slice(0, 3));
                                _b = expect;
                                return [4 /*yield*/, Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()])];
                            case 2:
                                _b.apply(void 0, [_d.sent()])
                                    .toEqual([true, false, true, false]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                testInParallel('will read only the last few values when provided `last`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, page1, page2, _b, _c;
                    return tslib_1.__generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, Promise.all([
                                    ordering.readPage(context, true, { last: 1 }),
                                    ordering.readPage(context, true, { last: 3 }),
                                ])];
                            case 1:
                                _a = _d.sent(), page1 = _a[0], page2 = _a[1];
                                expect(page1.values).toEqual(sortedValuesWithCursors.slice(-1));
                                expect(page2.values).toEqual(sortedValuesWithCursors.slice(-3));
                                _b = expect;
                                return [4 /*yield*/, Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()])];
                            case 2:
                                _b.apply(void 0, [_d.sent()])
                                    .toEqual([false, true, false, true]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                testInParallel('will offset the results when provided an `offset`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, page1, page2, _b, _c;
                    return tslib_1.__generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, Promise.all([
                                    ordering.readPage(context, true, { _offset: 1 }),
                                    ordering.readPage(context, true, { _offset: 3 }),
                                ])];
                            case 1:
                                _a = _d.sent(), page1 = _a[0], page2 = _a[1];
                                expect(page1.values).toEqual(sortedValuesWithCursors.slice(1));
                                expect(page2.values).toEqual(sortedValuesWithCursors.slice(3));
                                _b = expect;
                                return [4 /*yield*/, Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()])];
                            case 2:
                                _b.apply(void 0, [_d.sent()])
                                    .toEqual([false, true, false, true]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                testInParallel('will fail when trying to use `first` and `last` together', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    return tslib_1.__generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _a = expect;
                                return [4 /*yield*/, ordering.readPage(context, true, { first: 1, last: 1 }).then(function () { throw new Error('Cannot suceed'); }, function (error) { return error; })];
                            case 1:
                                _a.apply(void 0, [(_c.sent()).message]).toEqual('`first` and `last` may not be defined at the same time.');
                                return [2 /*return*/];
                        }
                    });
                }); });
                testInParallel('will fail when trying to use `last` and `offset` together', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    return tslib_1.__generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _a = expect;
                                return [4 /*yield*/, ordering.readPage(context, true, { last: 1, _offset: 1 }).then(function () { throw new Error('Cannot suceed'); }, function (error) { return error; })];
                            case 1:
                                _a.apply(void 0, [(_c.sent()).message]).toEqual('`offset` may not be used with `last`.');
                                return [2 /*return*/];
                        }
                    });
                }); });
                testInParallel('can use `beforeCursor` and `first` together', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, page1, page2, _b, _c;
                    return tslib_1.__generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, Promise.all([
                                    ordering.readPage(context, true, { first: 2, beforeCursor: sortedValuesWithCursors[3].cursor }),
                                    ordering.readPage(context, true, { first: 2, beforeCursor: sortedValuesWithCursors[1].cursor }),
                                ])];
                            case 1:
                                _a = _d.sent(), page1 = _a[0], page2 = _a[1];
                                expect(page1.values).toEqual(sortedValuesWithCursors.slice(0, 2));
                                expect(page2.values).toEqual(sortedValuesWithCursors.slice(0, 1));
                                _b = expect;
                                return [4 /*yield*/, Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()])];
                            case 2:
                                _b.apply(void 0, [_d.sent()])
                                    .toEqual([true, false, true, false]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                testInParallel('can use `afterCursor` and `first` together', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, page1, page2, _b, _c;
                    return tslib_1.__generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, Promise.all([
                                    ordering.readPage(context, true, { first: 2, afterCursor: sortedValuesWithCursors[0].cursor }),
                                    ordering.readPage(context, true, { first: 1, afterCursor: sortedValuesWithCursors[1].cursor }),
                                ])];
                            case 1:
                                _a = _d.sent(), page1 = _a[0], page2 = _a[1];
                                expect(page1.values).toEqual(sortedValuesWithCursors.slice(1, 3));
                                expect(page2.values).toEqual(sortedValuesWithCursors.slice(2, 3));
                                _b = expect;
                                return [4 /*yield*/, Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()])];
                            case 2:
                                _b.apply(void 0, [_d.sent()])
                                    .toEqual([true, true, true, true]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                testInParallel('can use `first` with both `beforeCursor` and `afterCursor`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, page1, page2, _b, _c;
                    return tslib_1.__generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, Promise.all([
                                    ordering.readPage(context, true, { first: 1, afterCursor: sortedValuesWithCursors[0].cursor, beforeCursor: sortedValuesWithCursors[3].cursor }),
                                    ordering.readPage(context, true, { first: 2, afterCursor: sortedValuesWithCursors[0].cursor, beforeCursor: sortedValuesWithCursors[2].cursor }),
                                ])];
                            case 1:
                                _a = _d.sent(), page1 = _a[0], page2 = _a[1];
                                expect(page1.values).toEqual(sortedValuesWithCursors.slice(1, 2));
                                expect(page2.values).toEqual(sortedValuesWithCursors.slice(1, 2));
                                _b = expect;
                                return [4 /*yield*/, Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()])];
                            case 2:
                                _b.apply(void 0, [_d.sent()])
                                    .toEqual([true, true, true, true]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                testInParallel('can use `beforeCursor` and `last` together', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, page1, page2, _b, _c;
                    return tslib_1.__generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, Promise.all([
                                    ordering.readPage(context, true, { last: 2, beforeCursor: sortedValuesWithCursors[3].cursor }),
                                    ordering.readPage(context, true, { last: 2, beforeCursor: sortedValuesWithCursors[1].cursor }),
                                ])];
                            case 1:
                                _a = _d.sent(), page1 = _a[0], page2 = _a[1];
                                expect(page1.values).toEqual(sortedValuesWithCursors.slice(1, 3));
                                expect(page2.values).toEqual(sortedValuesWithCursors.slice(0, 1));
                                _b = expect;
                                return [4 /*yield*/, Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()])];
                            case 2:
                                _b.apply(void 0, [_d.sent()])
                                    .toEqual([true, true, true, false]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                testInParallel('can use `afterCursor` and `last` together', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, page1, page2, _b, _c;
                    return tslib_1.__generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, Promise.all([
                                    ordering.readPage(context, true, { last: 2, afterCursor: sortedValuesWithCursors[0].cursor }),
                                    ordering.readPage(context, true, { last: 2, afterCursor: sortedValuesWithCursors[sortedValuesWithCursors.length - 2].cursor }),
                                ])];
                            case 1:
                                _a = _d.sent(), page1 = _a[0], page2 = _a[1];
                                expect(page1.values).toEqual(sortedValuesWithCursors.slice(-2));
                                expect(page2.values).toEqual(sortedValuesWithCursors.slice(-1));
                                _b = expect;
                                return [4 /*yield*/, Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()])];
                            case 2:
                                _b.apply(void 0, [_d.sent()])
                                    .toEqual([false, true, false, true]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                testInParallel('can use `last` with both `beforeCursor` and `afterCursor`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, page1, page2, _b, _c;
                    return tslib_1.__generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, Promise.all([
                                    ordering.readPage(context, true, { last: 1, afterCursor: sortedValuesWithCursors[0].cursor, beforeCursor: sortedValuesWithCursors[3].cursor }),
                                    ordering.readPage(context, true, { last: 2, afterCursor: sortedValuesWithCursors[0].cursor, beforeCursor: sortedValuesWithCursors[2].cursor }),
                                ])];
                            case 1:
                                _a = _d.sent(), page1 = _a[0], page2 = _a[1];
                                expect(page1.values).toEqual(sortedValuesWithCursors.slice(2, 3));
                                expect(page2.values).toEqual(sortedValuesWithCursors.slice(1, 2));
                                _b = expect;
                                return [4 /*yield*/, Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()])];
                            case 2:
                                _b.apply(void 0, [_d.sent()])
                                    .toEqual([true, true, true, true]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                testInParallel('can use `first` with `offset`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, page1, page2, _b, _c;
                    return tslib_1.__generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, Promise.all([
                                    ordering.readPage(context, true, { first: 2, _offset: 1 }),
                                    ordering.readPage(context, true, { first: 2, _offset: 3 }),
                                ])];
                            case 1:
                                _a = _d.sent(), page1 = _a[0], page2 = _a[1];
                                expect(page1.values).toEqual(sortedValuesWithCursors.slice(1, 3));
                                expect(page2.values).toEqual(sortedValuesWithCursors.slice(3, 5));
                                _b = expect;
                                return [4 /*yield*/, Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()])];
                            case 2:
                                _b.apply(void 0, [_d.sent()])
                                    .toEqual([true, true, false, true]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                testInParallel('can use `afterCursor` with `offset`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, page1, page2, _b, _c;
                    return tslib_1.__generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, Promise.all([
                                    ordering.readPage(context, true, { _offset: 2, afterCursor: sortedValuesWithCursors[0].cursor }),
                                    ordering.readPage(context, true, { _offset: 1, afterCursor: sortedValuesWithCursors[1].cursor }),
                                ])];
                            case 1:
                                _a = _d.sent(), page1 = _a[0], page2 = _a[1];
                                expect(page1.values).toEqual(sortedValuesWithCursors.slice(3));
                                expect(page2.values).toEqual(sortedValuesWithCursors.slice(3));
                                _b = expect;
                                return [4 /*yield*/, Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()])];
                            case 2:
                                _b.apply(void 0, [_d.sent()])
                                    .toEqual([false, true, false, true]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                testInParallel('can use `first`, `afterCursor`, and `offset` together', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, page1, page2, _b, _c;
                    return tslib_1.__generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, Promise.all([
                                    ordering.readPage(context, true, { first: 1, _offset: 1, afterCursor: sortedValuesWithCursors[0].cursor }),
                                    ordering.readPage(context, true, { first: 1, _offset: 1, afterCursor: sortedValuesWithCursors[1].cursor }),
                                ])];
                            case 1:
                                _a = _d.sent(), page1 = _a[0], page2 = _a[1];
                                expect(page1.values).toEqual(sortedValuesWithCursors.slice(2, 3));
                                expect(page2.values).toEqual(sortedValuesWithCursors.slice(3));
                                _b = expect;
                                return [4 /*yield*/, Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()])];
                            case 2:
                                _b.apply(void 0, [_d.sent()])
                                    .toEqual([true, true, false, true]);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDb2xsZWN0aW9uLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L2NvbGxlY3Rpb24vX190ZXN0c19fL1BnQ29sbGVjdGlvbi10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpQkF3bEJBOztBQXRsQkEseUZBQW1GO0FBQ25GLHlFQUFtRTtBQUNuRSw2REFBdUQ7QUFDdkQseUZBQW1GO0FBQ25GLHdDQUE0QztBQUM1Qyx3REFBc0U7QUFDdEUsaUVBQXNEO0FBQ3RELGdEQUEwQztBQUUxQyx1REFBdUQ7QUFDdkQsT0FBTyxDQUFDLHdCQUF3QixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFFNUMsd0JBQXdCO0FBQ3hCLElBQUksU0FBUyxDQUFBO0FBRWIsMkJBQTJCO0FBQzNCLElBQUksV0FBVyxDQUFBO0FBRWYsMkJBQTJCO0FBQzNCLElBQUksV0FBVyxDQUFBO0FBRWYsMkJBQTJCO0FBQzNCLElBQUksV0FBVyxDQUFBO0FBRWYsU0FBUyxDQUFDLHNCQUFZLENBQUMsVUFBTSxNQUFNO1FBRzNCLE9BQU87OztvQkFGRCxxQkFBTSxrQ0FBa0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUE7O2dCQUE3RCxTQUFTLEdBQUcsU0FBaUQsQ0FBQTswQkFFN0MsRUFBRTtnQkFFbEIsV0FBVyxHQUFHLElBQUksc0JBQVksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUE7Z0JBQzNGLFdBQVcsR0FBRyxJQUFJLHNCQUFZLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7Z0JBQ25HLFdBQVcsR0FBRyxJQUFJLHNCQUFZLENBQUMs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a0JBQU8sU0FBZ0QsRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDaEUsS0FBQSxNQUFNLENBQUE7b0JBQUMscUJBQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFBOztvQkFBdkQsa0JBQU8sU0FBZ0QsRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDaEUsS0FBQSxNQUFNLENBQUE7b0JBQUMscUJBQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFBOztvQkFBdkQsa0JBQU8sU0FBZ0QsRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFFaEUscUJBQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxpU0FLbEIsQ0FBQyxFQUFBOztvQkFMRixTQUtFLENBQUE7b0JBRUYscUJBQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxpTEFNbEIsQ0FBQyxFQUFBOztvQkFORixTQU1FLENBQUE7b0JBRUYsS0FBQSxNQUFNLENBQUE7b0JBQUMscUJBQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFBOztvQkFBdkQsa0JBQU8sU0FBZ0QsRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDaEUsS0FBQSxNQUFNLENBQUE7b0JBQUMscUJBQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFBOztvQkFBdkQsa0JBQU8sU0FBZ0QsRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDaEUsS0FBQSxNQUFNLENBQUE7b0JBQUMscUJBQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFBOztvQkFBdkQsa0JBQU8sU0FBZ0QsRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtv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