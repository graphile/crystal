import NamedType from '../../NamedType'
import stringType from '../stringType'

test('is a singleton NamedType', () => {
  expect(stringType instanceof NamedType).toBe(true)
})

test('getName returns string', () => {
  expect(stringType.getName()).toBe('string')
})
