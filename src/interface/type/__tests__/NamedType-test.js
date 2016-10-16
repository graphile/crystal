import NamedType from '../NamedType'

test('name will return the name', () => {
  const name = Symbol('name')
  const namedType = new NamedType({ name })
  expect(namedType.name).toBe(name)
})

test('description will return the name', () => {
  const description = Symbol('description')
  const namedType = new NamedType({ description })
  expect(namedType.description).toBe(description)
})
