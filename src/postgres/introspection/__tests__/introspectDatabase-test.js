import { resolve } from 'path'
import { readFileSync } from 'fs'
import { Client } from 'pg'
import PGCatalog from '../PGCatalog'
import introspectDatabase from '../introspectDatabase'

const testSchema = readFileSync(resolve(__dirname, 'fixtures/kitchen-sink-schema.sql')).toString()

/**
 * Gets a local identifier that is independent of the object id assigned by
 * PostgreSQL which will be consistent across tests.
 *
 * Just a concatenation of the PostgreSQL object’s kind and name. For
 * attributes we also include the number.
 */
const getLocalId = pgObject => {
  if (pgObject.kind === 'attribute')
    return `${pgObject.kind}-${pgObject.name}-${pgObject.num}`

  return `${pgObject.kind}-${pgObject.name}`
}

/**
 * A utility for the following `format` function that creates a helper to
 * replace certain properties with their local id equivalents (see
 * `getLocalId` above).
 */
const withLocalIds = properties => pgObject => {
  const pgObjectLocalIds = {}

  for (const property of properties)
    if (pgObject[property] != null)
      pgObjectLocalIds[property] = getLocalId(pgObject)

  return Object.assign({}, pgObject, pgObjectLocalIds)
}

/**
 * A utility function to help sort arrays. Almost identical to the Lodash
 * `_.sortBy` function.
 */
const sortBy = getKey => (a, b) => {
  const aKey = getKey(a)
  const bKey = getKey(b)
  if (aKey > bKey) return 1
  if (aKey < bKey) return -1
  return 0
}

/**
 * Formats a `PGCatalog` object into a form that is easily snapshotable by
 * Jest. This gives us all the benefits of snapshot testing.
 */
const format = catalog => ({
  namespaces: Array.from(catalog._namespaces.values())
    .map(namespace => Object.assign({}, namespace, {
      id: namespace.name,
    }))
    .sort(sortBy(({ id }) => id)),

  classes: Array.from(catalog._classes.values())
    .map(klass => Object.assign({}, klass, {
      id: klass.name,
      namespaceId: catalog.getNamespace(klass.namespaceId).name,
      typeId: catalog.getType(klass.typeId).name,
    }))
    .sort(sortBy(({ id }) => id)),

  attributes: Array.from(catalog._attributes.values())
    .map(attribute => Object.assign({}, attribute, {
      classId: catalog.getClass(attribute.classId).name,
      typeId: catalog.getType(attribute.typeId).name,
    }))
    .sort(sortBy(({ classId, num }) => `${classId}-${num}`)),

  types: Array.from(catalog._types.values())
    .map(type => Object.assign({}, type, {
      id: type.name,
      namespaceId: catalog.getNamespace(type.namespaceId) ? catalog.getNamespace(type.namespaceId).name : 'external',
      classId: type.classId ? catalog.getClass(type.classId).name : null,
      baseTypeId: type.baseTypeId ? catalog.getType(type.baseTypeId) : null,
    }))
    .sort(sortBy(({ id }) => id)),
})

test('will get everything needed in an introspection', async () => {
  const client = new Client({
    database: 'postgraphql_test',
    port: 5432,
  })

  await client.connect()
  await client.query(testSchema)

  expect(format(await introspectDatabase(client, ['a', 'b', 'c']))).toMatchSnapshot()
  expect(format(await introspectDatabase(client, ['a']))).toMatchSnapshot()

  client.end()
})
