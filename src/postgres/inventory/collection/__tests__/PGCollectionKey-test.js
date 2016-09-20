import getTestPGClient from '../../../__tests__/fixtures/getTestPGClient'
import { introspectDatabase } from '../../../introspection'
import { mapToObject } from '../../../utils'
import PGCollection from '../PGCollection'
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

  collectionKey1 = new PGCollectionKey(
    new PGCollection(pgCatalog, pgCatalog.getClassByName('c', 'compound_key')),
    {
      kind: 'constraint',
      name: 'compound_key_pkey',
      type: 'p',
      classId: pgCatalog.getClassByName('c', 'compound_key').id,
      keyAttributeNums: [
        pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1').num,
        pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2').num,
      ],
    },
  )

  collectionKey2 = new PGCollectionKey(
    new PGCollection(pgCatalog, pgCatalog.getClassByName('c', 'person')),
    {
      kind: 'constraint',
      name: 'person_unique_email',
      type: 'u',
      classId: pgCatalog.getClassByName('c', 'person').id,
      keyAttributeNums: [
        pgCatalog.getAttributeByName('c', 'person', 'email').num,
      ],
    },
  )
})

test('name will be a concatenation of the attribute names with “and”', () => {
  expect(collectionKey1.name).toBe('person_id_1_and_person_id_2')
  expect(collectionKey2.name).toBe('email')
})

test('type will have fields for all of the respective attributes', () => {
  expect(Array.from(collectionKey1.keyType.fields.keys())).toEqual(['person_id_1', 'person_id_2'])
  expect(Array.from(collectionKey2.keyType.fields.keys())).toEqual(['email'])
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

  client.query.mockClear()

  const values = await Promise.all([
    collectionKey1.read({ client }, new Map([['person_id_1', 3], ['person_id_2', 2]])),
    collectionKey1.read({ client }, new Map([['person_id_1', 2], ['person_id_2', 200]])),
    collectionKey1.read({ client }, new Map([['person_id_1', 1], ['person_id_2', 2]])),
    collectionKey1.read({ client }, new Map([['person_id_1', 3], ['person_id_2', 1]])),
    collectionKey1.read({ client }, new Map([['person_id_1', 3], ['person_id_2', 3]])),
    collectionKey1.read({ client }, new Map([['person_id_2', 1], ['person_id_1', 2]])),
    collectionKey2.read({ client }, new Map([['email', 'sara.smith@email.com']])),
    collectionKey2.read({ client }, new Map([['email', 'john.smith@email.com']])),
    collectionKey2.read({ client }, new Map([['email', 'does.not.exist@email.com']])),
    collectionKey2.read({ client }, new Map([['email', 'budd.deey@email.com']])),
  ])

  // Ensure that even though we did a lot of reads, we only actually queried
  // the database twice. Thanks `dataloader`!
  expect(client.query.mock.calls.length).toBe(2)

  expect(values.map(value => value == null ? null : mapToObject(value))).toEqual([
    { 'person_id_1': 3, 'person_id_2': 2 },
    null,
    { 'person_id_1': 1, 'person_id_2': 2 },
    { 'person_id_1': 3, 'person_id_2': 1 },
    null,
    { 'person_id_1': 2, 'person_id_2': 1 },
    { 'id': 2, 'name': 'Sara Smith', 'email': 'sara.smith@email.com', 'about': null, 'created_at': values[6].get('created_at') },
    { 'id': 1, 'name': 'John Smith', 'email': 'john.smith@email.com', 'about': null, 'created_at': values[7].get('created_at') },
    null,
    { 'id': 3, 'name': 'Budd Deey', 'email': 'budd.deey@email.com', 'about': 'Just a friendly human', 'created_at': values[9].get('created_at') },
  ])
})
