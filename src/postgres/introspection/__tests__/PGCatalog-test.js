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

test('will fail if there is an unrecognized object kind', () => {
  expect(() => new PGCatalog([{ kind: 'yo' }])).toThrow()
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

test('getClassAttributes will get all the attributes for a class', () => {
  expect(catalog.getClassAttributes('0')).toEqual([])
  expect(catalog.getClassAttributes('2')).toEqual([mockAttributes[0], mockAttributes[1], mockAttributes[2]])
  expect(catalog.getClassAttributes('3')).toEqual([mockAttributes[3]])
  expect(catalog.getClassAttributes('4')).toEqual([mockAttributes[4], mockAttributes[5]])
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
