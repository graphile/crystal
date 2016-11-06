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
/**
 * @type {PgCatalog}
 */
let pgCatalog;
/**
 * @type {PgCollection}
 */
let collection1, collection2, collection3;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDb2xsZWN0aW9uLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L2NvbGxlY3Rpb24vX190ZXN0c19fL1BnQ29sbGVjdGlvbi10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBLDRCQUE2Qix1QkFDN0IsQ0FBQyxDQURtRDtBQUNwRCwrQkFBeUIsMENBQ3pCLENBQUMsQ0FEa0U7QUFDbkUseUJBQW1CLG9DQUNuQixDQUFDLENBRHNEO0FBQ3ZELHVDQUFpQyxrREFDakMsQ0FBQyxDQURrRjtBQUNuRix3QkFBNEIsZ0JBQzVCLENBQUMsQ0FEMkM7QUFDNUMsZ0NBQThDLHdCQUM5QyxDQUFDLENBRHFFO0FBQ3RFLHNDQUEyQiwyQkFDM0IsQ0FBQyxDQURxRDtBQUN0RCwrQkFBeUIsaUJBR3pCLENBQUMsQ0FIeUM7QUFFMUMsdURBQXVEO0FBQ3ZELE9BQU8sQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBRTVDOztHQUVHO0FBQ0gsSUFBSSxTQUFTLENBQUE7QUFFYjs7R0FFRztBQUNILElBQUksV0FBVyxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUE7QUFFekMsU0FBUyxDQUFDLHNCQUFZLENBQUMsQ0FBTSxNQUFNO0lBQ2pDLFNBQVMsR0FBRyxNQUFNLGtDQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUU3RCxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUE7SUFFbEIsV0FBVyxHQUFHLElBQUksc0JBQVksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUE7SUFDM0YsV0FBVyxHQUFHLElBQUksc0JBQVksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxjQUFj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