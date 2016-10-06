import withPGClient from '../../../__tests__/fixtures/withPGClient'
import { introspectDatabase } from '../../../introspection'
import { mapToObject } from '../../../utils'
import { $$pgClient } from '../../pgClientFromContext.ts'
import PGCollection from '../PGCollection'
import PGCollectionKey from '../PGCollectionKey'

/**
 * @type {PGCollectionKey}
 */
let collectionKey1, collectionKey2

const createContext = client => ({ [$$pgClient]: client })

beforeEach(withPGClient(async client => {
  const pgCatalog = await introspectDatabase(client, ['a', 'b', 'c'])

  const options = {
    renameAttributes: new Map(),
  }

  collectionKey1 = new PGCollectionKey(
    new PGCollection(options, pgCatalog, pgCatalog.getClassByName('c', 'compound_key')),
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
    new PGCollection(options, pgCatalog, pgCatalog.getClassByName('c', 'person')),
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
}))

test('name will be a concatenation of the attribute names with “and”', () => {
  expect(collectionKey1.name).toBe('person_id_1_and_person_id_2')
  expect(collectionKey2.name).toBe('email')
})

test('type will have fields for all of the respective attributes', () => {
  expect(Array.from(collectionKey1.keyType.fields.keys())).toEqual(['person_id_1', 'person_id_2'])
  expect(Array.from(collectionKey2.keyType.fields.keys())).toEqual(['email'])
})

test('read will get single values from a table', withPGClient(async client => {
  const context = createContext(client)

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
    collectionKey1.read(context, new Map([['person_id_1', 3], ['person_id_2', 2]])),
    collectionKey1.read(context, new Map([['person_id_1', 2], ['person_id_2', 200]])),
    collectionKey1.read(context, new Map([['person_id_1', 1], ['person_id_2', 2]])),
    collectionKey1.read(context, new Map([['person_id_1', 3], ['person_id_2', 1]])),
    collectionKey1.read(context, new Map([['person_id_1', 3], ['person_id_2', 3]])),
    collectionKey1.read(context, new Map([['person_id_2', 1], ['person_id_1', 2]])),
    collectionKey2.read(context, new Map([['email', 'sara.smith@email.com']])),
    collectionKey2.read(context, new Map([['email', 'john.smith@email.com']])),
    collectionKey2.read(context, new Map([['email', 'does.not.exist@email.com']])),
    collectionKey2.read(context, new Map([['email', 'budd.deey@email.com']])),
  ])

  // Ensure that even though we did a lot of reads, we only actually queried
  // the database twice. Thanks `dataloader`!
  expect(client.query.mock.calls.length).toBe(2)

  expect(values.map(value => value == null ? null : mapToObject(value))).toEqual([
    { 'person_id_1': 3, 'person_id_2': 2, 'extra': null },
    null,
    { 'person_id_1': 1, 'person_id_2': 2, 'extra': null },
    { 'person_id_1': 3, 'person_id_2': 1, 'extra': null },
    null,
    { 'person_id_1': 2, 'person_id_2': 1, 'extra': null },
    { 'id': 2, 'name': 'Sara Smith', 'email': 'sara.smith@email.com', 'about': null, 'created_at': values[6].get('created_at') },
    { 'id': 1, 'name': 'John Smith', 'email': 'john.smith@email.com', 'about': null, 'created_at': values[7].get('created_at') },
    null,
    { 'id': 3, 'name': 'Budd Deey', 'email': 'budd.deey@email.com', 'about': 'Just a friendly human', 'created_at': values[9].get('created_at') },
  ])
}))

test('update will change values from a table', withPGClient(async client => {
  const context = createContext(client)

  await client.query(`
    insert into c.person (id, name, email, about) values
      (1, 'John Smith', 'john.smith@email.com', null),
      (2, 'Sara Smith', 'sara.smith@email.com', null),
      (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human');
  `)

  await client.query(`
    insert into c.compound_key (person_id_1, person_id_2) values
      (3, 2);
  `)

  const values = await Promise.all([
    collectionKey1.update(context, new Map([['person_id_1', 3], ['person_id_2', 2]]), new Map([['person_id_2', 3]])),
    collectionKey2.update(context, new Map([['email', 'john.smith@email.com']]), new Map([['about', 'Yolo swag!']])),
    collectionKey2.update(context, new Map([['email', 'sara.smith@email.com']]), new Map([['name', 'Sarah Smith'], ['email', 'sarah.smith@email.com'], ['about', 'Yolo swag!']])),
    collectionKey2.update(context, new Map([['email', 'budd.deey@email.com']]), new Map([['about', null]])),
  ])

  const expectedValues = [
    { 'person_id_1': 3, 'person_id_2': 3, 'extra': null },
    { 'id': 1, 'name': 'John Smith', email: 'john.smith@email.com', 'about': 'Yolo swag!', 'created_at': values[1].get('created_at') },
    { 'id': 2, 'name': 'Sarah Smith', email: 'sarah.smith@email.com', 'about': 'Yolo swag!', 'created_at': values[2].get('created_at') },
    { 'id': 3, 'name': 'Budd Deey', email: 'budd.deey@email.com', 'about': null, 'created_at': values[3].get('created_at') },
  ]

  expect(values.map(mapToObject)).toEqual(expectedValues)

  const pgQueryResult = await client.query(`
    select row_to_json(x) as object from c.compound_key as x
    union all
    select row_to_json(x) as object from c.person as x
  `)

  expect(pgQueryResult.rows.map(({ object }) => object)).toEqual(expectedValues)
}))

test('update fails when trying to patch a field that does not exist', withPGClient(async client => {
  const context = createContext(client)

  try {
    await collectionKey1.update(context, new Map([['person_id_1', 1], ['person_id_2', 2]]), new Map([['a', 1]]))
    expect(true).toBe(false)
  }
  catch (error) {
    expect(error.message).toBe('Cannot update field named \'a\' because it does not exist in collection \'compound_keys\'.')
  }
}))

test('update fails when trying to update a value that does not exist', withPGClient(async client => {
  const context = createContext(client)

  try {
    await collectionKey2.update(context, new Map([['email', 'does.not.exist@email.com']]), new Map([['about', 'xxxx']]))
    expect(true).toBe(false)
  }
  catch (error) {
    expect(error.message).toBe('No values were updated in collection \'people\' using key \'email\' because no values were found.')
  }
}))

test('delete will delete things from the database', withPGClient(async client => {
  const context = createContext(client)

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

  const selectQuery = `
    select row_to_json(x) as object from c.compound_key as x
    union all
    select row_to_json(x) as object from c.person as x
  `

  const { rows: initialRows } = await client.query(selectQuery)

  const values = await Promise.all([
    collectionKey1.delete(context, new Map([['person_id_1', 1], ['person_id_2', 2]])),
    collectionKey1.delete(context, new Map([['person_id_1', 2], ['person_id_2', 1]])),
    collectionKey1.delete(context, new Map([['person_id_1', 3], ['person_id_2', 1]])),
    collectionKey2.delete(context, new Map([['email', 'john.smith@email.com']])),
  ])

  expect(values.map(mapToObject)).toEqual([
    { 'person_id_1': 1, 'person_id_2': 2, 'extra': null },
    { 'person_id_1': 2, 'person_id_2': 1, 'extra': null },
    { 'person_id_1': 3, 'person_id_2': 1, 'extra': null },
    { 'id': 1, 'name': 'John Smith', 'email': 'john.smith@email.com', 'about': null, 'created_at': values[3].get('created_at') },
  ])

  expect((await client.query(selectQuery)).rows).toEqual([initialRows[2], initialRows[5], initialRows[6]])
}))

test('delete fails when trying to remove a value that does not exist', withPGClient(async client => {
  const context = createContext(client)

  try {
    await collectionKey1.delete(context, new Map([['person_id_1', 1], ['person_id_2', 2]]))
    expect(true).toBe(false)
  }
  catch (error) {
    expect(error.message).toBe('No values were deleted in collection \'compound_keys\' because no values were found.')
  }
}))
