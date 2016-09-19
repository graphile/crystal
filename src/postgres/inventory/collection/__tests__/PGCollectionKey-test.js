import getTestPGClient from '../../../__tests__/fixtures/getTestPGClient'
import { introspectDatabase } from '../../../introspection'
import PGCollectionKey from '../PGCollectionKey'

let client

/**
 * @type {PGCollectionKey}
 */
let collectionKey1

/**
 * @type {PGCollectionKey}
 */
let collectionKey2

beforeEach(async () => {
  client = await getTestPGClient()

  const pgCatalog = await introspectDatabase(client, ['a', 'b', 'c'])

  const constraint1 = {
    kind: 'constraint',
    name: 'compound_key_pkey',
    type: 'p',
    classId: pgCatalog.getClassByName('c', 'compound_key').id,
    keyAttributeNums: [
      pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1').num,
      pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2').num,
    ],
  }

  const constraint2 = {
    kind: 'constraint',
    name: 'person_unique_email',
    type: 'u',
    classId: pgCatalog.getClassByName('c', 'person').id,
    keyAttributeNums: [
      pgCatalog.getAttributeByName('c', 'person', 'email').num,
    ],
  }

  collectionKey1 = new PGCollectionKey(pgCatalog, constraint1)
  collectionKey2 = new PGCollectionKey(pgCatalog, constraint2)
})

test('name will be a concatenation of the attribute names with “and”', () => {
  expect(collectionKey1.name).toBe('person_id_1_and_person_id_2')
  expect(collectionKey2.name).toBe('email')
})

test('type will have fields for all of the respective attributes', () => {
  expect(collectionKey1.type.getFields().map(field => field.getName())).toEqual(['person_id_1', 'person_id_2'])
  expect(collectionKey2.type.getFields().map(field => field.getName())).toEqual(['email'])
})

test('type createFromFieldValues will create a tuple key from a map', () => {
  expect(collectionKey1.type.createFromFieldValues(new Map([['person_id_2', 4], ['person_id_1', 2]]))).toEqual([2, 4])
  expect(collectionKey2.type.createFromFieldValues(new Map([['email', 'hello.world@example.com'], ['extra', 42]]))).toEqual(['hello.world@example.com'])
})

test('type fields getFieldValueFromObject will correctly extract values from a tuple', () => {
  const a = Symbol('a')
  const b = Symbol('b')
  expect(collectionKey1.type.getFields()[0].getFieldValueFromObject([a, b])).toBe(a)
  expect(collectionKey1.type.getFields()[1].getFieldValueFromObject([a, b])).toBe(b)
  expect(collectionKey2.type.getFields()[0].getFieldValueFromObject([a])).toBe(a)
})

test('read will get single values from a table', async () => {
  await client.query(`
    insert into c.person (id, name, email, about) values
      (1, 'John Smith', 'john.smith@email.com', null),
      (2, 'Sara Smith', 'sara.smith@email.com', null),
      (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human');
  `)

  await client.query(`
    insert into c.compound_key (person_id_1, person_id_2) values
      (1, 2),
      (2, 1),
      (3, 2),
      (3, 1);
  `)

  const values = await Promise.all([
    collectionKey1.read({ client }, [3, 2]),
    collectionKey1.read({ client }, [2, 200]),
    collectionKey1.read({ client }, [1, 2]),
    collectionKey1.read({ client }, [3, 1]),
    collectionKey1.read({ client }, [3, 3]),
    collectionKey1.read({ client }, [2, 1]),
    collectionKey2.read({ client }, ['sara.smith@email.com']),
    collectionKey2.read({ client }, ['john.smith@email.com']),
    collectionKey2.read({ client }, ['does.not.exist@email.com']),
    collectionKey2.read({ client }, ['budd.deey@email.com']),
  ])

  expect(values).toEqual([
    { 'person_id_1': 3, 'person_id_2': 2 },
    null,
    { 'person_id_1': 1, 'person_id_2': 2 },
    { 'person_id_1': 3, 'person_id_2': 1 },
    null,
    { 'person_id_1': 2, 'person_id_2': 1 },
    { 'id': 2, 'name': 'Sara Smith', 'email': 'sara.smith@email.com', 'about': null, 'created_at': values[6]['created_at'] },
    { 'id': 1, 'name': 'John Smith', 'email': 'john.smith@email.com', 'about': null, 'created_at': values[7]['created_at'] },
    null,
    { 'id': 3, 'name': 'Budd Deey', 'email': 'budd.deey@email.com', 'about': 'Just a friendly human', 'created_at': values[9]['created_at'] },
  ])
})
