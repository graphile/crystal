import PgCatalog from '../PgCatalog'

const mockNamespaces = [
  { kind: 'namespace', id: '0', name: 'a' },
  { kind: 'namespace', id: '1', name: 'b' },
]

const mockClasses = [
  { kind: 'class', id: '2', name: 'a', namespaceId: '0' },
  { kind: 'class', id: '3', name: 'a', namespaceId: '1' },
  { kind: 'class', id: '4', name: 'b', namespaceId: '1' },
]

const mockAttributes = [
  { kind: 'attribute', classId: '2', num: 0, name: 'a' },
  { kind: 'attribute', classId: '2', num: 1, name: 'b' },
  { kind: 'attribute', classId: '2', num: 2, name: 'c' },
  { kind: 'attribute', classId: '3', num: 0, name: 'a' },
  { kind: 'attribute', classId: '4', num: 0, name: 'b' },
  { kind: 'attribute', classId: '4', num: 1, name: 'c' },
]

const mockTypes = [
  { kind: 'type', id: '5', name: 'a', namespaceId: '0' },
  { kind: 'type', id: '6', name: 'a', namespaceId: '1' },
  { kind: 'type', id: '7', name: 'b', namespaceId: '1' },
  { kind: 'type', id: '8', name: 'c', namespaceId: '0' },
  { kind: 'type', id: '9', name: 'd', namespaceId: '1' },
]

const mockConstraints = [
  { kind: 'constraint' },
  { kind: 'constraint' },
  { kind: 'constraint' },
]

const mockObjects = [
  ...mockNamespaces,
  ...mockClasses,
  ...mockAttributes,
  ...mockTypes,
  ...mockConstraints,
]

const catalog = new PgCatalog(mockObjects)

test('will fail if there is an unrecognized object kind', () => {
  expect(() => new PgCatalog([{ kind: 'yo' }])).toThrow()
})

test('getNamespaces will get all of the namespaces', () => {
  expect(catalog.getNamespaces()).toEqual(mockNamespaces)
})

test('getNamespace will get a single namespace', () => {
  expect(catalog.getNamespace('0')).toEqual(mockNamespaces[0])
  expect(catalog.getNamespace('1')).toEqual(mockNamespaces[1])
  expect(catalog.getNamespace('2')).toEqual(undefined)
})

test('assertGetNamespace will get a single namespace or fail', () => {
  expect(catalog.assertGetNamespace('0')).toEqual(mockNamespaces[0])
  expect(catalog.assertGetNamespace('1')).toEqual(mockNamespaces[1])
  expect(() => catalog.assertGetNamespace('2')).toThrow()
})

test('getNamespaceByName will get a single namespace by its name', () => {
  expect(catalog.getNamespaceByName('a')).toEqual(mockNamespaces[0])
  expect(catalog.getNamespaceByName('b')).toEqual(mockNamespaces[1])
  expect(catalog.getNamespaceByName('c')).toEqual(undefined)
})

test('getClasses will get all of the classes', () => {
  expect(catalog.getClasses()).toEqual(mockClasses)
})

test('getClass will get a single class', () => {
  expect(catalog.getClass('1')).toBe(undefined)
  expect(catalog.getClass('2')).toBe(mockClasses[0])
  expect(catalog.getClass('3')).toBe(mockClasses[1])
  expect(catalog.getClass('4')).toBe(mockClasses[2])
})

test('assertGetClass will get a single class or fail', () => {
  expect(() => catalog.assertGetClass('1')).toThrow()
  expect(catalog.assertGetClass('2')).toBe(mockClasses[0])
  expect(catalog.assertGetClass('3')).toBe(mockClasses[1])
  expect(catalog.assertGetClass('4')).toBe(mockClasses[2])
})

test('getClassByName will get a single class by name', () => {
  expect(catalog.getClassByName('a', 'a')).toBe(mockClasses[0])
  expect(catalog.getClassByName('b', 'a')).toBe(mockClasses[1])
  expect(catalog.getClassByName('b', 'b')).toBe(mockClasses[2])
  expect(catalog.getClassByName('b', 'c')).toBe(undefined)
  expect(catalog.getClassByName('c', 'a')).toBe(undefined)
})

test('getAttributes will get all of the attributes', () => {
  expect(catalog.getAttributes()).toEqual(mockAttributes)
})

test('getAttribute will get a single attribute', () => {
  expect(catalog.getAttribute('0', '0')).toBe(undefined)
  expect(catalog.getAttribute('2', '0')).toBe(mockAttributes[0])
  expect(catalog.getAttribute('2', '1')).toBe(mockAttributes[1])
  expect(catalog.getAttribute('2', '2')).toBe(mockAttributes[2])
  expect(catalog.getAttribute('2', '3')).toBe(undefined)
  expect(catalog.getAttribute('3', '0')).toBe(mockAttributes[3])
})

test('assertGetAttribute will get a single attribute or throw', () => {
  expect(() => catalog.assertGetAttribute('0', '0')).toThrow()
  expect(catalog.assertGetAttribute('2', '0')).toBe(mockAttributes[0])
  expect(catalog.assertGetAttribute('2', '1')).toBe(mockAttributes[1])
  expect(catalog.assertGetAttribute('2', '2')).toBe(mockAttributes[2])
  expect(() => catalog.assertGetAttribute('2', '3')).toThrow()
  expect(catalog.assertGetAttribute('3', '0')).toBe(mockAttributes[3])
})

test('getClassAttributes will get all the attributes for a class', () => {
  expect(catalog.getClassAttributes('0')).toEqual([])
  expect(catalog.getClassAttributes('2')).toEqual([mockAttributes[0], mockAttributes[1], mockAttributes[2]])
  expect(catalog.getClassAttributes('3')).toEqual([mockAttributes[3]])
  expect(catalog.getClassAttributes('4')).toEqual([mockAttributes[4], mockAttributes[5]])
})

test('getClassAttributes will only get class attributes of certain positions if passed an extra argument', () => {
  expect(catalog.getClassAttributes('2', [])).toEqual([])
  expect(catalog.getClassAttributes('2', [0, 2])).toEqual([mockAttributes[0], mockAttributes[2]])
  expect(catalog.getClassAttributes('2', [2, 0])).toEqual([mockAttributes[2], mockAttributes[0]])
  expect(catalog.getClassAttributes('2', [1])).toEqual([mockAttributes[1]])
})

test('getAttributeByName will get an attribute by its name', () => {
  expect(catalog.getAttributeByName('a', 'a', 'a')).toBe(mockAttributes[0])
  expect(catalog.getAttributeByName('a', 'a', 'b')).toBe(mockAttributes[1])
  expect(catalog.getAttributeByName('a', 'a', 'c')).toBe(mockAttributes[2])
  expect(catalog.getAttributeByName('a', 'a', 'd')).toBe(undefined)
  expect(catalog.getAttributeByName('b', 'a', 'a')).toBe(mockAttributes[3])
  expect(catalog.getAttributeByName('b', 'b', 'b')).toBe(mockAttributes[4])
  expect(catalog.getAttributeByName('b', 'b', 'c')).toBe(mockAttributes[5])
  expect(catalog.getAttributeByName('b', 'c', 'c')).toBe(undefined)
  expect(catalog.getAttributeByName('c', 'a', 'a')).toBe(undefined)
})

test('getTypes will get all of the types', () => {
  expect(catalog.getTypes()).toEqual(mockTypes)
})

test('getType will get a single type', () => {
  expect(catalog.getType('4')).toBe(undefined)
  expect(catalog.getType('5')).toBe(mockTypes[0])
  expect(catalog.getType('6')).toBe(mockTypes[1])
  expect(catalog.getType('7')).toBe(mockTypes[2])
})

test('hasType will detect if a specific type exists', () => {
  expect(catalog.hasType(mockTypes[0])).toBe(true)
  expect(catalog.hasType(mockTypes[1])).toBe(true)
  expect(catalog.hasType(mockTypes[2])).toBe(true)
  expect(catalog.hasType(Object.assign({}, mockTypes[0]))).toBe(false)
})

test('assertGetType will get a single type or throw an error', () => {
  expect(() => catalog.assertGetType('4')).toThrow()
  expect(catalog.assertGetType('5')).toBe(mockTypes[0])
  expect(catalog.assertGetType('6')).toBe(mockTypes[1])
  expect(catalog.assertGetType('7')).toBe(mockTypes[2])
})

test('getTypeByName will get a type by its name', () => {
  expect(catalog.getTypeByName('a', 'a')).toBe(mockTypes[0])
  expect(catalog.getTypeByName('b', 'a')).toBe(mockTypes[1])
  expect(catalog.getTypeByName('b', 'b')).toBe(mockTypes[2])
  expect(catalog.getTypeByName('b', 'c')).toBe(undefined)
  expect(catalog.getTypeByName('a', 'c')).toBe(mockTypes[3])
  expect(catalog.getTypeByName('c', 'a')).toBe(undefined)
})

test('getConstraints will get all constraints', () => {
  expect(catalog.getConstraints()).toEqual(mockConstraints)
})
