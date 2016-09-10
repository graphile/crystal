import ObjectField from '../ObjectField'

test('getName will return the name', () => {
  const name = Symbol('name')
  const type = Symbol('type')
  const field = new ObjectField(name, type)
  expect(field.getName()).toBe(name)
})

test('getType will return the type', () => {
  const name = Symbol('name')
  const type = Symbol('type')
  const field = new ObjectField(name, type)
  expect(field.getType()).toBe(type)
})

test('setDescription will set the description', () => {
  const description = Symbol('description')
  const field = new ObjectField()
  expect(field.getDescription()).toBe(undefined)
  field.setDescription(description)
  expect(field.getDescription()).toBe(description)
})
