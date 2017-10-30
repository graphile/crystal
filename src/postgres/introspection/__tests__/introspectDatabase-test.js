import withPgClient from '../../../__tests__/utils/withPgClient'
import createKitchenSinkPgSchema from '../../__tests__/fixtures/createKitchenSinkPgSchema'
import introspectDatabase from '../introspectDatabase'

// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20

/**
 * Gets a local identifier that is independent of the object id assigned by
 * PostgreSql which will be consistent across tests.
 *
 * Just a concatenation of the PostgreSql object’s kind and name. For
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
 * Formats a `PgCatalog` object into a form that is easily snapshotable by
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
      namespaceId: catalog.getNamespace(klass.namespaceId) ? catalog.getNamespace(klass.namespaceId).name : '__external__',
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
      namespaceId: catalog.getNamespace(type.namespaceId) ? catalog.getNamespace(type.namespaceId).name : null,
      classId: type.classId ? catalog.assertGetClass(type.classId).name : null,
      domainBaseTypeId: type.domainBaseTypeId ? catalog.assertGetType(type.domainBaseTypeId).name : null,
      rangeSubTypeId: type.rangeSubTypeId ? catalog.assertGetType(type.rangeSubTypeId).name : null,
      arrayItemTypeId: type.arrayItemTypeId ? catalog.assertGetType(type.arrayItemTypeId).name : null,
    }))
    // Remove any types outside of our expected namespace. This may exclude
    // relevant types, but the tradeoff is worth it. This test gets flaky when
    // we let types outside of our schemas in.
    .filter(namespace => Boolean(namespace.namespaceId))
    .sort(sortBy(({ id }) => id)),

  constraints: Array.from(catalog._constraints)
    .map(constraint => Object.assign({}, constraint, {
      classId: catalog.getClass(constraint.classId).name,
      foreignClassId: constraint.foreignClassId ? catalog.getClass(constraint.foreignClassId).name : null,
    })),

  procedure: Array.from(catalog._procedures)
    .map(procedure => Object.assign({}, procedure, {
      namespaceId: catalog.getNamespace(procedure.namespaceId).name,
      returnTypeId: catalog.getType(procedure.returnTypeId).name,
      argTypeIds: procedure.argTypeIds.map(typeId => catalog.getType(typeId).name),
    }))
    .sort(sortBy(({ name, argTypeIds }) => `${name}-${argTypeIds.join('-')}`)),
})

test('will get everything needed in an introspection', withPgClient(async client => {
  expect(format(await introspectDatabase(client, ['a', 'b', 'c']))).toMatchSnapshot()
  // TODO: expect(format(await introspectDatabase(client, ['a']))).toMatchSnapshot()
}))
