import NamedType from '../NamedType'

test('getName will return the name', () => {
  const name = Symbol('name')
  const namedType = new NamedType(name)
  expect(namedType.getName()).toBe(name)
})

test('setDescription will set the description', () => {
  const description = Symbol('description')
  const namedType = new NamedType()
  expect(namedType.getDescription()).toBe(undefined)
  namedType.setDescription(description)
  expect(namedType.getDescription()).toBe(description)
})
