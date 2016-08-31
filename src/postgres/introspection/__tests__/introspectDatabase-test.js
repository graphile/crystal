import { resolve } from 'path'
import { readFileSync } from 'fs'
import test from 'ava'
import pg from 'pg'
import testConnection from '../../__tests__/fixtures/testConnection'
import PGCatalog from '../PGCatalog'
import introspectDatabase from '../introspectDatabase'

const testSchema = readFileSync(resolve(__dirname, 'fixtures/test-schema.sql')).toString()
const namespaceNames = ['a', 'b', 'c']

/**
 * @type {PGCatalog}
 */
let catalog

test.before(async () => {
  const client = await pg.connect(testConnection)
  await client.query(testSchema)
  catalog = await introspectDatabase(client, namespaceNames)
  client.end()
})

const getNamespace = n =>
  catalog.getNamespaces().find(({ name }) => name === n)

const getClass = (n, c) =>
  catalog
    .getClasses()
    .find(({ name, namespaceId }) =>
      catalog.getNamespace(namespaceId).name === n &&
      name === c
    )

const getAttribute = (n, c, a) =>
  catalog
    .getClassAttributes(getClass(n, c).id)
    .find(({ name }) => name === a)

const getType = (n, t) =>
  catalog
    .getClasses()
    .find(({ name, namespaceId }) =>
      catalog.getNamespace(namespaceId).name === n &&
      name === c
    )

test('will only get objects for the namespaces specified', t => {
  t.deepEqual(
    catalog.getNamespaces().map(({ name }) => name),
    ['a', 'b', 'c'],
  )
})

test('will get the descriptions of namespaces', t => {
  t.is(getNamespace('a').description, 'The a schema.')
  t.is(getNamespace('b').description, 'qwerty')
  t.falsy(getNamespace('c').description)
})

test('will only get classes that are in our selected namespaces', t => {
  const namespaceIds = catalog.getNamespaces().map(({ id }) => id)

  for (const clazz of catalog.getClasses())
    t.not(namespaceIds.indexOf(clazz.namespaceId), -1)
})

test('will get tables', t => {
  t.truthy(getClass('c', 'person'))
})

test('will get comments on a table', t => {
  t.is(getClass('c', 'person').description, 'Person test comment')
})

test('will get columns', t => {
  t.truthy(getAttribute('c', 'person', 'id'))
  t.truthy(getAttribute('c', 'person', 'name'))
  t.truthy(getAttribute('c', 'person', 'about'))
})

test('will get descriptions for columns', t => {
  t.falsy(getAttribute('c', 'person', 'id').description)
  t.is(getAttribute('c', 'person', 'name').description, 'The person’s name')
  t.falsy(getAttribute('c', 'person', 'about').description)
})

test('will understand if an column is not null', t => {
  t.true(getAttribute('c', 'person', 'id').isNotNull)
  t.true(getAttribute('c', 'person', 'name').isNotNull)
  t.false(getAttribute('c', 'person', 'about').isNotNull)
})

test('will get the number of an attribute', t => {
  t.is(getAttribute('c', 'person', 'id').num, 1)
  t.is(getAttribute('c', 'person', 'name').num, 2)
  t.is(getAttribute('c', 'person', 'about').num, 3)
})

test('will get compound types', t => {
  t.truthy(getClass('c', 'compound_type'))
})

test('will get comments on a compound type', t => {
  t.is(catalog.getType(getClass('c', 'compound_type').typeId).description, 'Awesome feature!')
})

test('will get attributes of a compound type', t => {
  t.truthy(getAttribute('c', 'compound_type', 'a'))
  t.truthy(getAttribute('c', 'compound_type', 'b'))
  t.truthy(getAttribute('c', 'compound_type', 'c'))
})

test('will get views', t => {
  t.truthy(getClass('b', 'yo'))
  t.truthy(getClass('a', 'no_update'))
})

test('will get comments on views', t => {
  t.is(getClass('b', 'yo').description, 'YOYOYO!!')
})

test('will get columns of a view', t => {
  t.truthy(getAttribute('b', 'yo', '__id'))
  t.truthy(getAttribute('b', 'yo', 'name'))
  t.truthy(getAttribute('b', 'yo', 'description'))
  t.truthy(getAttribute('b', 'yo', 'constant'))
})

test('will get comments on view columns', t => {
  t.is(getAttribute('b', 'yo', 'constant').description, 'This is constantly 2')
})

test('will get CRUDibility of tables', t => {
  const clazz = getClass('c', 'person')
  t.true(clazz.isSelectable)
  t.true(clazz.isInsertable)
  t.true(clazz.isUpdatable)
  t.true(clazz.isDeletable)
})

test('will get CRUDibility of compound keys', t => {
  const clazz = getClass('c', 'compound_type')
  t.false(clazz.isSelectable)
  t.false(clazz.isInsertable)
  t.false(clazz.isUpdatable)
  t.false(clazz.isDeletable)
})

test('will get CRUDibility of auto updatable views', t => {
  const clazz = getClass('b', 'yo')
  t.true(clazz.isSelectable)
  t.true(clazz.isInsertable)
  t.true(clazz.isUpdatable)
  t.true(clazz.isDeletable)
})

test('will get CRUDibility of non-updatable views', t => {
  const clazz = getClass('a', 'no_update')
  t.true(clazz.isSelectable)
  t.false(clazz.isInsertable)
  t.false(clazz.isUpdatable)
  t.false(clazz.isDeletable)
})

test('will get types for classes', t => {
  for (const clazz of catalog.getClasses()) {
    const type = catalog.getType(clazz.typeId)
    t.truthy(type)
    t.is(clazz.name, type.name)
    t.is(type.classId, clazz.id)
  }
})

test('will get types for attributes', t => {
  for (const attribute of catalog.getAttributes()) {
    const type = catalog.getType(attribute.typeId)
    t.truthy(type)
  }
})

// TODO: Needs tests for `PGType`
