import { Client } from 'pg'
import { NullableType } from '../../../../interface'
import getTestPGClient from '../../../__tests__/fixtures/getTestPGClient'
import { mapToObject } from '../../../utils'
import { PGCatalog, introspectDatabase } from '../../../introspection'
import { createPGContext } from '../../pgContext'
import PGCollection from '../PGCollection'

/**
 * @type {Client}
 */
let client

/**
 * @type {PGCatalog}
 */
let pgCatalog

/**
 * @type {PGCollection}
 */
let collection1, collection2, collection3

beforeEach(async () => {
  client = await getTestPGClient()

  pgCatalog = await introspectDatabase(client, ['a', 'b', 'c'])

  const options = {
    renameAttributes: new Map(),
  }

  collection1 = new PGCollection(options, pgCatalog, pgCatalog.getClassByName('c', 'person'))
  collection2 = new PGCollection(options, pgCatalog, pgCatalog.getClassByName('b', 'updatable_view'))
  collection3 = new PGCollection(options, pgCatalog, pgCatalog.getClassByName('c', 'compound_key'))
})

test('name will be the plural form of the class name', () => {
  expect(collection1.name).toBe('people')
  expect(collection2.name).toBe('updatable_views')
})

test('type will have the correct null and non null fields', () => {
  expect(Array.from(collection1.type.fields.values()).map(({ type }) => type instanceof NullableType))
    .toEqual([false, false, true, false, true])
  expect(Array.from(collection2.type.fields.values()).map(({ type }) => type instanceof NullableType))
    .toEqual([true, true, true, true])
})

test('create will insert new rows into the database', async () => {
  const context = createPGContext(client)

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
})

test('paginator will have the same name and type', () => {
  expect(collection1.paginator.name).toBe(collection1.name)
  expect(collection1.paginator.type).toBe(collection1.type)
  expect(collection2.paginator.name).toBe(collection2.name)
  expect(collection2.paginator.type).toBe(collection2.type)
})

test('paginator will have the correct `orderings`', () => {
  expect(collection1.paginator.orderings).toEqual([
    { type: 'ATTRIBUTES', name: 'primary_key_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'id')] },
    { type: 'ATTRIBUTES', name: 'primary_key_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'id')] },
    { type: 'OFFSET', name: 'natural' },
    { type: 'ATTRIBUTES', name: 'id_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'id')] },
    { type: 'ATTRIBUTES', name: 'id_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'id')] },
    { type: 'ATTRIBUTES', name: 'name_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'name'), pgCatalog.getAttributeByName('c', 'person', 'id')] },
    { type: 'ATTRIBUTES', name: 'name_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'name'), pgCatalog.getAttributeByName('c', 'person', 'id')] },
    { type: 'ATTRIBUTES', name: 'about_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'about'), pgCatalog.getAttributeByName('c', 'person', 'id')] },
    { type: 'ATTRIBUTES', name: 'about_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'about'), pgCatalog.getAttributeByName('c', 'person', 'id')] },
    { type: 'ATTRIBUTES', name: 'email_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'email'), pgCatalog.getAttributeByName('c', 'person', 'id')] },
    { type: 'ATTRIBUTES', name: 'email_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'email'), pgCatalog.getAttributeByName('c', 'person', 'id')] },
    { type: 'ATTRIBUTES', name: 'created_at_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'created_at'), pgCatalog.getAttributeByName('c', 'person', 'id')] },
    { type: 'ATTRIBUTES', name: 'created_at_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'person', 'created_at'), pgCatalog.getAttributeByName('c', 'person', 'id')] },
  ])

  expect(collection2.paginator.orderings).toEqual([
    { type: 'OFFSET', name: 'natural' },
    { type: 'ATTRIBUTES', name: 'x_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('b', 'updatable_view', 'x')] },
    { type: 'ATTRIBUTES', name: 'x_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('b', 'updatable_view', 'x')] },
    { type: 'ATTRIBUTES', name: 'name_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('b', 'updatable_view', 'name')] },
    { type: 'ATTRIBUTES', name: 'name_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('b', 'updatable_view', 'name')] },
    { type: 'ATTRIBUTES', name: 'description_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('b', 'updatable_view', 'description')] },
    { type: 'ATTRIBUTES', name: 'description_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('b', 'updatable_view', 'description')] },
    { type: 'ATTRIBUTES', name: 'constant_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('b', 'updatable_view', 'constant')] },
    { type: 'ATTRIBUTES', name: 'constant_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('b', 'updatable_view', 'constant')] },
  ])

  expect(collection3.paginator.orderings).toEqual([
    { type: 'ATTRIBUTES', name: 'primary_key_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2')] },
    { type: 'ATTRIBUTES', name: 'primary_key_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2')] },
    { type: 'OFFSET', name: 'natural' },
    { type: 'ATTRIBUTES', name: 'person_id_2_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1')] },
    { type: 'ATTRIBUTES', name: 'person_id_2_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1')] },
    { type: 'ATTRIBUTES', name: 'person_id_1_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2')] },
    { type: 'ATTRIBUTES', name: 'person_id_1_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2')] },
    { type: 'ATTRIBUTES', name: 'extra_asc', descending: false, pgAttributes: [pgCatalog.getAttributeByName('c', 'compound_key', 'extra'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2')] },
    { type: 'ATTRIBUTES', name: 'extra_desc', descending: true, pgAttributes: [pgCatalog.getAttributeByName('c', 'compound_key', 'extra'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1'), pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2')] },
  ])
})

test('paginator `defaultOrdering` will be the first ordering in `orderings`', () => {
  expect(collection1.paginator.defaultOrdering).toBe(collection1.paginator.orderings[0])
  expect(collection2.paginator.defaultOrdering).toBe(collection2.paginator.orderings[0])
  expect(collection3.paginator.defaultOrdering).toBe(collection3.paginator.orderings[0])
})

async function addTestData () {
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
}

test('paginator `count` will count all of the values in a collection with a condition', async () => {
  const context = createPGContext(client)

  expect(await collection1.paginator.count(context, true)).toBe(0)
  expect(await collection2.paginator.count(context, true)).toBe(0)
  expect(await collection3.paginator.count(context, true)).toBe(0)

  await addTestData()

  expect(await collection1.paginator.count(context, true)).toBe(3)
  expect(await collection2.paginator.count(context, true)).toBe(3)
  expect(await collection3.paginator.count(context, true)).toBe(4)
  expect(await collection2.paginator.count(context, false)).toBe(0)
  expect(await collection3.paginator.count(context, false)).toBe(0)
  expect(await collection3.paginator.count(context, { type: 'FIELD', name: 'person_id_1', condition: { type: 'EQUAL', value: 3 } })).toBe(2)
  expect(await collection3.paginator.count(context, { type: 'FIELD', name: 'person_id_1', condition: { type: 'LESS_THAN', value: 2 } })).toBe(1)
})

test('paginator `readPage` will read all of the values', async () => {
  const context = createPGContext(client)

  expect((await collection1.paginator.readPage(context, {})).values).toEqual([])
  expect((await collection3.paginator.readPage(context, {})).values).toEqual([])

  await addTestData()

  expect((await collection1.paginator.readPage(context, {})).values).toEqual([
    {
      cursor: [1],
      value: new Map([
        ['id', 1],
        ['name', 'John Smith'],
        ['about', null],
        ['email', 'john.smith@email.com'],
        ['created_at', null],
      ]),
    },
    {
      cursor: [2],
      value: new Map([
        ['id', 2],
        ['name', 'Sara Smith'],
        ['about', null],
        ['email', 'sara.smith@email.com'],
        ['created_at', null],
      ]),
    },
    {
      cursor: [3],
      value: new Map([
        ['id', 3],
        ['name', 'Budd Deey'],
        ['about', 'Just a friendly human'],
        ['email', 'budd.deey@email.com'],
        ['created_at', null],
      ]),
    },
  ])

  expect((await collection3.paginator.readPage(context, {})).values).toEqual([
    {
      cursor: [1, 2],
      value: new Map([
        ['person_id_2', 2],
        ['person_id_1', 1],
        ['extra', false],
      ]),
    },
    {
      cursor: [2, 1],
      value: new Map([
        ['person_id_2', 1],
        ['person_id_1', 2],
        ['extra', true],
      ]),
    },
    {
      cursor: [3, 1],
      value: new Map([
        ['person_id_2', 1],
        ['person_id_1', 3],
        ['extra', true],
      ]),
    },
    {
      cursor: [3, 2],
      value: new Map([
        ['person_id_2', 2],
        ['person_id_1', 3],
        ['extra', false],
      ]),
    },
  ])
})

const collection1PageValues = [
  {
    cursor: ['sara.smith@email.com', 2],
    value: new Map([
      ['id', 2],
      ['name', 'Sara Smith'],
      ['about', null],
      ['email', 'sara.smith@email.com'],
      ['created_at', null],
    ]),
  },
  {
    cursor: ['john.smith@email.com', 1],
    value: new Map([
      ['id', 1],
      ['name', 'John Smith'],
      ['about', null],
      ['email', 'john.smith@email.com'],
      ['created_at', null],
    ]),
  },
  {
    cursor: ['budd.deey@email.com', 3],
    value: new Map([
      ['id', 3],
      ['name', 'Budd Deey'],
      ['about', 'Just a friendly human'],
      ['email', 'budd.deey@email.com'],
      ['created_at', null],
    ]),
  },
]

const collection3PageValues = [
  {
    cursor: [false, 1, 2],
    value: new Map([
      ['person_id_2', 2],
      ['person_id_1', 1],
      ['extra', false],
    ]),
  },
  {
    cursor: [false, 3, 2],
    value: new Map([
      ['person_id_2', 2],
      ['person_id_1', 3],
      ['extra', false],
    ]),
  },
  {
    cursor: [true, 2, 1],
    value: new Map([
      ['person_id_2', 1],
      ['person_id_1', 2],
      ['extra', true],
    ]),
  },
  {
    cursor: [true, 3, 1],
    value: new Map([
      ['person_id_2', 1],
      ['person_id_1', 3],
      ['extra', true],
    ]),
  },
]

test('paginator `readPage` will read all of the values using different orderings', async () => {
  const context = createPGContext(client)

  await addTestData()

  expect((await collection1.paginator.readPage(context, { ordering: collection1.paginator.orderings[10] })).values)
    .toEqual(collection1PageValues)

  expect((await collection3.paginator.readPage(context, { ordering: collection3.paginator.orderings[7] })).values)
    .toEqual(collection3PageValues)
})

test('paginator `readPage` will use a `beforeCursor`', async () => {
  const context = createPGContext(client)

  await addTestData()

  expect((await collection1.paginator.readPage(context, { ordering: collection1.paginator.orderings[10], beforeCursor: ['john.smith@email.com', 1] })).values)
    .toEqual([collection1PageValues[0]])

  expect((await collection3.paginator.readPage(context, { ordering: collection3.paginator.orderings[7], beforeCursor: [true, 2, 1] })).values)
    .toEqual([collection3PageValues[0], collection3PageValues[1]])
})

test('paginator `readPage` will use an `afterCursor`', async () => {
  const context = createPGContext(client)

  await addTestData()

  expect((await collection1.paginator.readPage(context, { ordering: collection1.paginator.orderings[10], afterCursor: ['john.smith@email.com', 1] })).values)
    .toEqual([collection1PageValues[2]])

  expect((await collection3.paginator.readPage(context, { ordering: collection3.paginator.orderings[7], afterCursor: [true, 2, 1] })).values)
    .toEqual([collection3PageValues[3]])
})

test('paginator `readPage` will use a `beforeCursor` and `afterCursor`', async () => {
  const context = createPGContext(client)

  await addTestData()

  expect((await collection1.paginator.readPage(context, { ordering: collection1.paginator.orderings[10], beforeCursor: ['budd.deey@email.com', 3], afterCursor: ['sara.smith@email.com', 2] })).values)
    .toEqual([collection1PageValues[1]])

  expect((await collection3.paginator.readPage(context, { ordering: collection3.paginator.orderings[7], beforeCursor: [true, 2, 1], afterCursor: [false, 3, 2] })).values)
    .toEqual([])
})

test('paginator `readPage` will read all of the values when there is a `first` parameter', async () => {
  const context = createPGContext(client)

  await addTestData()

  expect((await collection1.paginator.readPage(context, { ordering: collection1.paginator.orderings[10], first: 2 })).values)
    .toEqual([collection1PageValues[0], collection1PageValues[1]])

  expect((await collection3.paginator.readPage(context, { ordering: collection3.paginator.orderings[7], first: 3 })).values)
    .toEqual([collection3PageValues[0], collection3PageValues[1], collection3PageValues[2]])
})

test('paginator `readPage` will read the correct values when there is a `last` parameter', async () => {
  const context = createPGContext(client)

  await addTestData()

  expect((await collection1.paginator.readPage(context, { ordering: collection1.paginator.orderings[10], last: 2 })).values)
    .toEqual([collection1PageValues[1], collection1PageValues[2]])

  expect((await collection3.paginator.readPage(context, { ordering: collection3.paginator.orderings[7], last: 1 })).values)
    .toEqual([collection3PageValues[3]])
})

test('paginator `readPage` will read all of the values using various combinations of config options', async () => {
  const context = createPGContext(client)

  await addTestData()

  expect((await collection1.paginator.readPage(context, { ordering: collection1.paginator.orderings[10], beforeCursor: ['budd.deey@email.com', 3], last: 1 })).values)
    .toEqual([collection1PageValues[1]])

  expect((await collection3.paginator.readPage(context, { ordering: collection3.paginator.orderings[7], afterCursor: [false, 1, 2], first: 2 })).values)
    .toEqual([collection3PageValues[1], collection3PageValues[2]])
})
