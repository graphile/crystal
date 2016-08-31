import test from 'ava'
import PGCatalog from '../PGCatalog'

const mockNamespaces = [
  { kind: 'namespace', id: '0' },
  { kind: 'namespace', id: '1' },
]

const mockClasses = [
  { kind: 'class', id: '2' },
  { kind: 'class', id: '3' },
  { kind: 'class', id: '4' },
]

const mockAttributes = [
  { kind: 'attribute', classId: '2', num: '0' },
  { kind: 'attribute', classId: '2', num: '1' },
  { kind: 'attribute', classId: '2', num: '2' },
  { kind: 'attribute', classId: '3', num: '0' },
  { kind: 'attribute', classId: '4', num: '0' },
  { kind: 'attribute', classId: '4', num: '1' },
]

const mockTypes = [
  { kind: 'type', id: '5' },
  { kind: 'type', id: '6' },
  { kind: 'type', id: '7' },
  { kind: 'type', id: '8' },
  { kind: 'type', id: '9' },
]

const mockObjects = [
  ...mockNamespaces,
  ...mockClasses,
  ...mockAttributes,
  ...mockTypes,
]

const catalog = new PGCatalog(mockObjects)

test('will fail if there is an unrecognized object kind', t => {
  t.throws(() => new PGCatalog([{ kind: 'yo' }]))
})

test('getNamespaces will get all of the namespaces', t => {
  t.deepEqual(catalog.getNamespaces(), mockNamespaces)
})

test('getNamespace will get a single namespace', t => {
  t.is(catalog.getNamespace('0'), mockNamespaces[0])
  t.is(catalog.getNamespace('1'), mockNamespaces[1])
  t.is(catalog.getNamespace('2'), undefined)
})

test('assertGetNamespace will get a single namespace or fail', t => {
  t.is(catalog.assertGetNamespace('0'), mockNamespaces[0])
  t.is(catalog.assertGetNamespace('1'), mockNamespaces[1])
  t.throws(() => catalog.assertGetNamespace('2'))
})

test('getClasses will get all of the classes', t => {
  t.deepEqual(catalog.getClasses(), mockClasses)
})

test('getClass will get a single class', t => {
  t.is(catalog.getClass('1'), undefined)
  t.is(catalog.getClass('2'), mockClasses[0])
  t.is(catalog.getClass('3'), mockClasses[1])
  t.is(catalog.getClass('4'), mockClasses[2])
})

test('assertGetClass will get a single class or fail', t => {
  t.throws(() => catalog.assertGetClass('1'))
  t.is(catalog.assertGetClass('2'), mockClasses[0])
  t.is(catalog.assertGetClass('3'), mockClasses[1])
  t.is(catalog.assertGetClass('4'), mockClasses[2])
})

test('getAttributes will get all of the attributes', t => {
  t.deepEqual(catalog.getAttributes(), mockAttributes)
})

test('getAttribute will get a single attribute', t => {
  t.is(catalog.getAttribute('0', '0'), undefined)
  t.is(catalog.getAttribute('2', '0'), mockAttributes[0])
  t.is(catalog.getAttribute('2', '1'), mockAttributes[1])
  t.is(catalog.getAttribute('2', '2'), mockAttributes[2])
  t.is(catalog.getAttribute('2', '3'), undefined)
  t.is(catalog.getAttribute('3', '0'), mockAttributes[3])
})

test('getClassAttributes will get all the attributes for a class', t => {
  t.deepEqual(catalog.getClassAttributes('0'), [])
  t.deepEqual(catalog.getClassAttributes('2'), [mockAttributes[0], mockAttributes[1], mockAttributes[2]])
  t.deepEqual(catalog.getClassAttributes('3'), [mockAttributes[3]])
  t.deepEqual(catalog.getClassAttributes('4'), [mockAttributes[4], mockAttributes[5]])
})

test('getTypes will get all of the types', t => {
  t.deepEqual(catalog.getTypes(), mockTypes)
})

test('getType will get a single type', t => {
  t.is(catalog.getType('4'), undefined)
  t.is(catalog.getType('5'), mockTypes[0])
  t.is(catalog.getType('6'), mockTypes[1])
  t.is(catalog.getType('7'), mockTypes[2])
})

test('hasType will detect if a specific type exists', t => {
  t.true(catalog.hasType(mockTypes[0]))
  t.true(catalog.hasType(mockTypes[1]))
  t.true(catalog.hasType(mockTypes[2]))
  t.false(catalog.hasType({ kind: 'type', id: '5' }))
})

test('assertGetType will get a single type or throw an error', t => {
  t.throws(() => catalog.assertGetType('4'))
  t.is(catalog.assertGetType('5'), mockTypes[0])
  t.is(catalog.assertGetType('6'), mockTypes[1])
  t.is(catalog.assertGetType('7'), mockTypes[2])
})
