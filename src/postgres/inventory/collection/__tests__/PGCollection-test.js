import { Client } from 'pg'
import { NullableType } from '../../../../interface'
import getTestPGClient from '../../../__tests__/fixtures/getTestPGClient'
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

  collection1 = new PGCollection(pgCatalog, pgCatalog.getClassByName('c', 'person'))
  collection2 = new PGCollection(pgCatalog, pgCatalog.getClassByName('b', 'updatable_view'))
})

test('name will be the plural form of the class name', () => {
  expect(collection1.name).toBe('people')
  expect(collection2.name).toBe('updatable_views')
})

test('type will have the correct null and non null fields', () => {
  expect(collection1.type.getFields().map(field => field.getType() instanceof NullableType))
    .toEqual([false, false, true, false, true])
  expect(collection2.type.getFields().map(field => field.getType() instanceof NullableType))
    .toEqual([true, true, true, true])
})

test('create will insert new rows into the database', async () => {
  const value1 = { name: 'John Smith', about: 'Hello, world!', email: 'john.smith@email.com' }
  const value2 = { name: 'Sarah Smith', email: 'sarah.smith@email.com' }
  const value3 = { name: 'Budd Deey', email: 'budd.deey@email.com' }

  const values = await Promise.all([
    collection1.create({ client }, value1),
    collection1.create({ client }, value2),
    collection1.create({ client }, value3),
  ])

  expect(typeof values[0]['id']).toBe('number')
  expect(typeof values[1]['id']).toBe('number')
  expect(typeof values[2]['id']).toBe('number')
  expect(values[0]['created_at']).toBeTruthy()
  expect(values[1]['created_at']).toBeTruthy()
  expect(values[2]['created_at']).toBeTruthy()
  expect(values[0]['name']).toBe('John Smith')
  expect(values[1]['name']).toBe('Sarah Smith')
  expect(values[2]['name']).toBe('Budd Deey')

  const valuesFromDB = (await client.query('select row_to_json(p) as object from c.person as p')).rows
    .map(({ object }) => object)

  expect(valuesFromDB).toEqual(values)
})
