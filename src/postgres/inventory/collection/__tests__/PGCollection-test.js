import { Client } from 'pg'
import { NullableType } from '../../../../interface'
import getTestPGClient from '../../../__tests__/fixtures/getTestPGClient'
import { mapToObject } from '../../../utils'
import { introspectDatabase } from '../../../introspection'
import PGCollection from '../PGCollection'

/**
 * @type {Client}
 */
let client

/**
 * @type {PGCollection}
 */
let collection1

/**
 * @type {PGCollection}
 */
let collection2

beforeEach(async () => {
  client = await getTestPGClient()

  const pgCatalog = await introspectDatabase(client, ['a', 'b', 'c'])

  const options = {
    renameAttributes: new Map(),
  }

  collection1 = new PGCollection(options, pgCatalog, pgCatalog.getClassByName('c', 'person'))
  collection2 = new PGCollection(options, pgCatalog, pgCatalog.getClassByName('b', 'updatable_view'))
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
  const value1 = new Map([['name', 'John Smith'], ['about', 'Hello, world!'], ['email', 'john.smith@email.com']])
  const value2 = new Map([['name', 'Sarah Smith'], ['email', 'sarah.smith@email.com']])
  const value3 = new Map([['name', 'Budd Deey'], ['email', 'budd.deey@email.com']])

  client.query.mockClear()

  const values = await Promise.all([
    collection1.create({ client }, value1),
    collection1.create({ client }, value2),
    collection1.create({ client }, value3),
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
