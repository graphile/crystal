"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const interface_1 = require('../../../../interface');
const withPgClient_1 = require('../../../__tests__/fixtures/withPgClient');
const pgPool_1 = require('../../../__tests__/fixtures/pgPool');
const kitchenSinkSchemaSql_1 = require('../../../__tests__/fixtures/kitchenSinkSchemaSql');
const utils_1 = require('../../../utils');
const introspection_1 = require('../../../introspection');
const pgClientFromContext_1 = require('../../pgClientFromContext');
const PgCollection_1 = require('../PgCollection');
// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;
/** @type {PgCatalog} */
let pgCatalog;
/** @type {PgCollection} */
let collection1;
/** @type {PgCollection} */
let collection2;
/** @type {PgCollection} */
let collection3;
beforeAll(withPgClient_1.default((client) => __awaiter(this, void 0, void 0, function* () {
    pgCatalog = yield introspection_1.introspectDatabase(client, ['a', 'b', 'c']);
    const options = {};
    collection1 = new PgCollection_1.default(options, pgCatalog, pgCatalog.getClassByName('c', 'person'));
    collection2 = new PgCollection_1.default(options, pgCatalog, pgCatalog.getClassByName('b', 'updatable_view'));
    collection3 = new PgCollection_1.default(options, pgCatalog, pgCatalog.getClassByName('c', 'compound_key'));
})));
test('name will be the plural form of the class name', () => {
    expect(collection1.name).toBe('people');
    expect(collection2.name).toBe('updatable_views');
});
test('type will have the correct null and non null fields', () => {
    expect(Array.from(collection1.type.fields.values()).map(({ type }) => type instanceof interface_1.NullableType))
        .toEqual([false, false, true, false, true]);
    expect(Array.from(collection2.type.fields.values()).map(({ type }) => type instanceof interface_1.NullableType))
        .toEqual([true, true, true, true]);
});
test('create will insert new rows into the database', withPgClient_1.default((client) => __awaiter(this, void 0, void 0, function* () {
    const context = { [pgClientFromContext_1.$$pgClient]: client };
    const value1 = new Map([['name', 'John Smith'], ['about', 'Hello, world!'], ['email', 'john.smith@email.com']]);
    const value2 = new Map([['name', 'Sarah Smith'], ['email', 'sarah.smith@email.com']]);
    const value3 = new Map([['name', 'Budd Deey'], ['email', 'budd.deey@email.com']]);
    client.query.mockClear();
    const values = yield Promise.all([
        collection1.create(context, value1),
        collection1.create(context, value2),
        collection1.create(context, value3),
    ]);
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
    const pgQueryResult = yield client.query('select row_to_json(p) as object from c.person as p');
    expect(pgQueryResult.rows.map(({ object }) => object))
        .toEqual(values.map(utils_1.mapToObject));
})));
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
test('paginator `count` will count all of the values in a collection with a condition', withPgClient_1.default((client) => __awaiter(this, void 0, void 0, function* () {
    const context = { [pgClientFromContext_1.$$pgClient]: client };
    expect(yield collection1.paginator.count(context, true)).toBe(0);
    expect(yield collection2.paginator.count(context, true)).toBe(0);
    expect(yield collection3.paginator.count(context, true)).toBe(0);
    yield client.query(`
    insert into c.person (id, name, email, about, created_at) values
      (1, 'John Smith', 'john.smith@email.com', null, null),
      (2, 'Sara Smith', 'sara.smith@email.com', null, null),
      (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human', null);
  `);
    yield client.query(`
    insert into c.compound_key (person_id_1, person_id_2, extra) values
      (1, 2, false),
      (2, 1, true),
      (3, 2, false),
      (3, 1, true);
  `);
    expect(yield collection1.paginator.count(context, true)).toBe(3);
    expect(yield collection2.paginator.count(context, true)).toBe(3);
    expect(yield collection3.paginator.count(context, true)).toBe(4);
    expect(yield collection2.paginator.count(context, false)).toBe(0);
    expect(yield collection3.paginator.count(context, false)).toBe(0);
    expect(yield collection3.paginator.count(context, { type: 'FIELD', name: 'person_id_1', condition: { type: 'EQUAL', value: 3 } })).toBe(2);
    expect(yield collection3.paginator.count(context, { type: 'FIELD', name: 'person_id_1', condition: { type: 'LESS_THAN', value: 2 } })).toBe(1);
})));
// TODO: Test conditions.
const paginatorFixtures = [
    {
        name: 'people',
        getPaginator: () => collection1.paginator,
        addValuesToClient: (client) => __awaiter(this, void 0, void 0, function* () {
            yield client.query(`
        insert into c.person (id, name, email, about, created_at) values
          (1, 'John Smith', 'john.smith@email.com', null, null),
          (2, 'Sara Smith', 'sara.smith@email.com', null, null),
          (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human', null),
          (4, 'Hello World', 'hello.world@email.com', null, null);
      `);
        }),
        allValues: [
            new Map([['id', 1], ['name', 'John Smith'], ['about', null], ['email', 'john.smith@email.com'], ['created_at', null]]),
            new Map([['id', 2], ['name', 'Sara Smith'], ['about', null], ['email', 'sara.smith@email.com'], ['created_at', null]]),
            new Map([['id', 3], ['name', 'Budd Deey'], ['about', 'Just a friendly human'], ['email', 'budd.deey@email.com'], ['created_at', null]]),
            new Map([['id', 4], ['name', 'Hello World'], ['about', null], ['email', 'hello.world@email.com'], ['created_at', null]]),
        ],
        orderingFixtures: [
            {
                name: 'ascending primary key',
                getOrdering: () => collection1.paginator.orderings.get('primary_key_asc'),
                getValueCursor: value => [value.get('id')],
                compareValues: (a, b) => {
                    const aId = a.get('id');
                    const bId = b.get('id');
                    return aId === bId ? 0 : aId > bId ? 1 : -1;
                },
            },
            {
                name: 'descending primary key',
                getOrdering: () => collection1.paginator.orderings.get('primary_key_desc'),
                getValueCursor: value => [value.get('id')],
                compareValues: (a, b) => {
                    const aId = a.get('id');
                    const bId = b.get('id');
                    return aId === bId ? 0 : aId < bId ? 1 : -1;
                },
            },
            {
                name: 'ascending emails',
                getOrdering: () => collection1.paginator.orderings.get('email_asc'),
                getValueCursor: value => [value.get('email'), value.get('id')],
                compareValues: (a, b) => {
                    const aEmail = a.get('email');
                    const bEmail = b.get('email');
                    return aEmail === bEmail ? 0 : aEmail > bEmail ? 1 : -1;
                },
            },
            {
                name: 'descending emails',
                getOrdering: () => collection1.paginator.orderings.get('email_desc'),
                getValueCursor: value => [value.get('email'), value.get('id')],
                compareValues: (a, b) => {
                    const aEmail = a.get('email');
                    const bEmail = b.get('email');
                    return aEmail === bEmail ? 0 : aEmail < bEmail ? 1 : -1;
                },
            },
            {
                name: 'offset',
                getOrdering: () => collection1.paginator.orderings.get('natural'),
                getValueCursor: (value, i) => i + 1,
                compareValues: null,
            },
        ],
    },
    {
        name: 'compound_keys',
        getPaginator: () => collection3.paginator,
        addValuesToClient: (client) => __awaiter(this, void 0, void 0, function* () {
            yield client.query(`
        insert into c.person (id, name, email, about, created_at) values
          (1, 'John Smith', 'john.smith@email.com', null, null),
          (2, 'Sara Smith', 'sara.smith@email.com', null, null),
          (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human', null);
      `);
            yield client.query(`
        insert into c.compound_key (person_id_1, person_id_2, extra) values
          (1, 2, false),
          (2, 1, true),
          (3, 2, false),
          (3, 1, true);
      `);
        }),
        allValues: [
            new Map([['person_id_2', 2], ['person_id_1', 1], ['extra', false]]),
            new Map([['person_id_2', 1], ['person_id_1', 2], ['extra', true]]),
            new Map([['person_id_2', 2], ['person_id_1', 3], ['extra', false]]),
            new Map([['person_id_2', 1], ['person_id_1', 3], ['extra', true]]),
        ],
        orderingFixtures: [
            {
                name: 'ascending primary key',
                getOrdering: () => collection3.paginator.orderings.get('primary_key_asc'),
                getValueCursor: value => [value.get('person_id_1'), value.get('person_id_2')],
                compareValues: (a, b) => {
                    const aId1 = a.get('person_id_1');
                    const aId2 = a.get('person_id_2');
                    const bId1 = b.get('person_id_1');
                    const bId2 = b.get('person_id_2');
                    return aId1 === bId1 ? aId2 === bId2 ? 0 : aId2 > bId2 ? 1 : -1 : aId1 > bId1 ? 1 : -1;
                },
            },
            {
                name: 'descending primary key',
                getOrdering: () => collection3.paginator.orderings.get('primary_key_desc'),
                getValueCursor: value => [value.get('person_id_1'), value.get('person_id_2')],
                compareValues: (a, b) => {
                    const aId1 = a.get('person_id_1');
                    const aId2 = a.get('person_id_2');
                    const bId1 = b.get('person_id_1');
                    const bId2 = b.get('person_id_2');
                    return aId1 === bId1 ? aId2 === bId2 ? 0 : aId2 < bId2 ? 1 : -1 : aId1 < bId1 ? 1 : -1;
                },
            },
            {
                name: 'ascending extra',
                getOrdering: () => collection3.paginator.orderings.get('extra_asc'),
                getValueCursor: value => [value.get('extra'), value.get('person_id_1'), value.get('person_id_2')],
                compareValues: (a, b) => {
                    const aExtra = a.get('extra');
                    const aId1 = a.get('person_id_1');
                    const aId2 = a.get('person_id_2');
                    const bExtra = b.get('extra');
                    const bId1 = b.get('person_id_1');
                    const bId2 = b.get('person_id_2');
                    return aExtra === bExtra ? aId1 === bId1 ? aId2 === bId2 ? 0 : aId2 > bId2 ? 1 : -1 : aId1 > bId1 ? 1 : -1 : aExtra > bExtra ? 1 : -1;
                },
            },
            {
                name: 'descending extra',
                getOrdering: () => collection3.paginator.orderings.get('extra_desc'),
                getValueCursor: value => [value.get('extra'), value.get('person_id_1'), value.get('person_id_2')],
                compareValues: (a, b) => {
                    const aExtra = a.get('extra');
                    const aId1 = a.get('person_id_1');
                    const aId2 = a.get('person_id_2');
                    const bExtra = b.get('extra');
                    const bId1 = b.get('person_id_1');
                    const bId2 = b.get('person_id_2');
                    return aExtra === bExtra ? aId1 === bId1 ? aId2 === bId2 ? 0 : aId2 < bId2 ? 1 : -1 : aId1 < bId1 ? 1 : -1 : aExtra < bExtra ? 1 : -1;
                },
            },
            {
                name: 'natural',
                getOrdering: () => collection3.paginator.orderings.get('natural'),
                getValueCursor: (value, i) => i + 1,
                compareValues: null,
            },
        ],
    },
];
paginatorFixtures.forEach(paginatorFixture => {
    describe(`paginator '${paginatorFixture.name}'`, () => {
        let client;
        let context;
        beforeAll(() => __awaiter(this, void 0, void 0, function* () {
            client = yield pgPool_1.default.connect();
            context = { [pgClientFromContext_1.$$pgClient]: client };
            yield client.query('begin');
            yield client.query(yield kitchenSinkSchemaSql_1.default);
            yield paginatorFixture.addValuesToClient(client);
        }));
        afterAll(() => __awaiter(this, void 0, void 0, function* () {
            yield client.query('rollback');
            client.release();
        }));
        const { allValues } = paginatorFixture;
        let paginator;
        beforeAll(() => paginator = paginatorFixture.getPaginator());
        test('will count all of the values in the collection', () => __awaiter(this, void 0, void 0, function* () {
            expect(yield paginator.count(context, true)).toBe(allValues.length);
        }));
        paginatorFixture.orderingFixtures.forEach(orderingFixture => {
            describe(`ordering '${orderingFixture.name}'`, () => {
                const sortedValues = orderingFixture.compareValues ? [...allValues].sort(orderingFixture.compareValues) : [...allValues];
                const sortedValuesWithCursors = sortedValues.map((value, i) => ({ value, cursor: orderingFixture.getValueCursor(value, i) }));
                let ordering;
                beforeAll(() => ordering = orderingFixture.getOrdering());
                test('will read all of the values in the correct order', () => __awaiter(this, void 0, void 0, function* () {
                    const page = yield ordering.readPage(context, true, {});
                    expect(page.values).toEqual(sortedValuesWithCursors);
                    expect(yield Promise.all([page.hasNextPage(), page.hasPreviousPage()])).toEqual([false, false]);
                }));
                test('will read all values after an `afterCursor`', () => __awaiter(this, void 0, void 0, function* () {
                    const [page1, page2] = yield Promise.all([
                        ordering.readPage(context, true, { afterCursor: sortedValuesWithCursors[0].cursor }),
                        ordering.readPage(context, true, { afterCursor: sortedValuesWithCursors[2].cursor }),
                    ]);
                    expect(page1.values).toEqual(sortedValuesWithCursors.slice(1));
                    expect(page2.values).toEqual(sortedValuesWithCursors.slice(3));
                    expect(yield Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
                        .toEqual([false, true, false, true]);
                }));
                test('will read all values before a `beforeCursor`', () => __awaiter(this, void 0, void 0, function* () {
                    const [page1, page2] = yield Promise.all([
                        ordering.readPage(context, true, { beforeCursor: sortedValuesWithCursors[1].cursor }),
                        ordering.readPage(context, true, { beforeCursor: sortedValuesWithCursors[3].cursor }),
                    ]);
                    expect(page1.values).toEqual(sortedValuesWithCursors.slice(0, 1));
                    expect(page2.values).toEqual(sortedValuesWithCursors.slice(0, 3));
                    expect(yield Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
                        .toEqual([true, false, true, false]);
                }));
                test('will read all values between a `beforeCursor` and an `afterCursor`', () => __awaiter(this, void 0, void 0, function* () {
                    const [page1, page2] = yield Promise.all([
                        ordering.readPage(context, true, { afterCursor: sortedValuesWithCursors[0].cursor, beforeCursor: sortedValuesWithCursors[3].cursor }),
                        ordering.readPage(context, true, { afterCursor: sortedValuesWithCursors[1].cursor, beforeCursor: sortedValuesWithCursors[2].cursor }),
                    ]);
                    expect(page1.values).toEqual(sortedValuesWithCursors.slice(1, 3));
                    expect(page2.values).toEqual([]);
                    expect(yield Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
                        .toEqual([true, true, true, true]);
                }));
                test('will read only the first few values when provided `first`', () => __awaiter(this, void 0, void 0, function* () {
                    const [page1, page2] = yield Promise.all([
                        ordering.readPage(context, true, { first: 1 }),
                        ordering.readPage(context, true, { first: 3 }),
                    ]);
                    expect(page1.values).toEqual(sortedValuesWithCursors.slice(0, 1));
                    expect(page2.values).toEqual(sortedValuesWithCursors.slice(0, 3));
                    expect(yield Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
                        .toEqual([true, false, true, false]);
                }));
                test('will read only the last few values when provided `last`', () => __awaiter(this, void 0, void 0, function* () {
                    const [page1, page2] = yield Promise.all([
                        ordering.readPage(context, true, { last: 1 }),
                        ordering.readPage(context, true, { last: 3 }),
                    ]);
                    expect(page1.values).toEqual(sortedValuesWithCursors.slice(-1));
                    expect(page2.values).toEqual(sortedValuesWithCursors.slice(-3));
                    expect(yield Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
                        .toEqual([false, true, false, true]);
                }));
                test('will offset the results when provided an `offset`', () => __awaiter(this, void 0, void 0, function* () {
                    const [page1, page2] = yield Promise.all([
                        ordering.readPage(context, true, { _offset: 1 }),
                        ordering.readPage(context, true, { _offset: 3 }),
                    ]);
                    expect(page1.values).toEqual(sortedValuesWithCursors.slice(1));
                    expect(page2.values).toEqual(sortedValuesWithCursors.slice(3));
                    expect(yield Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
                        .toEqual([false, true, false, true]);
                }));
                test('will fail when trying to use `first` and `last` together', () => __awaiter(this, void 0, void 0, function* () {
                    expect((yield ordering.readPage(context, true, { first: 1, last: 1 }).then(() => { throw new Error('Cannot suceed'); }, error => error)).message).toEqual('`first` and `last` may not be defined at the same time.');
                }));
                test('will fail when trying to use `last` and `offset` together', () => __awaiter(this, void 0, void 0, function* () {
                    expect((yield ordering.readPage(context, true, { last: 1, _offset: 1 }).then(() => { throw new Error('Cannot suceed'); }, error => error)).message).toEqual('`offset` may not be used with `last`.');
                }));
                test('can use `beforeCursor` and `first` together', () => __awaiter(this, void 0, void 0, function* () {
                    const [page1, page2] = yield Promise.all([
                        ordering.readPage(context, true, { first: 2, beforeCursor: sortedValuesWithCursors[3].cursor }),
                        ordering.readPage(context, true, { first: 2, beforeCursor: sortedValuesWithCursors[1].cursor }),
                    ]);
                    expect(page1.values).toEqual(sortedValuesWithCursors.slice(0, 2));
                    expect(page2.values).toEqual(sortedValuesWithCursors.slice(0, 1));
                    expect(yield Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
                        .toEqual([true, false, true, false]);
                }));
                test('can use `afterCursor` and `first` together', () => __awaiter(this, void 0, void 0, function* () {
                    const [page1, page2] = yield Promise.all([
                        ordering.readPage(context, true, { first: 2, afterCursor: sortedValuesWithCursors[0].cursor }),
                        ordering.readPage(context, true, { first: 1, afterCursor: sortedValuesWithCursors[1].cursor }),
                    ]);
                    expect(page1.values).toEqual(sortedValuesWithCursors.slice(1, 3));
                    expect(page2.values).toEqual(sortedValuesWithCursors.slice(2, 3));
                    expect(yield Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
                        .toEqual([true, true, true, true]);
                }));
                test('can use `first` with both `beforeCursor` and `afterCursor`', () => __awaiter(this, void 0, void 0, function* () {
                    const [page1, page2] = yield Promise.all([
                        ordering.readPage(context, true, { first: 1, afterCursor: sortedValuesWithCursors[0].cursor, beforeCursor: sortedValuesWithCursors[3].cursor }),
                        ordering.readPage(context, true, { first: 2, afterCursor: sortedValuesWithCursors[0].cursor, beforeCursor: sortedValuesWithCursors[2].cursor }),
                    ]);
                    expect(page1.values).toEqual(sortedValuesWithCursors.slice(1, 2));
                    expect(page2.values).toEqual(sortedValuesWithCursors.slice(1, 2));
                    expect(yield Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
                        .toEqual([true, true, true, true]);
                }));
                test('can use `beforeCursor` and `last` together', () => __awaiter(this, void 0, void 0, function* () {
                    const [page1, page2] = yield Promise.all([
                        ordering.readPage(context, true, { last: 2, beforeCursor: sortedValuesWithCursors[3].cursor }),
                        ordering.readPage(context, true, { last: 2, beforeCursor: sortedValuesWithCursors[1].cursor }),
                    ]);
                    expect(page1.values).toEqual(sortedValuesWithCursors.slice(1, 3));
                    expect(page2.values).toEqual(sortedValuesWithCursors.slice(0, 1));
                    expect(yield Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
                        .toEqual([true, true, true, false]);
                }));
                test('can use `afterCursor` and `last` together', () => __awaiter(this, void 0, void 0, function* () {
                    const [page1, page2] = yield Promise.all([
                        ordering.readPage(context, true, { last: 2, afterCursor: sortedValuesWithCursors[0].cursor }),
                        ordering.readPage(context, true, { last: 2, afterCursor: sortedValuesWithCursors[sortedValuesWithCursors.length - 2].cursor }),
                    ]);
                    expect(page1.values).toEqual(sortedValuesWithCursors.slice(-2));
                    expect(page2.values).toEqual(sortedValuesWithCursors.slice(-1));
                    expect(yield Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
                        .toEqual([false, true, false, true]);
                }));
                test('can use `last` with both `beforeCursor` and `afterCursor`', () => __awaiter(this, void 0, void 0, function* () {
                    const [page1, page2] = yield Promise.all([
                        ordering.readPage(context, true, { last: 1, afterCursor: sortedValuesWithCursors[0].cursor, beforeCursor: sortedValuesWithCursors[3].cursor }),
                        ordering.readPage(context, true, { last: 2, afterCursor: sortedValuesWithCursors[0].cursor, beforeCursor: sortedValuesWithCursors[2].cursor }),
                    ]);
                    expect(page1.values).toEqual(sortedValuesWithCursors.slice(2, 3));
                    expect(page2.values).toEqual(sortedValuesWithCursors.slice(1, 2));
                    expect(yield Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
                        .toEqual([true, true, true, true]);
                }));
                test('can use `first` with `offset`', () => __awaiter(this, void 0, void 0, function* () {
                    const [page1, page2] = yield Promise.all([
                        ordering.readPage(context, true, { first: 2, _offset: 1 }),
                        ordering.readPage(context, true, { first: 2, _offset: 3 }),
                    ]);
                    expect(page1.values).toEqual(sortedValuesWithCursors.slice(1, 3));
                    expect(page2.values).toEqual(sortedValuesWithCursors.slice(3, 5));
                    expect(yield Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
                        .toEqual([true, true, false, true]);
                }));
                test('can use `afterCursor` with `offset`', () => __awaiter(this, void 0, void 0, function* () {
                    const [page1, page2] = yield Promise.all([
                        ordering.readPage(context, true, { _offset: 2, afterCursor: sortedValuesWithCursors[0].cursor }),
                        ordering.readPage(context, true, { _offset: 1, afterCursor: sortedValuesWithCursors[1].cursor }),
                    ]);
                    expect(page1.values).toEqual(sortedValuesWithCursors.slice(3));
                    expect(page2.values).toEqual(sortedValuesWithCursors.slice(3));
                    expect(yield Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
                        .toEqual([false, true, false, true]);
                }));
                test('can use `first`, `afterCursor`, and `offset` together', () => __awaiter(this, void 0, void 0, function* () {
                    const [page1, page2] = yield Promise.all([
                        ordering.readPage(context, true, { first: 1, _offset: 1, afterCursor: sortedValuesWithCursors[0].cursor }),
                        ordering.readPage(context, true, { first: 1, _offset: 1, afterCursor: sortedValuesWithCursors[1].cursor }),
                    ]);
                    expect(page1.values).toEqual(sortedValuesWithCursors.slice(2, 3));
                    expect(page2.values).toEqual(sortedValuesWithCursors.slice(3));
                    expect(yield Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
                        .toEqual([true, true, false, true]);
                }));
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDb2xsZWN0aW9uLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L2NvbGxlY3Rpb24vX190ZXN0c19fL1BnQ29sbGVjdGlvbi10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBLDRCQUE2Qix1QkFDN0IsQ0FBQyxDQURtRDtBQUNwRCwrQkFBeUIsMENBQ3pCLENBQUMsQ0FEa0U7QUFDbkUseUJBQW1CLG9DQUNuQixDQUFDLENBRHNEO0FBQ3ZELHVDQUFpQyxrREFDakMsQ0FBQyxDQURrRjtBQUNuRix3QkFBNEIsZ0JBQzVCLENBQUMsQ0FEMkM7QUFDNUMsZ0NBQThDLHdCQUM5QyxDQUFDLENBRHFFO0FBQ3RFLHNDQUEyQiwyQkFDM0IsQ0FBQyxDQURxRDtBQUN0RCwrQkFBeUIsaUJBR3pCLENBQUMsQ0FIeUM7QUFFMUMsdURBQXVEO0FBQ3ZELE9BQU8sQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBRTVDLHdCQUF3QjtBQUN4QixJQUFJLFNBQVMsQ0FBQTtBQUViLDJCQUEyQjtBQUMzQixJQUFJLFdBQVcsQ0FBQTtBQUVmLDJCQUEyQjtBQUMzQixJQUFJLFdBQVcsQ0FBQTtBQUVmLDJCQUEyQjtBQUMzQixJQUFJLFdBQVcsQ0FBQTtBQUVmLFNBQVMsQ0FBQyxzQkFBWSxDQUFDLENBQU0sTUFBTTtJQUNqQyxTQUFTLEdBQUcsTUFBTSxrQ0FBa0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFFN0QsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFBO0lBRWxCLFdBQVcsR0FBRyxJQUFJLHNCQUFZLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBQzNGLFdBQVcsR0FBRyxJ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QUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDaEUsTUFBTSxDQUFDLE1BQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2hFLE1BQU0sQ0FBQyxNQUFNLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUVoRSxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUM7Ozs7O0dBS2xCLENBQUMsQ0FBQTtJQUVGLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQzs7Ozs7O0dBTWxCLENBQUMsQ0FBQTtJQUVGLE1BQU0sQ0FBQyxNQUFNLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNoRSxNQUFNLENBQUMsTUFBTSxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDaEUsTUFBTSxDQUFDLE1BQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2hFLE1BQU0sQ0FBQyxNQUFNLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNqRSxNQUFNLENBQUMsTUFBTSxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FB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