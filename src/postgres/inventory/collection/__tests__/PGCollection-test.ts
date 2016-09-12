import createKitchenSinkPGSchema from '../../../__tests__/fixtures/createKitchenSinkPGSchema'
import getTestPGCatalog from '../../../__tests__/fixtures/getTestPGCatalog'
import getTestPGClient from '../../../__tests__/fixtures/getTestPGClient'
import PGCollection from '../PGCollection'

beforeAll(createKitchenSinkPGSchema)

let collection1: PGCollection
let collection2: PGCollection

beforeAll(async () => {
  const pgCatalog = await getTestPGCatalog()
  collection1 = new PGCollection(pgCatalog, pgCatalog.getClassByName('c', 'person')!)
  collection2 = new PGCollection(pgCatalog, pgCatalog.getClassByName('b', 'updatable_view')!)
})

test('create will insert new rows into the database', async () => {
  const client = await getTestPGClient()
  const type1 = collection1.getType()
  const value1 = type1.fromRow({ name: 'John Smith', about: 'Hello, world!', email: 'john.smith@email.com' })
  const value2 = type1.fromRow({ name: 'Sarah Smith', email: 'sarah.smith@email.com' })
  const value3 = type1.fromRow({ name: 'Budd Deey', email: 'budd.deey@email.com' })

  await client.query('begin')

  const values = (await Promise.all([
    collection1.create({ client }, value1),
    collection1.create({ client }, value2),
    collection1.create({ client }, value3),
  ])).map(value => type1.toRow(value))

  expect(typeof values[0]['id']).toBe('number')
  expect(typeof values[1]['id']).toBe('number')
  expect(typeof values[2]['id']).toBe('number')
  expect(values[0]['created_at']).toBeTruthy()
  expect(values[1]['created_at']).toBeTruthy()
  expect(values[2]['created_at']).toBeTruthy()
  expect(values[0]['name']).toBe('John Smith')
  expect(values[1]['name']).toBe('Sarah Smith')
  expect(values[2]['name']).toBe('Budd Deey')

  expect((await client.query('select * from c.person')).rows).toEqual(values)

  await client.query('rollback')
})
