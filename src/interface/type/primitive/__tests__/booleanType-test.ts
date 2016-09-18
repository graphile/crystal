import NamedType from '../../NamedType'
import booleanType from '../booleanType'

test('is a singleton NamedType', () => {
  expect(booleanType instanceof NamedType).toBe(true)
})

test('getName returns boolean', () => {
  expect(booleanType.getName()).toBe('boolean')
})
