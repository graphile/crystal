import test from 'ava'
import NamedType from '../NamedType'

test('getName will return the name', t => {
  const name = Symbol('name')
  const namedType = new NamedType(name)
  t.is(namedType.getName(), name)
})

test('setDescription will set the description', t => {
  const description = Symbol('description')
  const namedType = new NamedType()
  t.is(namedType.getDescription(), undefined)
  namedType.setDescription(description)
  t.is(namedType.getDescription(), description)
})
