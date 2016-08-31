import test from 'ava'
import ObjectField from '../ObjectField'

test('getName will return the name', t => {
  const name = Symbol('name')
  const type = Symbol('type')
  const field = new ObjectField(name, type)
  t.is(field.getName(), name)
})

test('getType will return the type', t => {
  const name = Symbol('name')
  const type = Symbol('type')
  const field = new ObjectField(name, type)
  t.is(field.getType(), type)
})

test('setDescription will set the description', t => {
  const description = Symbol('description')
  const field = new ObjectField()
  t.is(field.getDescription(), undefined)
  field.setDescription(description)
  t.is(field.getDescription(), description)
})
