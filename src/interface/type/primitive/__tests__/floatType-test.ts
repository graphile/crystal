import NamedType from '../../NamedType'
import floatType from '../floatType'

test('is a singleton NamedType', () => {
  expect(floatType instanceof NamedType).toBe(true)
})

test('getName returns float', () => {
  expect(floatType.getName()).toBe('float')
})
