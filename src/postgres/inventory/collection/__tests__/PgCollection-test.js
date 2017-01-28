import { Client } from 'pg'
import { NullableType } from '../../../../interface'
import withPgClient from '../../../__tests__/fixtures/withPgClient'
import pgPool from '../../../__tests__/fixtures/pgPool'
import kitchenSinkSchemaSql from '../../../__tests__/fixtures/kitchenSinkSchemaSql'
import { mapToObject } from '../../../utils'
import { PgCatalog, introspectDatabase } from '../../../introspection'
import { $$pgClient } from '../../pgClientFromContext'
import PgCollection from '../PgCollection'

// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20

/** @type {PgCatalog} */
let pgCatalog

/** @type {PgCollection} */
let collection1

/** @type {PgCollection} */
let collection2

/** @type {PgCollection} */
let collection3

beforeAll(withPgClient(async client => {
  pgCatalog = await introspectDatabase(client, ['a', 'b', 'c'])

  const options = {}

  collection1 = new PgCollection(options, pgCatalog, pgCatalog.getClassByName('c', 'person'))
  collection2 = new PgCollection(options, pgCatalog, pgCatalog.getClassByName('b', 'updatable_view'))
  collection3 = new PgCollection(options, pgCatalog, pgCatalog.getClassByName('c', 'compound_key'))
}))

test('name will be the plural form of the class name', () => {
  expect(collection1.name).toBe('people')
  expect(collection2.name).toBe('updatable_views')
})

test('type will have the correct null and non null fields', () => {
  expect(Array.from(collection1.type.fields.values()).map(({ type }) => type.kind === 'NULLABLE'))
    .toEqual([false, false, true, false, true])
  expect(Array.from(collection2.type.fields.values()).map(({ type }) => type.kind === 'NULLABLE'))
    .toEqual([true, true, true, true])
})

test('create will insert new rows into the database', withPgClient(async client => {
  const context = { [$$pgClient]: client }

  const value1 = new Map([['name', 'John Smith'], ['about', 'Hello, world!'], ['email', 'john.smith@email.com']])
  const value2 = new Map([['name', 'Sarah Smith'], ['email', 'sarah.smith@email.com']])
  const value3 = new Map([['name', 'Budd Deey'], ['email', 'budd.deey@email.com']])

  client.query.mockClear()

  const values = await Promise.all([
    collection1.create(context, value1),
    collection1.create(context, value2),
    collection1.create(context, value3),
  ])

  // Make sure that even though we created three objects, we only called the
  // database with a single query. Thanks `dataloader`!
  expect(client.query.mock.calls.length).toBe(1)

  expect(typeof values[0].get('id')).toBe('number')
  expect(typeof values[1].get('id')).toBe('number')
  expect(typeof values[2].get('id')).toBe('number')
  expect(values[0].get('created_at')).toBeTruthy()
  expect(values[1].get('created_at')).toBeTruthy()
  expect(values[2].get('created_at')).toBeTruthy()
  expect(values[0].get('name')).toBe('John Smith')
  expect(values[1].get('name')).toBe('Sarah Smith')
  expect(values[2].get('name')).toBe('Budd Deey')

  const pgQueryResult = await client.query('select row_to_json(p) as object from c.person as p')

  expect(pgQueryResult.rows.map(({ object }) => object))
    .toEqual(values.map(mapToObject))
}))

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

test('paginator `count` will count all of the values in a collection with a condition', withPgClient(async client => {
  const context = { [$$pgClient]: client }

  expect(await collection1.paginator.count(context, true)).toBe(0)
  expect(await collection2.paginator.count(context, true)).toBe(0)
  expect(await collection3.paginator.count(context, true)).toBe(0)

  await client.query(`
    insert into c.person (id, name, email, about, created_at) values
      (1, 'John Smith', 'john.smith@email.com', null, null),
      (2, 'Sara Smith', 'sara.smith@email.com', null, null),
      (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human', null);
  `)

  await client.query(`
    insert into c.compound_key (person_id_1, person_id_2, extra) values
      (1, 2, false),
      (2, 1, true),
      (3, 2, false),
      (3, 1, true);
  `)

  expect(await collection1.paginator.count(context, true)).toBe(3)
  expect(await collection2.paginator.count(context, true)).toBe(3)
  expect(await collection3.paginator.count(context, true)).toBe(4)
  expect(await collection2.paginator.count(context, false)).toBe(0)
  expect(await collection3.paginator.count(context, false)).toBe(0)
  expect(await collection3.paginator.count(context, { type: 'FIELD', name: 'person_id_1', condition: { type: 'EQUAL', value: 3 } })).toBe(2)
  expect(await collection3.paginator.count(context, { type: 'FIELD', name: 'person_id_1', condition: { type: 'LESS_THAN', value: 2 } })).toBe(1)
}))

// TODO: Test conditions.
const paginatorFixtures = [
  {
    name: 'people',
    getPaginator: () => collection1.paginator,
    addValuesToClient: async client => {
      await client.query(`
        insert into c.person (id, name, email, about, created_at) values
          (1, 'John Smith', 'john.smith@email.com', null, null),
          (2, 'Sara Smith', 'sara.smith@email.com', null, null),
          (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human', null),
          (4, 'Hello World', 'hello.world@email.com', null, null);
      `)
    },
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
          const aId = a.get('id')
          const bId = b.get('id')
          return aId === bId ? 0 : aId > bId ? 1 : -1
        },
      },
      {
        name: 'descending primary key',
        getOrdering: () => collection1.paginator.orderings.get('primary_key_desc'),
        getValueCursor: value => [value.get('id')],
        compareValues: (a, b) => {
          const aId = a.get('id')
          const bId = b.get('id')
          return aId === bId ? 0 : aId < bId ? 1 : -1
        },
      },
      {
        name: 'ascending emails',
        getOrdering: () => collection1.paginator.orderings.get('email_asc'),
        getValueCursor: value => [value.get('email'), value.get('id')],
        compareValues: (a, b) => {
          const aEmail = a.get('email')
          const bEmail = b.get('email')
          return aEmail === bEmail ? 0 : aEmail > bEmail ? 1 : -1
        },
      },
      {
        name: 'descending emails',
        getOrdering: () => collection1.paginator.orderings.get('email_desc'),
        getValueCursor: value => [value.get('email'), value.get('id')],
        compareValues: (a, b) => {
          const aEmail = a.get('email')
          const bEmail = b.get('email')
          return aEmail === bEmail ? 0 : aEmail < bEmail ? 1 : -1
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
    addValuesToClient: async client => {
      await client.query(`
        insert into c.person (id, name, email, about, created_at) values
          (1, 'John Smith', 'john.smith@email.com', null, null),
          (2, 'Sara Smith', 'sara.smith@email.com', null, null),
          (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human', null);
      `)

      await client.query(`
        insert into c.compound_key (person_id_1, person_id_2, extra) values
          (1, 2, false),
          (2, 1, true),
          (3, 2, false),
          (3, 1, true);
      `)
    },
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
          const aId1 = a.get('person_id_1')
          const aId2 = a.get('person_id_2')
          const bId1 = b.get('person_id_1')
          const bId2 = b.get('person_id_2')
          return aId1 === bId1 ? aId2 === bId2 ? 0 : aId2 > bId2 ? 1 : -1 : aId1 > bId1 ? 1 : -1
        },
      },
      {
        name: 'descending primary key',
        getOrdering: () => collection3.paginator.orderings.get('primary_key_desc'),
        getValueCursor: value => [value.get('person_id_1'), value.get('person_id_2')],
        compareValues: (a, b) => {
          const aId1 = a.get('person_id_1')
          const aId2 = a.get('person_id_2')
          const bId1 = b.get('person_id_1')
          const bId2 = b.get('person_id_2')
          return aId1 === bId1 ? aId2 === bId2 ? 0 : aId2 < bId2 ? 1 : -1 : aId1 < bId1 ? 1 : -1
        },
      },
      {
        name: 'ascending extra',
        getOrdering: () => collection3.paginator.orderings.get('extra_asc'),
        getValueCursor: value => [value.get('extra'), value.get('person_id_1'), value.get('person_id_2')],
        compareValues: (a, b) => {
          const aExtra = a.get('extra')
          const aId1 = a.get('person_id_1')
          const aId2 = a.get('person_id_2')
          const bExtra = b.get('extra')
          const bId1 = b.get('person_id_1')
          const bId2 = b.get('person_id_2')
          return aExtra === bExtra ? aId1 === bId1 ? aId2 === bId2 ? 0 : aId2 > bId2 ? 1 : -1 : aId1 > bId1 ? 1 : -1 : aExtra > bExtra ? 1 : -1
        },
      },
      {
        name: 'descending extra',
        getOrdering: () => collection3.paginator.orderings.get('extra_desc'),
        getValueCursor: value => [value.get('extra'), value.get('person_id_1'), value.get('person_id_2')],
        compareValues: (a, b) => {
          const aExtra = a.get('extra')
          const aId1 = a.get('person_id_1')
          const aId2 = a.get('person_id_2')
          const bExtra = b.get('extra')
          const bId1 = b.get('person_id_1')
          const bId2 = b.get('person_id_2')
          return aExtra === bExtra ? aId1 === bId1 ? aId2 === bId2 ? 0 : aId2 < bId2 ? 1 : -1 : aId1 < bId1 ? 1 : -1 : aExtra < bExtra ? 1 : -1
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
]

paginatorFixtures.forEach(paginatorFixture => {
  describe(`paginator '${paginatorFixture.name}'`, () => {
    let client
    let context

    beforeAll(async () => {
      client = await pgPool.connect()
      context = { [$$pgClient]: client }
      await client.query('begin')
      await client.query(await kitchenSinkSchemaSql)
      await paginatorFixture.addValuesToClient(client)
    })

    afterAll(async () => {
      await client.query('rollback')
      client.release()
    })

    const { allValues } = paginatorFixture

    let paginator
    beforeAll(() => paginator = paginatorFixture.getPaginator())

    test('will count all of the values in the collection', async () => {
      expect(await paginator.count(context, true)).toBe(allValues.length)
    })

    paginatorFixture.orderingFixtures.forEach(orderingFixture => {
      describe(`ordering '${orderingFixture.name}'`, () => {
        const sortedValues = orderingFixture.compareValues ? [...allValues].sort(orderingFixture.compareValues) : [...allValues]
        const sortedValuesWithCursors = sortedValues.map((value, i) => ({ value, cursor: orderingFixture.getValueCursor(value, i) }))

        let ordering
        beforeAll(() => ordering = orderingFixture.getOrdering())

        test('will read all of the values in the correct order', async () => {
          const page = await ordering.readPage(context, true, {})
          expect(page.values).toEqual(sortedValuesWithCursors)
          expect(await Promise.all([page.hasNextPage(), page.hasPreviousPage()])).toEqual([false, false])
        })

        test('will read all values after an `afterCursor`', async () => {
          const [page1, page2] = await Promise.all([
            ordering.readPage(context, true, { afterCursor: sortedValuesWithCursors[0].cursor }),
            ordering.readPage(context, true, { afterCursor: sortedValuesWithCursors[2].cursor }),
          ])

          expect(page1.values).toEqual(sortedValuesWithCursors.slice(1))
          expect(page2.values).toEqual(sortedValuesWithCursors.slice(3))

          expect(await Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
            .toEqual([false, true, false, true])
        })

        test('will read all values before a `beforeCursor`', async () => {
          const [page1, page2] = await Promise.all([
            ordering.readPage(context, true, { beforeCursor: sortedValuesWithCursors[1].cursor }),
            ordering.readPage(context, true, { beforeCursor: sortedValuesWithCursors[3].cursor }),
          ])

          expect(page1.values).toEqual(sortedValuesWithCursors.slice(0, 1))
          expect(page2.values).toEqual(sortedValuesWithCursors.slice(0, 3))

          expect(await Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
            .toEqual([true, false, true, false])
        })

        test('will read all values between a `beforeCursor` and an `afterCursor`', async () => {
          const [page1, page2] = await Promise.all([
            ordering.readPage(context, true, { afterCursor: sortedValuesWithCursors[0].cursor, beforeCursor: sortedValuesWithCursors[3].cursor }),
            ordering.readPage(context, true, { afterCursor: sortedValuesWithCursors[1].cursor, beforeCursor: sortedValuesWithCursors[2].cursor }),
          ])

          expect(page1.values).toEqual(sortedValuesWithCursors.slice(1, 3))
          expect(page2.values).toEqual([])

          expect(await Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
            .toEqual([true, true, true, true])
        })

        test('will read only the first few values when provided `first`', async () => {
          const [page1, page2] = await Promise.all([
            ordering.readPage(context, true, { first: 1 }),
            ordering.readPage(context, true, { first: 3 }),
          ])

          expect(page1.values).toEqual(sortedValuesWithCursors.slice(0, 1))
          expect(page2.values).toEqual(sortedValuesWithCursors.slice(0, 3))

          expect(await Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
            .toEqual([true, false, true, false])
        })

        test('will read only the last few values when provided `last`', async () => {
          const [page1, page2] = await Promise.all([
            ordering.readPage(context, true, { last: 1 }),
            ordering.readPage(context, true, { last: 3 }),
          ])

          expect(page1.values).toEqual(sortedValuesWithCursors.slice(-1))
          expect(page2.values).toEqual(sortedValuesWithCursors.slice(-3))

          expect(await Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
            .toEqual([false, true, false, true])
        })

        test('will offset the results when provided an `offset`', async () => {
          const [page1, page2] = await Promise.all([
            ordering.readPage(context, true, { _offset: 1 }),
            ordering.readPage(context, true, { _offset: 3 }),
          ])

          expect(page1.values).toEqual(sortedValuesWithCursors.slice(1))
          expect(page2.values).toEqual(sortedValuesWithCursors.slice(3))

          expect(await Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
            .toEqual([false, true, false, true])
        })

        test('will fail when trying to use `first` and `last` together', async () => {
          expect((await ordering.readPage(context, true, { first: 1, last: 1 }).then(() => { throw new Error('Cannot suceed') }, error => error)).message).toEqual('`first` and `last` may not be defined at the same time.')
        })

        test('will fail when trying to use `last` and `offset` together', async () => {
          expect((await ordering.readPage(context, true, { last: 1, _offset: 1 }).then(() => { throw new Error('Cannot suceed') }, error => error)).message).toEqual('`offset` may not be used with `last`.')
        })

        test('can use `beforeCursor` and `first` together', async () => {
          const [page1, page2] = await Promise.all([
            ordering.readPage(context, true, { first: 2, beforeCursor: sortedValuesWithCursors[3].cursor }),
            ordering.readPage(context, true, { first: 2, beforeCursor: sortedValuesWithCursors[1].cursor }),
          ])

          expect(page1.values).toEqual(sortedValuesWithCursors.slice(0, 2))
          expect(page2.values).toEqual(sortedValuesWithCursors.slice(0, 1))

          expect(await Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
            .toEqual([true, false, true, false])
        })

        test('can use `afterCursor` and `first` together', async () => {
          const [page1, page2] = await Promise.all([
            ordering.readPage(context, true, { first: 2, afterCursor: sortedValuesWithCursors[0].cursor }),
            ordering.readPage(context, true, { first: 1, afterCursor: sortedValuesWithCursors[1].cursor }),
          ])

          expect(page1.values).toEqual(sortedValuesWithCursors.slice(1, 3))
          expect(page2.values).toEqual(sortedValuesWithCursors.slice(2, 3))

          expect(await Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
            .toEqual([true, true, true, true])
        })

        test('can use `first` with both `beforeCursor` and `afterCursor`', async () => {
          const [page1, page2] = await Promise.all([
            ordering.readPage(context, true, { first: 1, afterCursor: sortedValuesWithCursors[0].cursor, beforeCursor: sortedValuesWithCursors[3].cursor }),
            ordering.readPage(context, true, { first: 2, afterCursor: sortedValuesWithCursors[0].cursor, beforeCursor: sortedValuesWithCursors[2].cursor }),
          ])

          expect(page1.values).toEqual(sortedValuesWithCursors.slice(1, 2))
          expect(page2.values).toEqual(sortedValuesWithCursors.slice(1, 2))

          expect(await Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
            .toEqual([true, true, true, true])
        })

        test('can use `beforeCursor` and `last` together', async () => {
          const [page1, page2] = await Promise.all([
            ordering.readPage(context, true, { last: 2, beforeCursor: sortedValuesWithCursors[3].cursor }),
            ordering.readPage(context, true, { last: 2, beforeCursor: sortedValuesWithCursors[1].cursor }),
          ])

          expect(page1.values).toEqual(sortedValuesWithCursors.slice(1, 3))
          expect(page2.values).toEqual(sortedValuesWithCursors.slice(0, 1))

          expect(await Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
            .toEqual([true, true, true, false])
        })

        test('can use `afterCursor` and `last` together', async () => {
          const [page1, page2] = await Promise.all([
            ordering.readPage(context, true, { last: 2, afterCursor: sortedValuesWithCursors[0].cursor }),
            ordering.readPage(context, true, { last: 2, afterCursor: sortedValuesWithCursors[sortedValuesWithCursors.length - 2].cursor }),
          ])

          expect(page1.values).toEqual(sortedValuesWithCursors.slice(-2))
          expect(page2.values).toEqual(sortedValuesWithCursors.slice(-1))

          expect(await Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
            .toEqual([false, true, false, true])
        })

        test('can use `last` with both `beforeCursor` and `afterCursor`', async () => {
          const [page1, page2] = await Promise.all([
            ordering.readPage(context, true, { last: 1, afterCursor: sortedValuesWithCursors[0].cursor, beforeCursor: sortedValuesWithCursors[3].cursor }),
            ordering.readPage(context, true, { last: 2, afterCursor: sortedValuesWithCursors[0].cursor, beforeCursor: sortedValuesWithCursors[2].cursor }),
          ])

          expect(page1.values).toEqual(sortedValuesWithCursors.slice(2, 3))
          expect(page2.values).toEqual(sortedValuesWithCursors.slice(1, 2))

          expect(await Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
            .toEqual([true, true, true, true])
        })

        test('can use `first` with `offset`', async () => {
          const [page1, page2] = await Promise.all([
            ordering.readPage(context, true, { first: 2, _offset: 1 }),
            ordering.readPage(context, true, { first: 2, _offset: 3 }),
          ])

          expect(page1.values).toEqual(sortedValuesWithCursors.slice(1, 3))
          expect(page2.values).toEqual(sortedValuesWithCursors.slice(3, 5))

          expect(await Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
            .toEqual([true, true, false, true])
        })

        test('can use `afterCursor` with `offset`', async () => {
          const [page1, page2] = await Promise.all([
            ordering.readPage(context, true, { _offset: 2, afterCursor: sortedValuesWithCursors[0].cursor }),
            ordering.readPage(context, true, { _offset: 1, afterCursor: sortedValuesWithCursors[1].cursor }),
          ])

          expect(page1.values).toEqual(sortedValuesWithCursors.slice(3))
          expect(page2.values).toEqual(sortedValuesWithCursors.slice(3))

          expect(await Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
            .toEqual([false, true, false, true])
        })

        test('can use `first`, `afterCursor`, and `offset` together', async () => {
          const [page1, page2] = await Promise.all([
            ordering.readPage(context, true, { first: 1, _offset: 1, afterCursor: sortedValuesWithCursors[0].cursor }),
            ordering.readPage(context, true, { first: 1, _offset: 1, afterCursor: sortedValuesWithCursors[1].cursor }),
          ])

          expect(page1.values).toEqual(sortedValuesWithCursors.slice(2, 3))
          expect(page2.values).toEqual(sortedValuesWithCursors.slice(3))

          expect(await Promise.all([page1.hasNextPage(), page1.hasPreviousPage(), page2.hasNextPage(), page2.hasPreviousPage()]))
            .toEqual([true, true, false, true])
        })
      })
    })
  })
})
