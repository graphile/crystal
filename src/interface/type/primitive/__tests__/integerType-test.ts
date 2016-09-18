import NamedType from '../../NamedType'
import integerType from '../integerType'

test('is a singleton NamedType', () => {
  expect(integerType instanceof NamedType).toBe(true)
})

test('getName returns integer', () => {
  expect(integerType.getName()).toBe('integer')
})
