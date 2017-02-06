"use strict";
var _this = this;
var tslib_1 = require("tslib");
var withPgClient_1 = require("../../../__tests__/fixtures/withPgClient");
var pgPool_1 = require("../../../__tests__/fixtures/pgPool");
var kitchenSinkSchemaSql_1 = require("../../../__tests__/fixtures/kitchenSinkSchemaSql");
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
test('name will be the plural form of the class name', function () {
    expect(collection1.name).toBe('people');
    expect(collection2.name).toBe('updatable_views');
});
test('type will have the correct null and non null fields', function () {
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
test('create will insert new rows into the database', withPgClient_1.default(function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
test('paginator `count` will count all of the values in a collection with a condition', withPgClient_1.default(function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                return [4 /*yield*/, client.query("\n    insert into c.person (id, name, email, about, created_at) values\n      (1, 'John Smith', 'john.smith@email.com', null, null),\n      (2, 'Sara Smith', 'sara.smith@email.com', null, null),\n      (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human', null);\n  ")];
            case 4:
                _x.sent();
                return [4 /*yield*/, client.query("\n    insert into c.compound_key (person_id_1, person_id_2, extra) values\n      (1, 2, false),\n      (2, 1, true),\n      (3, 2, false),\n      (3, 1, true);\n  ")];
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
                var sortedValues = orderingFixture.compareValues ? allValues.slice().sort(orderingFixture.compareValues) : allValues.slice();
                var sortedValuesWithCursors = sortedValues.map(function (value, i) { return ({ value: value, cursor: orderingFixture.getValueCursor(value, i) }); });
                var ordering;
                beforeAll(function () { return ordering = orderingFixture.getOrdering(); });
                test('will read all of the values in the correct order', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                test('will read all values after an `afterCursor`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                test('will read all values before a `beforeCursor`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                test('will read all values between a `beforeCursor` and an `afterCursor`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                test('will read only the first few values when provided `first`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                test('will read only the last few values when provided `last`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                test('will offset the results when provided an `offset`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                test('will fail when trying to use `first` and `last` together', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                test('will fail when trying to use `last` and `offset` together', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                test('can use `beforeCursor` and `first` together', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                test('can use `afterCursor` and `first` together', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                test('can use `first` with both `beforeCursor` and `afterCursor`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                test('can use `beforeCursor` and `last` together', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                test('can use `afterCursor` and `last` together', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                test('can use `last` with both `beforeCursor` and `afterCursor`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                test('can use `first` with `offset`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                test('can use `afterCursor` with `offset`', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                test('can use `first`, `afterCursor`, and `offset` together', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDb2xsZWN0aW9uLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L2NvbGxlY3Rpb24vX190ZXN0c19fL1BnQ29sbGVjdGlvbi10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpQkE2akJBOztBQTNqQkEseUVBQW1FO0FBQ25FLDZEQUF1RDtBQUN2RCx5RkFBbUY7QUFDbkYsd0NBQTRDO0FBQzVDLHdEQUFzRTtBQUN0RSxpRUFBc0Q7QUFDdEQsZ0RBQTBDO0FBRTFDLHVEQUF1RDtBQUN2RCxPQUFPLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUU1Qyx3QkFBd0I7QUFDeEIsSUFBSSxTQUFTLENBQUE7QUFFYiwyQkFBMkI7QUFDM0IsSUFBSSxXQUFXLENBQUE7QUFFZiwyQkFBMkI7QUFDM0IsSUFBSSxXQUFXLENBQUE7QUFFZiwyQkFBMkI7QUFDM0IsSUFBSSxXQUFXLENBQUE7QUFFZixTQUFTLENBQUMsc0JBQVksQ0FBQyxVQUFNLE1BQU07UUFHM0IsT0FBTzs7O29CQUZELHFCQUFNLGtDQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBQTs7Z0JBQTdELFNBQVMsR0FBRyxTQUFpRCxDQUFBOzBCQUU3QyxFQUFFO2dCQUVsQixXQUFXLEdBQUcsSUFBSSxzQkFBWSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQTtnQkFDM0YsV0FBVyxHQUFHLElBQUksc0JBQVksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtnQkFDbkcsV0FBVyxHQUFHLElBQUksc0JBQVksQ0FBQyxPQUFPLEVBQUUsU0FB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aEUsS0FBQSxNQUFNLENBQUE7Z0JBQUMscUJBQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFBOztnQkFBdkQsa0JBQU8sU0FBZ0QsRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDaEUsS0FBQSxNQUFNLENBQUE7Z0JBQUMscUJBQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFBOztnQkFBdkQsa0JBQU8sU0FBZ0QsRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFFaEUscUJBQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyx1UkFLbEIsQ0FBQyxFQUFBOztnQkFMRixTQUtFLENBQUE7Z0JBRUYscUJBQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxxS0FNbEIsQ0FBQyxFQUFBOztnQkFORixTQU1FLENBQUE7Z0JBRUYsS0FBQSxNQUFNLENBQUE7Z0JBQUMscUJBQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFBOztnQkFBdkQsa0JBQU8sU0FBZ0QsRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDaEUsS0FBQSxNQUFNLENBQUE7Z0JBQUMscUJBQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFBOztnQkFBdkQsa0JBQU8sU0FBZ0QsRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDaEUsS0FBQSxNQUFNLENBQUE7Z0JBQUMscUJBQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFBOztnQkFBdkQsa0JBQU8sU0FBZ0QsRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDaEUsS0FBQSxNQUFNLENBQUE7Z0JBQUMscUJBQU0sV0FBVyxDQUFDLFNBQVMsQ0FB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